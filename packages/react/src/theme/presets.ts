import type { ThemeInput } from './createTheme';

/**
 * 입력 칸 테두리를 배경과 3:1 이상으로 올리는 테마 입력 (WCAG 1.4.11 비텍스트 대비).
 * 기본 테두리(border.default)는 흰 배경과 1.3:1 이라 칸의 경계가 잘 보이지 않는다 — 2.0 에서 기본값이 될 예정.
 * hover 는 테두리보다 더 진하게(다크는 더 밝게) 바뀐다.
 *
 * @example
 * <ThemeProvider overrides={createTheme(strongInputBorders)}>…</ThemeProvider>
 * createTheme(createIntentColors('primary', '#7c3aed'), strongInputBorders) // 브랜드 테마와 함께
 */
// 색은 palette 를 import 하지 않고 값으로 적는다 — `palette.gray[600]` 같은 속성 읽기는 번들러가 지우지 못해,
// 이 값을 쓰지 않는 앱에도 tokens 전체가 딸려 왔다("앱 기본" +460 B). palette 와 같은지는 presets.test.ts 가 확인한다.
export const strongInputBorders: ThemeInput = /* @__PURE__ */ Object.freeze({
  // 라이트: gray600 / gray700 — 흰 배경 5.18:1, bg.subtle(gray50) 4.91:1
  light: { color: { border: { input: '#666e76', inputHover: '#495057' } } },
  // 다크: gray500 / gray300 — gray600 은 bg.subtle(gray900) 위에서 2.98:1 이라 한 단계 밝게. bg.default 8.57:1, bg.subtle 7.43:1
  dark: { color: { border: { input: '#adb5bd', inputHover: '#dee2e6' } } },
});
