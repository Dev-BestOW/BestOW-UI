/**
 * Windows 고대비(강제 색상) 모드. 브라우저가 배경색·그림자를 지우고 시스템 색으로 바꾸므로,
 * 상태(선택·켜짐·진행률·강조)를 배경색이나 그림자로만 보여 주는 요소는 이 미디어쿼리에서 시스템 색으로 다시 그린다.
 * 시스템 색 이름: Canvas(배경)·CanvasText(글자)·Highlight(선택 배경)·HighlightText(선택 글자)·GrayText(비활성).
 */
export const forcedColors = '(forced-colors: active)';

/** "선택됨·현재·강조" — 운영체제 목록 선택과 같은 색. forced-color-adjust: none 이라야 지정한 시스템 색이 그대로 쓰인다 */
export const systemHighlight = {
  forcedColorAdjust: 'none',
  backgroundColor: 'Highlight',
  color: 'HighlightText',
} as const;
