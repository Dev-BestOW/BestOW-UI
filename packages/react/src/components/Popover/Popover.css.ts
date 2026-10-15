import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const content = style({
  zIndex: vars.zIndex.dropdown,
  width: 'max-content',
  minWidth: '200px',
  maxWidth: 'min(360px, var(--radix-popover-content-available-width))',
  padding: vars.space[4],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.default,
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  selectors: {
    '&[data-state="open"]': { animation: `${popIn} ${vars.duration.fast} ease-out` },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[2],
  marginBottom: vars.space[2],
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
});

export const closeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '28px',
  height: '28px',
  margin: '-4px -8px 0 auto',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.fg.subtle,
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.neutral.subtle, color: vars.color.fg.default },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const arrow = style({
  fill: vars.color.bg.default,
  // 테두리 색 외곽선을 화살표에도 이어 준다
  stroke: vars.color.border.default,
  strokeWidth: 1,
  marginTop: '-1px',
});
