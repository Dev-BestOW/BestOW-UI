import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './contract.css';

const base = style({
  color: vars.color.fg.default,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  // 한글은 단어 중간에서 끊지 않는다("정노/을" 방지). 띄어쓰기 없이 긴 문자열(URL 등)은 넘치지 않게 그때만 끊는다.
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

export const root = style([base, { backgroundColor: vars.color.bg.default }]);

/** Portal(Modal, Tooltip 등)로 body 에 렌더링되는 요소의 루트. 배경은 각 컴포넌트가 정한다. */
export const portal = base;

globalStyle(`${base}, ${base} *, ${base} *::before, ${base} *::after`, {
  boxSizing: 'border-box',
});
