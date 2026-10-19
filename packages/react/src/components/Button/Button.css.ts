import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// color variant 가 채우고, variant(solid/outline/ghost)가 사용하는 로컬 변수
const accent = {
  solid: createVar(),
  solidHover: createVar(),
  contrast: createVar(),
  subtle: createVar(),
  subtleHover: createVar(),
  text: createVar(),
};

function accentFrom(intent: keyof Pick<typeof vars.color, 'primary' | 'neutral' | 'danger'>) {
  const c = vars.color[intent];
  return {
    vars: {
      [accent.solid]: c.solid,
      [accent.solidHover]: c.solidHover,
      [accent.contrast]: c.contrast,
      [accent.subtle]: c.subtle,
      [accent.subtleHover]: c.subtleHover,
      [accent.text]: c.text,
    },
  };
}

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${vars.duration.fast}, border-color ${vars.duration.fast}, color ${vars.duration.fast}`,
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: '2px',
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[aria-busy="true"]': {
        cursor: 'progress',
      },
    },
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: accent.solid,
        color: accent.contrast,
        selectors: { '&:hover:not(:disabled)': { backgroundColor: accent.solidHover } },
      },
      soft: {
        backgroundColor: accent.subtle,
        color: accent.text,
        selectors: { '&:hover:not(:disabled)': { backgroundColor: accent.subtleHover } },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: accent.solid,
        color: accent.text,
        selectors: { '&:hover:not(:disabled)': { backgroundColor: accent.subtle } },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: accent.text,
        selectors: { '&:hover:not(:disabled)': { backgroundColor: accent.subtle } },
      },
    },
    color: {
      primary: accentFrom('primary'),
      neutral: accentFrom('neutral'),
      danger: accentFrom('danger'),
    },
    size: {
      sm: { minHeight: '32px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
      md: { minHeight: '40px', paddingInline: vars.space[4], fontSize: vars.font.size.sm },
      lg: { minHeight: '48px', paddingInline: vars.space[5], fontSize: vars.font.size.md },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
