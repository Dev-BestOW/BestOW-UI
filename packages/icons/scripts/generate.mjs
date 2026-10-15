// svg/*.svg 를 읽어 src/generated/icons.ts 를 만든다.
// 사용법: pnpm --filter @bestow-ui/icons generate
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgDir = join(root, 'svg');
const outFile = join(root, 'src/generated/icons.ts');

// 아이콘마다 다를 수 있는 루트 속성과 기본값 (src/createIcon.tsx 의 defaultAttrs 와 같아야 한다).
// 기본값과 다른 속성만 아이콘별로 기록한다. 나머지(xmlns, width, height 등)는 createIcon 이 정한다.
const ROOT_DEFAULTS = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
const CHILD_TAGS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);

const camelCase = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const pascalCase = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

function parseAttrs(source) {
  const attrs = {};
  for (const [, key, value] of source.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[key] = value;
  return attrs;
}

function parseSvg(file) {
  const svg = readFileSync(join(svgDir, file), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const rootMatch = svg.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
  if (!rootMatch) throw new Error(`${file}: <svg> 루트를 찾을 수 없어요.`);

  const rootAttrs = parseAttrs(rootMatch[1]);
  if (rootAttrs.viewBox !== '0 0 24 24') throw new Error(`${file}: viewBox 는 "0 0 24 24" 여야 해요.`);

  const body = rootMatch[2].trim();
  const children = [];
  const rest = body.replace(/<(\w+)([^>]*?)\/>/g, (_, tag, attrSource) => {
    if (!CHILD_TAGS.has(tag)) throw new Error(`${file}: 지원하지 않는 요소 <${tag}> 예요.`);
    const attrs = Object.fromEntries(Object.entries(parseAttrs(attrSource)).map(([k, v]) => [camelCase(k), v]));
    children.push([tag, attrs]);
    return '';
  });
  if (rest.trim())
    throw new Error(`${file}: 그룹(<g>)이나 닫는 태그가 있는 요소는 지원하지 않아요. 도형을 평탄화해 주세요.`);

  const overrides = Object.fromEntries(
    Object.entries(rootAttrs)
      .filter(([k, v]) => k in ROOT_DEFAULTS && ROOT_DEFAULTS[k] !== v)
      .map(([k, v]) => [camelCase(k), v]),
  );
  return { children, overrides };
}

const files = readdirSync(svgDir)
  .filter((f) => f.endsWith('.svg'))
  .sort();
const lines = [
  '// 이 파일은 scripts/generate.mjs 가 만든다. 직접 수정하지 말고 svg/ 폴더를 수정한 뒤 `pnpm generate` 를 실행하세요.',
  "import { createIcon } from '../createIcon';",
  '',
];

for (const file of files) {
  const name = pascalCase(file.replace(/\.svg$/, ''));
  const { children, overrides } = parseSvg(file);
  const args = [JSON.stringify(name), JSON.stringify(children)];
  if (Object.keys(overrides).length) args.push(JSON.stringify(overrides));
  lines.push(`export const ${name}Icon = /* @__PURE__ */ createIcon(${args.join(', ')});`);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, lines.join('\n') + '\n');
console.log(`${files.length}개 아이콘을 생성했어요 → src/generated/icons.ts`);
