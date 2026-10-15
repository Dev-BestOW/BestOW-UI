import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    minWidth: 0,
    border: '1px solid transparent',
    borderRadius: vars.radius.lg,
    backgroundColor: vars.color.bg.default,
    color: vars.color.fg.default,
    fontFamily: vars.font.family.sans,
  },
  variants: {
    variant: {
      outline: { borderColor: vars.color.border.default },
      // 다크 모드에서는 그림자가 잘 안 보이므로 테두리를 함께 둔다
      elevated: { borderColor: vars.color.border.default, boxShadow: vars.shadow.md },
      soft: { backgroundColor: vars.color.bg.subtle },
    },
    padding: {
      none: { padding: 0 },
      sm: { padding: vars.space[4] },
      md: { padding: vars.space[6] },
      lg: { padding: vars.space[8] },
    },
  },
  defaultVariants: {
    variant: 'outline',
    padding: 'md',
  },
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const body = style({
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space[2],
});

export type CardVariants = NonNullable<RecipeVariants<typeof card>>;
