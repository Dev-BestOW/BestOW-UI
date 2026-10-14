import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './contract.css';

export const root = style({
  color: vars.color.fg.default,
  backgroundColor: vars.color.bg.default,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle(`${root} *, ${root} *::before, ${root} *::after`, {
  boxSizing: 'border-box',
});
