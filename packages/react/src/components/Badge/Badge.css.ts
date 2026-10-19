import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// color variant 가 채우고, variant(solid/soft/outline)가 사용하는 로컬 변수
const accent = {
  solid: createVar(),
  contrast: createVar(),
  subtle: createVar(),
  text: createVar(),
};

function accentFrom(intent: keyof Pick<typeof vars.color, 'primary' | 'neutral' | 'danger' | 'success' | 'warning'>) {
  const c = vars.color[intent];
  return {
    vars: {
      [accent.solid]: c.solid,
      [accent.contrast]: c.contrast,
      [accent.subtle]: c.subtle,
      [accent.text]: c.text,
    },
  };
}

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    border: '1px solid transparent',
    borderRadius: vars.radius.full,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },
  variants: {
    variant: {
      solid: { backgroundColor: accent.solid, color: accent.contrast },
      soft: { backgroundColor: accent.subtle, color: accent.text },
      outline: { backgroundColor: 'transparent', borderColor: accent.solid, color: accent.text },
    },
    color: {
      primary: accentFrom('primary'),
      neutral: accentFrom('neutral'),
      danger: accentFrom('danger'),
      success: accentFrom('success'),
      warning: accentFrom('warning'),
    },
    size: {
      sm: { minHeight: '20px', paddingInline: vars.space[2], fontSize: vars.font.size.xs },
      md: { minHeight: '24px', paddingInline: vars.space[2], fontSize: vars.font.size.xs },
      lg: { minHeight: '28px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
    },
  },
  defaultVariants: {
    variant: 'soft',
    color: 'neutral',
    size: 'md',
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;
