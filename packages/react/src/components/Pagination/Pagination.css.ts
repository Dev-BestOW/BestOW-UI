import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  fontFamily: vars.font.family.sans,
});

export const item = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: vars.space[2],
    border: 'none',
    borderRadius: vars.radius.md,
    background: 'transparent',
    fontFamily: 'inherit',
    fontWeight: vars.font.weight.medium,
    fontVariantNumeric: 'tabular-nums',
    color: vars.color.fg.default,
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${vars.duration.fast}, color ${vars.duration.fast}`,
    selectors: {
      '&:hover:not(:disabled)': { backgroundColor: vars.color.neutral.subtle },
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
      '&[aria-current="page"]': {
        backgroundColor: vars.color.primary.solid,
        color: vars.color.primary.contrast,
        cursor: 'default',
      },
      '&[aria-current="page"]:hover': { backgroundColor: vars.color.primary.solidHover },
    },
  },
  variants: {
    size: {
      sm: { minWidth: '32px', height: '32px', fontSize: vars.font.size.sm },
      md: { minWidth: '36px', height: '36px', fontSize: vars.font.size.sm },
    },
  },
  defaultVariants: { size: 'md' },
});

export const ellipsis = style({
  color: vars.color.fg.subtle,
  cursor: 'default',
});

export type PaginationVariants = NonNullable<RecipeVariants<typeof item>>;
