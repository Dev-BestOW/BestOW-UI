import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { fontSize } from '@bestow-ui/tokens';
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
    // 원 크기가 px 로 고정인 그림 요소라 이니셜도 px(tokens 원래 값)로 — rem(--bestow-font-size-*)이면 사용자가 기본 글꼴을
    // 키울 때 이니셜만 커져 원 밖으로 잘린다. 화면 전체 확대에는 원과 함께 커진다
    size: {
      sm: { width: '28px', height: '28px', fontSize: fontSize.xs },
      md: { width: '36px', height: '36px', fontSize: fontSize.sm },
      lg: { width: '48px', height: '48px', fontSize: fontSize.lg },
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
