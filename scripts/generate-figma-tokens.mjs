// @bestow-ui/tokens → Figma 변수·스타일 정의(JSON). 코드가 원본이고 Figma 는 이 JSON 으로 맞춘다(docs/FIGMA.md).
//   pnpm build 뒤: node scripts/generate-figma-tokens.mjs [출력 파일 = stdout]
// - 변수 이름은 CSS 변수 경로와 같다: Color 컬렉션 `primary/solid-hover` ↔ `--bestow-color-primary-solid-hover`.
//   Dev Mode 의 코드 표시(codeSyntax WEB)에 그 CSS 변수가 나온다.
// - 의미 색(Color: Light·Dark)은 값이 같은 팔레트 색이 있으면 Primitives 변수를 가리킨다(alias). 반투명 색 등은 값 그대로.
// - 글자 스타일은 Typography 의 variant 와 같게(packages/react/src/components/Typography/Typography.css.ts — 바꾸면 함께 고친다).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = await import(pathToFileURL(join(root, 'packages/tokens/dist/index.js')).href);
const {
  palette,
  lightColors,
  darkColors,
  space,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
  shadow,
  darkShadow,
} = tokens;

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const px = (v) => (v === '0' ? 0 : Number.parseFloat(v));
const cssVar = (...path) => `var(--bestow-${path.map(kebab).join('-')})`;

// ── Primitives (팔레트) — 화면에서 직접 고르지 않게 scopes 를 비운다 ──
const primitives = [];
const hexToPrimitive = new Map();
for (const [hue, value] of Object.entries(palette)) {
  const entries =
    typeof value === 'string' ? [[hue, value]] : Object.entries(value).map(([step, v]) => [`${hue}/${step}`, v]);
  for (const [name, hex] of entries) {
    primitives.push({ name, type: 'COLOR', values: { Value: hex }, scopes: [] });
    if (!hexToPrimitive.has(hex.toLowerCase())) hexToPrimitive.set(hex.toLowerCase(), name);
  }
}

// ── 의미 색 (Light·Dark) ──
const colorScopes = (group, key) => {
  if (group === 'bg') return ['FRAME_FILL', 'SHAPE_FILL'];
  if (group === 'fg') return ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
  if (group === 'border') return ['STROKE_COLOR'];
  if (key === 'text') return ['TEXT_FILL'];
  if (key === 'contrast') return ['TEXT_FILL', 'SHAPE_FILL'];
  return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
};
const colorValue = (v) => {
  const primitive = hexToPrimitive.get(v.toLowerCase());
  return primitive ? { alias: primitive } : v;
};
const color = [];
for (const [group, values] of Object.entries(lightColors)) {
  for (const key of Object.keys(values)) {
    color.push({
      name: `${group}/${kebab(key)}`,
      type: 'COLOR',
      values: { Light: colorValue(values[key]), Dark: colorValue(darkColors[group][key]) },
      scopes: colorScopes(group, key),
      web: cssVar('color', group, key),
    });
  }
}

const floats = (collection, entries, scopes, varPath) =>
  entries.map(([key, value]) => ({
    name: key,
    type: 'FLOAT',
    values: { Value: value },
    scopes,
    web: cssVar(...varPath, key),
    collection,
  }));

const spacing = floats(
  'Space',
  Object.entries(space).map(([k, v]) => [k, px(v)]),
  ['GAP', 'WIDTH_HEIGHT'],
  ['space'],
);
const radii = floats(
  'Radius',
  Object.entries(radius).map(([k, v]) => [k, px(v)]),
  ['CORNER_RADIUS'],
  ['radius'],
);
// 글자 크기 CSS 변수는 rem(16px 기준)이라 Figma 에는 px 값으로 둔다
const fontSizes = floats(
  'Typography',
  Object.entries(fontSize).map(([k, v]) => [`font-size/${k}`, px(v)]),
  ['FONT_SIZE'],
  [],
);
const fontWeights = floats(
  'Typography',
  Object.entries(fontWeight).map(([k, v]) => [`font-weight/${k}`, Number(v)]),
  ['FONT_WEIGHT'],
  [],
);
for (const v of [...fontSizes, ...fontWeights]) {
  const [kind, key] = v.name.split('/'); // font-size/xs → --bestow-font-size-xs
  v.web = cssVar('font', kind.replace(/^font-/, ''), key);
}

// ── 글자 스타일 (Typography variant) ──
const familyName = fontFamily.sans.match(/"([^"]+)"/)?.[1] ?? 'Pretendard';
const textStyle = (name, size, weight, height, letterSpacingEm = 0) => ({
  name,
  fontFamily: familyName,
  fontSize: px(fontSize[size]),
  fontWeight: Number(fontWeight[weight]),
  lineHeightPercent: Math.round(Number(lineHeight[height]) * 100),
  letterSpacingPercent: Math.round(letterSpacingEm * 100),
  description: `font-size ${size}, weight ${weight}, line-height ${height}`,
});
const textStyles = [
  textStyle('Display', '4xl', 'bold', 'tight', -0.02),
  textStyle('Heading/H1', '3xl', 'bold', 'tight', -0.02),
  textStyle('Heading/H2', '2xl', 'bold', 'tight', -0.01),
  textStyle('Heading/H3', 'xl', 'semibold', 'tight'),
  textStyle('Heading/H4', 'lg', 'semibold', 'tight'),
  textStyle('Body/Large', 'lg', 'regular', 'relaxed'),
  textStyle('Body/Default', 'md', 'regular', 'normal'),
  textStyle('Body/Small', 'sm', 'regular', 'normal'),
  textStyle('Caption', 'xs', 'regular', 'normal'),
  // 컴포넌트 글자 — Input.css.ts(label)·Button.css.ts·Badge.css.ts 와 같게
  textStyle('Label/Field', 'sm', 'medium', 'normal'),
  textStyle('Label/Button', 'sm', 'semibold', 'tight'),
  textStyle('Label/Button Large', 'md', 'semibold', 'tight'),
  textStyle('Label/Badge', 'xs', 'medium', 'tight'),
];

// ── 그림자 (효과 스타일은 모드가 없어 라이트·다크를 따로) ──
const parseShadows = (value) =>
  value.split(/,(?![^(]*\))/).map((part) => {
    const m = part
      .trim()
      .match(
        /^(-?\d+)(?:px)? (-?\d+)(?:px)? (-?\d+)(?:px)?(?: (-?\d+)(?:px)?)? rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/,
      );
    if (!m) throw new Error(`그림자 값을 읽지 못함: ${part}`);
    const [, x, y, blur, spread = '0', r, g, b, a] = m;
    return { x: +x, y: +y, blur: +blur, spread: +spread, color: { r: r / 255, g: g / 255, b: b / 255, a: +a } };
  });
const effectStyles = [
  ...Object.entries(shadow).map(([k, v]) => ({
    name: `Shadow/Light/${k}`,
    shadows: parseShadows(v),
    web: cssVar('shadow', k),
  })),
  ...Object.entries(darkShadow).map(([k, v]) => ({
    name: `Shadow/Dark/${k}`,
    shadows: parseShadows(v),
    web: cssVar('shadow', k),
  })),
];

const group = (list) => list.map(({ collection: _c, ...rest }) => rest);
const result = {
  source: '@bestow-ui/tokens',
  collections: [
    { name: 'Primitives', modes: ['Value'], variables: primitives },
    { name: 'Color', modes: ['Light', 'Dark'], variables: color },
    { name: 'Space', modes: ['Value'], variables: group(spacing) },
    { name: 'Radius', modes: ['Value'], variables: group(radii) },
    { name: 'Typography', modes: ['Value'], variables: group([...fontSizes, ...fontWeights]) },
  ],
  textStyles,
  effectStyles,
};

// Dev Mode 에 보일 CSS 변수가 실제 공개 이름인지 확인한다(이름 목록은 contract.test.ts 가 고정)
const publicNames = new Set(
  readFileSync(join(root, 'packages/react/src/theme/contract.test.ts'), 'utf8').match(/--bestow-[a-z0-9-]+/g),
);
const webNames = [...result.collections.flatMap((c) => c.variables), ...effectStyles].flatMap((v) =>
  v.web ? [v.web] : [],
);
const unknown = webNames.filter((web) => !publicNames.has(web.slice(4, -1)));
if (unknown.length) throw new Error(`공개 CSS 변수가 아닌 이름: ${unknown.join(', ')}`);

const json = JSON.stringify(result, null, 2);
if (process.argv[2]) writeFileSync(resolve(process.argv[2]), json + '\n');
else process.stdout.write(json + '\n');
