import type { ThemeInput } from './createTheme';

/**
 * 입력 칸·체크 컨트롤 테두리를 배경과 3:1 이상으로 올리는 테마 입력 (WCAG 1.4.11 비텍스트 대비).
 * 1.x 에서 2.0 기본값을 미리 켜던 묶음이다 — 2.0 부터 기본 테두리(border.input·inputHover·control)가 이 값과 같다.
 *
 * @deprecated 2.0 부터 기본값과 같아 넣지 않아도 된다. 3.0 에서 제거한다(docs/MIGRATION-2.0.md).
 * 객체 값이라 개발 모드 경고(warnOnce)는 내지 않는다 — 읽을 때 경고하려면 getter 가 필요해 tree-shaking 이 깨진다.
 */
// 색은 palette 를 import 하지 않고 값으로 적는다 — `palette.gray[600]` 같은 속성 읽기는 번들러가 지우지 못해,
// 이 값을 쓰지 않는 앱에도 tokens 전체가 딸려 왔다("앱 기본" +460 B). palette 와 같은지는 presets.test.ts 가 확인한다.
export const strongInputBorders: ThemeInput = /* @__PURE__ */ Object.freeze({
  // 라이트: gray600 / gray700 — 흰 배경 5.18:1, bg.subtle(gray50) 4.91:1
  // 체크 컨트롤: gray600 — 흰 배경 5.18:1
  light: { color: { border: { input: '#666e76', inputHover: '#495057', control: '#666e76' } } },
  // 다크: gray500 / gray300 — gray600 은 bg.subtle(gray900) 위에서 2.98:1 이라 한 단계 밝게. bg.default 8.57:1, bg.subtle 7.43:1
  // 체크 컨트롤: gray500 — 다크 기본값(border.strong)과 같다(이미 8.57:1)
  dark: { color: { border: { input: '#adb5bd', inputHover: '#dee2e6', control: '#adb5bd' } } },
});
