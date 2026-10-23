import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// color variant 가 채우고, variant(soft/outline/solid)가 사용하는 로컬 변수
const accent = {
  solid: createVar(),
  contrast: createVar(),
  subtle: createVar(),
  text: createVar(),
};

type Intent = 'primary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info';

function accentFrom(intent: Intent) {
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

// 제목·아이콘 색과 본문 색. variant 가 정한다
const titleColor = createVar();
const bodyColor = createVar();

export const alert = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space[3],
    padding: `${vars.space[3]} ${vars.space[4]}`,
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.normal,
    color: bodyColor,
  },
  variants: {
    variant: {
      soft: {
        backgroundColor: accent.subtle,
        vars: { [titleColor]: accent.text, [bodyColor]: vars.color.fg.default },
      },
      outline: {
        backgroundColor: vars.color.bg.default,
        borderColor: accent.solid,
        vars: { [titleColor]: accent.text, [bodyColor]: vars.color.fg.default },
      },
      solid: {
        backgroundColor: accent.solid,
        vars: { [titleColor]: accent.contrast, [bodyColor]: accent.contrast },
      },
    },
    color: {
      primary: accentFrom('primary'),
      neutral: accentFrom('neutral'),
      danger: accentFrom('danger'),
      success: accentFrom('success'),
      warning: accentFrom('warning'),
      info: accentFrom('info'),
    },
  },
  defaultVariants: {
    variant: 'soft',
    color: 'primary',
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  // 첫 줄 글자 높이(line-height)에 맞춰 가운데 정렬
  marginTop: '2px',
  color: titleColor,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const title = style({
  fontWeight: vars.font.weight.semibold,
  color: titleColor,
});

export const description = style({
  overflowWrap: 'anywhere',
});

export const action = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexShrink: 0,
  alignSelf: 'center',
});

export const closeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '28px',
  height: '28px',
  margin: '-4px -8px -4px 0',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  transition: `background-color ${vars.duration.fast}`,
  selectors: {
    // 어떤 variant 배경 위에서도 보이도록 글자색을 옅게 섞어 hover 배경을 만든다
    '&:hover': { backgroundColor: 'color-mix(in srgb, currentColor 12%, transparent)' },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export type AlertVariants = NonNullable<RecipeVariants<typeof alert>>;
