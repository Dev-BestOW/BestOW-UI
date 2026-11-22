// /changelog/ 쪽이 빌드 때 읽는 패키지 변경 기록 — 서버 컴포넌트(정적 export)에서만 부른다(fs·git).
// 글은 changesets 가 만든 packages/*/CHANGELOG.md 그대로(이미 한국어), 날짜는 git 태그(@bestow-ui/<패키지>@<버전>)의 커밋 날짜.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const packages = [
  { dir: 'react', name: '@bestow-ui/react' },
  { dir: 'tokens', name: '@bestow-ui/tokens' },
  { dir: 'korean-utils', name: '@bestow-ui/korean-utils' },
  { dir: 'icons', name: '@bestow-ui/icons' },
] as const;

export type ChangeKind = 'major' | 'minor' | 'patch';

export interface Release {
  /** npm 패키지 이름 */
  pkg: string;
  version: string;
  /** 'YYYY-MM-DD' */
  date: string;
  /** 항목 하나 = 마크다운 조각(첫 줄 + 들여쓴 하위 목록). 커밋 해시와 "Updated dependencies" 는 뺐다 */
  sections: { kind: ChangeKind; items: string[] }[];
}

const kinds: Record<string, ChangeKind> = {
  'Major Changes': 'major',
  'Minor Changes': 'minor',
  'Patch Changes': 'patch',
};

/** CHANGELOG.md → 버전별 항목(날짜 없이). 새 버전이 위에 있는 changesets 형식 */
export function parseChangelog(markdown: string): { version: string; sections: Release['sections'] }[] {
  const releases: { version: string; sections: Release['sections'] }[] = [];
  let section: Release['sections'][number] | undefined;
  let item: string[] | undefined;
  const closeItem = () => {
    if (item && section) {
      const text = item.join('\n').trimEnd();
      // 다른 패키지 버전에 맞춰 올린 것뿐이라 독자에게 정보가 없다(그 패키지 항목에 이미 있음)
      if (!/^Updated dependencies/.test(text)) section.items.push(text);
    }
    item = undefined;
  };
  for (const line of markdown.split('\n')) {
    const version = line.match(/^## (\d+\.\d+\.\d+)\s*$/);
    const heading = line.match(/^### (.+?)\s*$/);
    if (version) {
      closeItem();
      section = undefined;
      releases.push({ version: version[1]!, sections: [] });
    } else if (heading) {
      closeItem();
      const kind = kinds[heading[1]!];
      if (!kind) throw new Error(`CHANGELOG 의 모르는 제목: ${heading[1]}`);
      section = { kind, items: [] };
      releases.at(-1)?.sections.push(section);
    } else if (line.startsWith('- ')) {
      closeItem();
      // changesets 가 붙이는 커밋 해시 "c28dc18: " 를 뗀다
      item = [line.slice(2).replace(/^[0-9a-f]{7,}: /, '')];
    } else if (item && (line.startsWith('  ') || line.trim() === '')) {
      item.push(line.slice(2));
    }
  }
  closeItem();
  for (const release of releases) release.sections = release.sections.filter((s) => s.items.length > 0);
  return releases;
}

/** 저장소 루트(pnpm-workspace.yaml 이 있는 곳) — next build·vitest 모두 apps/site 에서 실행된다 */
function repoRoot(): string {
  let dir = process.cwd();
  while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error('저장소 루트(pnpm-workspace.yaml)를 찾지 못했어요');
    dir = parent;
  }
  return dir;
}

const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/**
 * 배포 날짜 — 태그의 커밋 날짜. 태그가 없는 버전(손으로 배포한 첫 버전)은 CHANGELOG 에 그 버전 제목이 처음 들어간 커밋 날짜.
 * 커밋 하나만 받은 저장소(actions/checkout 기본값)에서는 둘 다 틀린 값이 되므로 빌드를 멈춘다 — workflow 에 fetch-depth: 0.
 */
function releaseDate(root: string, pkg: string, dir: string, version: string): string {
  const tag = `refs/tags/${pkg}@${version}`;
  try {
    return git(root, ['log', '-1', '--format=%cs', tag]);
  } catch {
    const added = git(root, [
      'log',
      '--reverse',
      '--format=%cs',
      `-S## ${version}`,
      '--',
      `packages/${dir}/CHANGELOG.md`,
    ]);
    const date = added.split('\n')[0];
    if (!date) throw new Error(`${pkg}@${version}: 태그도, CHANGELOG 에 들어간 커밋도 찾지 못했어요`);
    return date;
  }
}

/** 모든 패키지의 배포 기록 — 최근 것이 앞(같은 날이면 packages 순서) */
export function releases(): Release[] {
  const root = repoRoot();
  if (git(root, ['rev-parse', '--is-shallow-repository']) === 'true') {
    throw new Error(
      'git 기록이 얕아(shallow) 배포 날짜를 알 수 없어요 — actions/checkout 에 fetch-depth: 0 이 필요해요',
    );
  }
  const all = packages.flatMap(({ dir, name }, order) =>
    parseChangelog(readFileSync(join(root, 'packages', dir, 'CHANGELOG.md'), 'utf8')).map((release) => ({
      pkg: name,
      version: release.version,
      date: releaseDate(root, name, dir, release.version),
      sections: release.sections,
      order,
    })),
  );
  return all
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)
    .map(({ order: _order, ...release }) => release);
}

/** 화면에 보일 날짜 '2026년 11월 19일' */
export function koreanDay(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
