/**
 * 모든 컴포넌트 스타일을 감싸는 CSS 레이어(2.0). 레이어 밖(unlayered)의 사용자 CSS 는 선택자 우선순위와 관계없이 항상 이긴다 —
 * `className` 으로 덮어쓰기가 쉬워지는 대신, 레이어 밖의 리셋 CSS(`button { padding: 0 }` 등)도 컴포넌트를 덮는다.
 * 레이어 이름은 사용자가 `@layer` 순서에 적는 공개 API 다(Storybook 가이드 "Tailwind 와 함께 쓰기").
 *
 * 앞에 `@layer base, bestow;` 를 함께 적는다 — 레이어 순서는 처음 선언한 순서라, Tailwind v4(theme, base, components, utilities)를
 * 먼저 불러오든 나중에 불러오든 BestOW 가 리셋(base)보다 뒤(우선)에 온다. 먼저 불러오면 utilities 가 BestOW 를 이긴다.
 *
 * 빌드(tsup.config.ts 의 dist/index.css)와 Storybook(.storybook/main.ts 의 Vite 플러그인)이 같은 함수를 써서 화면이 같다.
 * 이 파일은 src/index.ts 에서 내보내지 않는다(빌드 도구 전용).
 */
export const CSS_LAYER = 'bestow';

const prelude = `@layer base, ${CSS_LAYER};\n@layer ${CSS_LAYER} {\n`;

/** 소스맵이 맞도록 앞에 넣은 줄 수 — 소스맵 mappings 앞에 이만큼 `;` 를 붙인다 */
export const LAYER_PRELUDE_LINES = prelude.split('\n').length - 1;

/** CSS 전체를 레이어로 감싼다. 끝의 `sourceMappingURL` 주석은 레이어 밖에 남긴다. */
export function wrapInLayer(css: string): string {
  const match = /\/\*# sourceMappingURL=[^*]*\*\/\s*$/.exec(css);
  const body = match ? css.slice(0, match.index) : css;
  return `${prelude}${body.replace(/\s*$/, '')}\n}\n${match ? match[0].trim() + '\n' : ''}`;
}
