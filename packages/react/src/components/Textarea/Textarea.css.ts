import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { inputBorderColor, inputBorderHoverColor } from '../../styles/inputBorder.css';
import { vars } from '../../theme/contract.css';

export const textarea = recipe({
  base: {
    display: 'block',
    width: '100%',
    minHeight: '64px',
    margin: 0,
    border: `1px solid ${inputBorderColor}`,
    borderRadius: vars.radius.md,
    backgroundColor: vars.color.bg.default,
    color: vars.color.fg.default,
    font: 'inherit',
    lineHeight: vars.font.lineHeight.normal,
    outline: 'none',
    transition: `border-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
    selectors: {
      '&::placeholder': { color: vars.color.fg.subtle },
      '&:hover:not(:disabled)': { borderColor: inputBorderHoverColor },
      '&:focus': {
        borderColor: vars.color.border.focus,
        boxShadow: `0 0 0 1px ${vars.color.border.focus}`,
      },
      '&[aria-invalid="true"]': { borderColor: vars.color.danger.solid },
      '&[aria-invalid="true"]:focus': { boxShadow: `0 0 0 1px ${vars.color.danger.solid}` },
      '&:disabled': { backgroundColor: vars.color.bg.muted, cursor: 'not-allowed', opacity: 0.6 },
    },
  },
  variants: {
    size: {
      sm: { padding: `${vars.space[1]} ${vars.space[2]}`, fontSize: vars.font.size.sm },
      md: { padding: `${vars.space[2]} ${vars.space[3]}`, fontSize: vars.font.size.sm },
      lg: { padding: `${vars.space[3]} ${vars.space[4]}`, fontSize: vars.font.size.md },
    },
    resize: {
      none: { resize: 'none' },
      vertical: { resize: 'vertical' },
      both: { resize: 'both' },
    },
  },
  defaultVariants: { size: 'md', resize: 'vertical' },
});

/** 기본 너비 (fullWidth 가 아닐 때) */
export const defaultWidth = style({ width: '320px', maxWidth: '100%' });

export const footer = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space[2],
});

export const count = style({
  marginLeft: 'auto',
  fontSize: vars.font.size.xs,
  color: vars.color.fg.subtle,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

export const countOver = style({
  color: vars.color.danger.text,
});
