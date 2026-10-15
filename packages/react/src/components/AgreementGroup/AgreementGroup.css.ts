import { style } from '@vanilla-extract/css';
import { reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const fieldset = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 'none',
  fontFamily: vars.font.family.sans,
});

export const legend = style({
  marginBottom: vars.space[2],
  padding: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const box = style({
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  selectors: {
    '[data-invalid] &': { borderColor: vars.color.danger.solid },
  },
});

export const all = style({
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderBottom: `1px solid ${vars.color.border.default}`,
  fontWeight: vars.font.weight.semibold,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: `${vars.space[2]} 0`,
  listStyle: 'none',
});

export const item = style({
  display: 'flex',
  flexDirection: 'column',
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  padding: `${vars.space[2]} ${vars.space[4]}`,
  fontSize: vars.font.size.sm,
});

export const tag = style({
  fontWeight: vars.font.weight.semibold,
  selectors: {
    '&[data-required]': { color: vars.color.primary.text },
    '&:not([data-required])': { color: vars.color.fg.muted },
  },
});

export const toggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  flexShrink: 0,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.fg.muted,
  font: 'inherit',
  fontSize: vars.font.size.xs,
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.bg.muted, color: vars.color.fg.default },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const chevron = style({
  transition: `transform ${vars.duration.fast}`,
  selectors: {
    '[aria-expanded="true"] > &': { transform: 'rotate(180deg)' },
  },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

export const content = style({
  maxHeight: '200px',
  overflowY: 'auto',
  margin: `0 ${vars.space[4]} ${vars.space[2]}`,
  padding: vars.space[3],
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.bg.subtle,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
  color: vars.color.fg.muted,
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
  selectors: {
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});
