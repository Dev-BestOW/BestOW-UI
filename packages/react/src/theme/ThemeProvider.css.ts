import { globalStyle, style } from '@vanilla-extract/css';
import { systemThemeClass, themeClass, vars } from './contract.css';

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

// 브라우저가 그리는 부분(스크롤바·네이티브 컨트롤·자동 완성 배경)도 모드를 따르게 한다. portal 도 같은 클래스를 받는다.
globalStyle(themeClass.light, { colorScheme: 'light' });
globalStyle(themeClass.dark, { colorScheme: 'dark' });
globalStyle(systemThemeClass, { colorScheme: 'light dark' });
