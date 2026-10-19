import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

// 포커스를 받는 묶음 — 키보드로 온 게 아니라 스크립트로 옮긴 포커스라 링은 Alert 테두리로 충분하다
export const root = style({
  outline: 'none',
  borderRadius: vars.radius.md,
  selectors: {
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const list = style({
  margin: 0,
  paddingInlineStart: vars.space[5],
});

export const link = style({
  color: 'inherit',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  cursor: 'pointer',
  selectors: {
    '&:hover': { textDecorationThickness: '2px' },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px', borderRadius: '2px' },
  },
});
