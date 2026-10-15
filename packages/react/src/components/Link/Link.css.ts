import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const link = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25em',
    borderRadius: vars.radius.sm,
    fontWeight: vars.font.weight.medium,
    textUnderlineOffset: '0.2em',
    textDecorationThickness: '1px',
    cursor: 'pointer',
    transition: `color ${vars.duration.fast}`,
    selectors: {
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
    },
  },
  variants: {
    color: {
      primary: { color: vars.color.primary.text },
      neutral: {
        color: vars.color.fg.default,
        selectors: { '&:hover': { color: vars.color.primary.text } },
      },
      // 부모 글자색을 그대로 쓴다 (Alert·Toast 등 색이 있는 배경 안에서)
      inherit: { color: 'inherit' },
    },
    underline: {
      // 문장 안의 링크는 색만으로 구분되지 않도록 항상 밑줄을 둔다 (WCAG 1.4.1)
      always: { textDecorationLine: 'underline' },
      hover: {
        textDecorationLine: 'none',
        selectors: { '&:hover, &:focus-visible': { textDecorationLine: 'underline' } },
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    underline: 'always',
  },
});

export const externalIcon = style({
  flexShrink: 0,
  width: '0.875em',
  height: '0.875em',
});

export type LinkVariants = NonNullable<RecipeVariants<typeof link>>;
