import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    color: vars.color.fg.default,
    selectors: {
      '&[data-disabled]': { opacity: 0.5 },
    },
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
    },
  },
  defaultVariants: { size: 'md' },
});

export const track = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    padding: '2px',
    border: 'none',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.border.strong,
    cursor: 'pointer',
    transition: `background-color ${vars.duration.fast}`,
    selectors: {
      '&[data-state="checked"]': { backgroundColor: vars.color.primary.solid },
      '&[data-state="checked"]:hover:not(:disabled)': { backgroundColor: vars.color.primary.solidHover },
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:disabled': { cursor: 'not-allowed' },
    },
  },
  variants: {
    size: {
      sm: { width: '28px', height: '16px' },
      md: { width: '36px', height: '20px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const thumb = recipe({
  base: {
    display: 'block',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.sm,
    transition: `transform ${vars.duration.fast}`,
    selectors: {
      '&[data-state="checked"]': { backgroundColor: vars.color.primary.contrast },
    },
    '@media': { [reducedMotion]: { transition: 'none' } },
  },
  variants: {
    size: {
      sm: {
        width: '12px',
        height: '12px',
        selectors: { '&[data-state="checked"]': { transform: 'translateX(12px)' } },
      },
      md: {
        width: '16px',
        height: '16px',
        selectors: { '&[data-state="checked"]': { transform: 'translateX(16px)' } },
      },
    },
  },
  defaultVariants: { size: 'md' },
});

export const label = style({
  cursor: 'pointer',
  userSelect: 'none',
  selectors: {
    '[data-disabled] > &': { cursor: 'not-allowed' },
  },
});
