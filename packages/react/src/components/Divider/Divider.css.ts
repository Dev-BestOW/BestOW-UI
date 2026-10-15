import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const divider = recipe({
  base: {
    flexShrink: 0,
    border: 'none',
    margin: 0,
    backgroundColor: vars.color.border.default,
  },
  variants: {
    orientation: {
      horizontal: { width: '100%', height: '1px' },
      // flex 행 안에서 부모 높이를 채운다. 높이가 없는 부모에서도 보이도록 최소 높이를 둔다
      vertical: { width: '1px', alignSelf: 'stretch', minHeight: '1em' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const labeled = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg.subtle,
  whiteSpace: 'nowrap',
});

export const line = style({
  flex: 1,
  height: '1px',
  backgroundColor: vars.color.border.default,
});

export type DividerVariants = NonNullable<RecipeVariants<typeof divider>>;
