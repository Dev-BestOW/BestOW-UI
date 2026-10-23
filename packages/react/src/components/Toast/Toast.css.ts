import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fadeOut, reducedMotion, slideInRight } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const viewport = style({
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: vars.zIndex.toast,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '380px',
  maxWidth: '100vw',
  margin: 0,
  padding: vars.space[6],
  listStyle: 'none',
  outline: 'none',
});

export const toast = recipe({
  base: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridTemplateAreas: '"title close" "description close" "action close"',
    columnGap: vars.space[3],
    padding: vars.space[4],
    paddingInlineStart: `calc(${vars.space[4]} + 4px)`,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.lg,
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      insetBlock: 0,
      insetInlineStart: 0,
      width: '4px',
    },
    selectors: {
      '&[data-state="open"]': { animation: `${slideInRight} ${vars.duration.normal} cubic-bezier(0.16, 1, 0.3, 1)` },
      '&[data-state="closed"]': { animation: `${fadeOut} ${vars.duration.fast} ease-in` },
      '&[data-swipe="move"]': { transform: 'translateX(var(--radix-toast-swipe-move-x))' },
      '&[data-swipe="cancel"]': {
        transform: 'translateX(0)',
        transition: `transform ${vars.duration.normal} ease-out`,
      },
      '&[data-swipe="end"]': { animation: `${fadeOut} ${vars.duration.fast} ease-out` },
    },
    '@media': { [reducedMotion]: { animation: 'none !important' } },
  },
  variants: {
    color: {
      primary: { '::before': { backgroundColor: vars.color.primary.solid } },
      neutral: { '::before': { backgroundColor: vars.color.neutral.solid } },
      success: { '::before': { backgroundColor: vars.color.success.solid } },
      warning: { '::before': { backgroundColor: vars.color.warning.solid } },
      danger: { '::before': { backgroundColor: vars.color.danger.solid } },
      info: { '::before': { backgroundColor: vars.color.info.solid } },
    },
  },
  defaultVariants: {
    color: 'neutral',
  },
});

export const title = style({
  gridArea: 'title',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.normal,
});

export const description = style({
  gridArea: 'description',
  marginTop: '2px',
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
});

export const action = style({
  gridArea: 'action',
  justifySelf: 'start',
  marginTop: vars.space[3],
});

export const close = style({
  gridArea: 'close',
  alignSelf: 'start',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.fg.subtle,
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.neutral.subtle, color: vars.color.fg.default },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '1px' },
  },
});
