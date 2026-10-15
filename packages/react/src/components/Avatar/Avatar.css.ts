import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const root = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    verticalAlign: 'middle',
    userSelect: 'none',
    backgroundColor: vars.color.neutral.subtle,
    color: vars.color.neutral.text,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.semibold,
    lineHeight: 1,
  },
  variants: {
    size: {
      sm: { width: '28px', height: '28px', fontSize: vars.font.size.xs },
      md: { width: '36px', height: '36px', fontSize: vars.font.size.sm },
      lg: { width: '48px', height: '48px', fontSize: vars.font.size.lg },
    },
    shape: {
      circle: { borderRadius: vars.radius.full },
      square: { borderRadius: vars.radius.md },
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
});

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const fallback = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});

export type AvatarVariants = NonNullable<RecipeVariants<typeof root>>;
