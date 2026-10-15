import { style } from '@vanilla-extract/css';
import { accordionDown, accordionUp, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const root = style({
  width: '100%',
  fontFamily: vars.font.family.sans,
});

export const item = style({
  borderBottom: `1px solid ${vars.color.border.default}`,
});

export const header = style({
  display: 'flex',
  margin: 0,
  font: 'inherit',
});

export const trigger = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  paddingBlock: vars.space[4],
  paddingInline: 0,
  border: 'none',
  background: 'none',
  fontFamily: 'inherit',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg.default,
  textAlign: 'start',
  cursor: 'pointer',
  selectors: {
    '&:hover:not([data-disabled])': { color: vars.color.primary.text },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: '2px',
      borderRadius: vars.radius.sm,
    },
    '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const chevron = style({
  flexShrink: 0,
  color: vars.color.fg.subtle,
  transition: `transform ${vars.duration.normal}`,
  selectors: {
    [`${trigger}[data-state="open"] &`]: { transform: 'rotate(180deg)' },
  },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

export const content = style({
  overflow: 'hidden',
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.muted,
  selectors: {
    '&[data-state="open"]': { animation: `${accordionDown} ${vars.duration.normal} ease-out` },
    '&[data-state="closed"]': { animation: `${accordionUp} ${vars.duration.normal} ease-out` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const contentInner = style({
  paddingBottom: vars.space[4],
});
