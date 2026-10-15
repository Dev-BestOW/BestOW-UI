import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { reducedMotion, shimmer } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const width = createVar();
export const height = createVar();

export const skeleton = recipe({
  base: {
    display: 'block',
    flexShrink: 0,
    width,
    height,
    backgroundColor: vars.color.neutral.subtle,
    backgroundImage: `linear-gradient(90deg, transparent 25%, ${vars.color.neutral.subtleHover} 50%, transparent 75%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.6s ease-in-out infinite`,
    '@media': { [reducedMotion]: { animation: 'none', backgroundImage: 'none' } },
  },
  variants: {
    variant: {
      text: { borderRadius: vars.radius.sm },
      rect: { borderRadius: vars.radius.md },
      circle: { borderRadius: vars.radius.full },
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

export const lines = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width,
});

export type SkeletonVariants = NonNullable<RecipeVariants<typeof skeleton>>;
