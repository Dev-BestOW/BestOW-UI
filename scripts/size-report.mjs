// size-limit 결과(--json)를 base 브랜치와 비교해 PR 코멘트용 마크다운 표를 만든다. (.github/workflows/size.yml 에서 사용)
//
//   node scripts/size-report.mjs <base.json> <pr.json>
//
// base.json 이 없거나 읽을 수 없으면(base 빌드 실패 등) 이 PR 의 크기만 보여 준다.
// 항목은 이름(.size-limit.json 의 name)으로 짝짓는다 — 이름을 바꾸면 "새 항목" 으로 나온다.
import { readFileSync } from 'node:fs';

/** 코멘트를 찾아 갱신할 때 쓰는 표식 (size.yml 과 같아야 한다) */
export const MARKER = '<!-- bestow-size-report -->';

// size-limit 과 같은 1000 단위
const formatBytes = (bytes) => {
  const abs = Math.abs(bytes);
  return `${bytes < 0 ? '−' : ''}${abs < 1000 ? `${abs} B` : `${(abs / 1000).toFixed(2)} kB`}`;
};

function formatDelta(pr, base) {
  if (base === undefined) return '새 항목';
  const diff = pr - base;
  if (diff === 0) return '0';
  const sign = diff > 0 ? '+' : '−';
  const percent = base === 0 ? '' : ` (${sign}${((Math.abs(diff) / base) * 100).toFixed(1)}%)`;
  return `${diff > 0 ? '🔺' : '🔽'} ${sign}${formatBytes(Math.abs(diff))}${percent}`;
}

function status(entry) {
  if (!entry.passed) return '❌ 한도 초과';
  // 한도의 95% 이상이면 미리 알린다
  if (entry.sizeLimit && entry.size >= entry.sizeLimit * 0.95) return '⚠️ 한도 근접';
  return '✅';
}

/**
 * @param {Array<{ name: string, size: number, sizeLimit?: number, passed: boolean }> | null} base
 * @param {Array<{ name: string, size: number, sizeLimit?: number, passed: boolean }>} pr
 */
export function buildReport(base, pr) {
  const baseByName = new Map((base ?? []).map((entry) => [entry.name, entry]));
  const rows = pr.map((entry) => {
    const before = baseByName.get(entry.name)?.size;
    const limit = entry.sizeLimit === undefined ? '—' : formatBytes(entry.sizeLimit);
    const room = entry.sizeLimit === undefined ? '—' : formatBytes(entry.sizeLimit - entry.size);
    const cells = [entry.name, formatBytes(entry.size)];
    if (base) cells.push(before === undefined ? '—' : formatBytes(before), formatDelta(entry.size, before));
    cells.push(limit, room, status(entry));
    return `| ${cells.join(' | ')} |`;
  });
  const removed = base ? base.filter((entry) => !pr.some((p) => p.name === entry.name)) : [];

  const header = base
    ? ['| 항목 | 이 PR | base | 변화 | 한도 | 여유 | 상태 |', '|---|---:|---:|---:|---:|---:|:---:|']
    : ['| 항목 | 이 PR | 한도 | 여유 | 상태 |', '|---|---:|---:|---:|:---:|'];
  const failed = pr.filter((entry) => !entry.passed).length;
  const changed = base && pr.some((entry) => baseByName.get(entry.name)?.size !== entry.size);

  return [
    MARKER,
    '## 📦 번들 크기 (size-limit)',
    '',
    failed > 0
      ? `**❌ ${failed}개 항목이 한도를 넘었어요.** CI 의 "Bundle size" 단계가 실패해요.`
      : base && !changed
        ? '크기 변화가 없어요.'
        : '모든 항목이 한도 안이에요.',
    '',
    ...header,
    ...rows,
    ...(removed.length > 0 ? ['', `이 PR 에서 없어진 항목: ${removed.map((entry) => entry.name).join(', ')}`] : []),
    ...(base ? [] : ['', '_base 브랜치 측정에 실패해 이 PR 의 크기만 보여요._']),
    '',
    '<sub>minify + brotli 기준 · 한도는 `.size-limit.json` · 이 코멘트는 push 할 때마다 갱신돼요.</sub>',
    '',
  ].join('\n');
}

function readJson(path) {
  try {
    const value = JSON.parse(readFileSync(path, 'utf8'));
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [basePath, prPath] = process.argv.slice(2);
  const pr = prPath && readJson(prPath);
  if (!pr) {
    console.error('사용법: node scripts/size-report.mjs <base.json> <pr.json> — pr.json 을 읽을 수 없어요.');
    process.exit(1);
  }
  process.stdout.write(buildReport(basePath ? readJson(basePath) : null, pr));
}
