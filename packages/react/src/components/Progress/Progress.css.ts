import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { indeterminate, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '100%',
  fontFamily: vars.font.family.sans,
});

export const header = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space[3],
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.tight,
});

export const label = style({
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const value = style({
  marginInlineStart: 'auto',
  color: vars.color.fg.muted,
  fontVariantNumeric: 'tabular-nums',
});

export const track = recipe({
  base: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.muted,
  },
  variants: {
    size: {
      sm: { height: '4px' },
      md: { height: '8px' },
      lg: { height: '12px' },
    },
  },
  defaultVariants: { size: 'md' },
});

// 막대는 각 intent 의 text 색을 쓴다 — 배경 대비 4.5:1 이 보장된 색이라 트랙과도 라이트·다크 모두 3:1 이상 구분된다
// (solid 색은 다크에서 트랙과 대비가 2:1 안팎으로 떨어진다)
export const indicator = recipe({
  base: {
    height: '100%',
    borderRadius: 'inherit',
    transition: `width ${vars.duration.normal} ease-out`,
    selectors: {
      '&[data-state="indeterminate"]': {
        width: '40%',
        animation: `${indeterminate} 1.4s ease-in-out infinite`,
      },
    },
    '@media': {
      [reducedMotion]: {
        transition: 'none',
        selectors: {
          // 움직임 대신 트랙 전체를 옅게 채워 "진행 중" 만 알린다
          '&[data-state="indeterminate"]': { width: '100%', animation: 'none', opacity: 0.5 },
        },
      },
    },
  },
  variants: {
    color: {
      primary: { backgroundColor: vars.color.primary.text },
      neutral: { backgroundColor: vars.color.neutral.text },
      success: { backgroundColor: vars.color.success.text },
      warning: { backgroundColor: vars.color.warning.text },
      danger: { backgroundColor: vars.color.danger.text },
    },
  },
  defaultVariants: { color: 'primary' },
});

export type ProgressVariants = NonNullable<RecipeVariants<typeof track>> &
  NonNullable<RecipeVariants<typeof indicator>>;
