import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const content = style({
  zIndex: vars.zIndex.dropdown,
  minWidth: '180px',
  maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
  overflowY: 'auto',
  padding: vars.space[1],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family.sans,
  transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
  selectors: {
    '&[data-state="open"]': { animation: `${popIn} ${vars.duration.fast} ease-out` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const item = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: '36px',
  paddingInline: vars.space[3],
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.default,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  selectors: {
    '&[data-highlighted]': { backgroundColor: vars.color.neutral.subtle },
    '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const danger = style({
  color: vars.color.danger.text,
  selectors: {
    '&[data-highlighted]': { backgroundColor: vars.color.danger.subtle },
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
  selectors: {
    [`${danger} &`]: { color: 'inherit' },
  },
});

export const shortcut = style({
  marginInlineStart: 'auto',
  paddingInlineStart: vars.space[4],
  fontSize: vars.font.size.xs,
  letterSpacing: '0.05em',
  color: vars.color.fg.subtle,
});

export const label = style({
  paddingInline: vars.space[3],
  paddingBlock: vars.space[2],
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.fg.subtle,
});

export const separator = style({
  height: '1px',
  marginBlock: vars.space[1],
  marginInline: `calc(${vars.space[1]} * -1)`,
  backgroundColor: vars.color.border.default,
});
