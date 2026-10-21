import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { controlBorderColor } from '../../styles/inputBorder.css';
import { vars } from '../../theme/contract.css';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    color: vars.color.fg.default,
    cursor: 'pointer',
    userSelect: 'none',
    selectors: {
      '&[data-disabled]': { cursor: 'not-allowed', opacity: 0.5 },
    },
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const control = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
  },
  variants: {
    size: {
      sm: { width: '16px', height: '16px' },
      md: { width: '20px', height: '20px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const input = style({
  appearance: 'none',
  margin: 0,
  width: '100%',
  height: '100%',
  border: `1.5px solid ${controlBorderColor}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.bg.default,
  cursor: 'inherit',
  transition: `background-color ${vars.duration.fast}, border-color ${vars.duration.fast}`,
  selectors: {
    '&:hover:not(:disabled)': { borderColor: vars.color.primary.solid },
    '&:checked, &:indeterminate': {
      backgroundColor: vars.color.primary.solid,
      borderColor: vars.color.primary.solid,
    },
    '&:checked:hover:not(:disabled), &:indeterminate:hover:not(:disabled)': {
      backgroundColor: vars.color.primary.solidHover,
      borderColor: vars.color.primary.solidHover,
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: '2px',
    },
    '&[aria-invalid="true"]:not(:checked):not(:indeterminate)': {
      borderColor: vars.color.danger.solid,
    },
  },
});

const iconBase = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  color: vars.color.primary.contrast,
  pointerEvents: 'none',
  opacity: 0,
});

export const checkIcon = style([
  iconBase,
  {
    selectors: {
      [`${input}:checked:not(:indeterminate) ~ &`]: { opacity: 1 },
    },
  },
]);

export const indeterminateIcon = style([
  iconBase,
  {
    selectors: {
      [`${input}:indeterminate ~ &`]: { opacity: 1 },
    },
  },
]);
