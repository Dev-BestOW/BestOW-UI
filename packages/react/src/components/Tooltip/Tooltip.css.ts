import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const content = style({
  zIndex: vars.zIndex.tooltip,
  maxWidth: '280px',
  padding: `${vars.space[1]} ${vars.space[2]}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.bg.inverse,
  color: vars.color.fg.inverse,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.normal,
  boxShadow: vars.shadow.md,
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
  userSelect: 'none',
  selectors: {
    '&[data-state="delayed-open"], &[data-state="instant-open"]': {
      animation: `${popIn} ${vars.duration.fast} ease-out`,
    },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const arrow = style({
  fill: vars.color.bg.inverse,
});
