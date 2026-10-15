import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.muted,
});

export const item = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  minWidth: 0,
});

// Link 의 기본 색·굵기를 덮어쓴다. '&&' 로 구체성을 올려 CSS 순서와 상관없이 적용되게 한다
export const link = style({
  selectors: {
    '&&': { fontWeight: vars.font.weight.regular, color: vars.color.fg.muted },
    '&&:hover': { color: vars.color.fg.default },
  },
});

export const current = style({
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const separator = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
});
