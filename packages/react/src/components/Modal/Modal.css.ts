import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fadeIn, fadeOut, reducedMotion, scaleIn, scaleOut } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.overlay,
  backgroundColor: vars.color.bg.overlay,
  selectors: {
    '&[data-state="open"]': { animation: `${fadeIn} ${vars.duration.normal} ease-out` },
    '&[data-state="closed"]': { animation: `${fadeOut} ${vars.duration.fast} ease-in` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const content = recipe({
  base: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: vars.zIndex.modal,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: '85vh',
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.lg,
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.lg,
    outline: 'none',
    selectors: {
      '&[data-state="open"]': { animation: `${scaleIn} ${vars.duration.normal} ease-out` },
      '&[data-state="closed"]': { animation: `${scaleOut} ${vars.duration.fast} ease-in` },
    },
    '@media': { [reducedMotion]: { animation: 'none !important' } },
  },
  variants: {
    size: {
      sm: { width: '400px' },
      md: { width: '560px' },
      lg: { width: '800px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[4],
  padding: `${vars.space[6]} ${vars.space[6]} 0`,
});

export const headings = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
});

export const closeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '32px',
  height: '32px',
  marginTop: '-4px',
  marginRight: '-8px',
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

export const body = style({
  padding: `${vars.space[4]} ${vars.space[6]}`,
  overflowY: 'auto',
  fontSize: vars.font.size.sm,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space[2],
  padding: `0 ${vars.space[6]} ${vars.space[6]}`,
});
