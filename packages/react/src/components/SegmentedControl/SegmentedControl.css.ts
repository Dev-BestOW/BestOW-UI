import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

// Tabs 의 soft 변형과 같은 모양 (회색 트랙 위에 선택된 칸만 흰 배경) — 함께 써도 어색하지 않게
export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    padding: vars.space[1],
    borderRadius: vars.radius.md,
    backgroundColor: vars.color.neutral.subtle,
    fontFamily: vars.font.family.sans,
    // 고대비: 회색 트랙이 지워져 묶음의 경계가 사라진다
    '@media': { [forcedColors]: { border: '1px solid CanvasText' } },
  },
  variants: {
    fullWidth: {
      true: { display: 'flex', width: '100%' },
    },
  },
});

export const item = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: 'none',
    borderRadius: vars.radius.sm,
    background: 'none',
    fontFamily: 'inherit',
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    color: vars.color.fg.muted,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `color ${vars.duration.fast}, background-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
    selectors: {
      '&:hover:not([data-disabled])': { color: vars.color.fg.default },
      '&[data-state="checked"]': {
        color: vars.color.fg.default,
        backgroundColor: vars.color.bg.default,
        boxShadow: vars.shadow.sm,
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: '-2px',
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
    '@media': { [forcedColors]: { selectors: { '&[data-state="checked"]': systemHighlight } } },
  },
  variants: {
    // 트랙 안쪽 여백(4px ×2)을 더하면 전체 높이가 Button·Input 의 sm 32 / md 40 / lg 48 과 같다
    size: {
      sm: { height: '24px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
      md: { height: '32px', paddingInline: vars.space[4], fontSize: vars.font.size.sm },
      lg: { height: '40px', paddingInline: vars.space[5], fontSize: vars.font.size.md },
    },
    fullWidth: {
      true: { flex: '1 1 0', minWidth: 0 },
    },
  },
  defaultVariants: { size: 'md' },
});

export const icon = style({ display: 'inline-flex', flexShrink: 0 });

export type SegmentedControlVariants = NonNullable<RecipeVariants<typeof item>>;
