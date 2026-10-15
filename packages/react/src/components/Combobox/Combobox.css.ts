import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

// 입력창·레이블·도움말은 Input.css, 목록 항목은 Select.css 를 재사용한다 (같은 모양 + CSS 크기 절약)

export const toggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  margin: `0 calc(-1 * ${vars.space[1]}) 0 0`,
  padding: vars.space[1],
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.fg.subtle,
  cursor: 'pointer',
  transition: `transform ${vars.duration.fast}`,
  selectors: {
    '&[aria-expanded="true"]': { transform: 'rotate(180deg)' },
    '&:disabled': { cursor: 'not-allowed' },
  },
});

export const content = style({
  zIndex: vars.zIndex.dropdown,
  width: 'var(--radix-popover-trigger-width)',
  maxHeight: 'min(320px, var(--radix-popover-content-available-height))',
  overflowY: 'auto',
  padding: vars.space[1],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  boxShadow: vars.shadow.md,
  outline: 'none',
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  selectors: {
    '&[data-state="open"]': { animation: `${popIn} ${vars.duration.fast} ease-out` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const empty = style({
  padding: `${vars.space[3]} ${vars.space[3]}`,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
  textAlign: 'center',
});
