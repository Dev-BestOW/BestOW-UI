import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { reducedMotion, spin } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const spinner = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    animation: `${spin} 0.8s linear infinite`,
    // 움직임 줄이기 설정에서도 "진행 중" 신호는 남기되 훨씬 느리게 돈다
    '@media': { [reducedMotion]: { animationDuration: '2.4s' } },
  },
  variants: {
    color: {
      current: { color: 'currentColor' },
      primary: { color: vars.color.primary.text },
      neutral: { color: vars.color.fg.muted },
      danger: { color: vars.color.danger.text },
    },
    size: {
      sm: { width: '16px', height: '16px' },
      md: { width: '20px', height: '20px' },
      lg: { width: '28px', height: '28px' },
    },
  },
  defaultVariants: {
    color: 'current',
    size: 'md',
  },
});

export type SpinnerVariants = NonNullable<RecipeVariants<typeof spinner>>;
