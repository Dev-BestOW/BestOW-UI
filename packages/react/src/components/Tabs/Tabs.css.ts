import { style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const list = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: vars.font.family.sans,
  },
  variants: {
    variant: {
      line: {
        gap: vars.space[1],
        borderBottom: `1px solid ${vars.color.border.default}`,
      },
      soft: {
        display: 'inline-flex',
        gap: vars.space[1],
        padding: vars.space[1],
        borderRadius: vars.radius.md,
        backgroundColor: vars.color.neutral.subtle,
      },
    },
  },
  defaultVariants: { variant: 'line' },
});

export const trigger = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: 'none',
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
      '&:focus-visible': {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: '-2px',
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
  variants: {
    variant: {
      line: {
        // 리스트의 아래 테두리 위에 선택 표시줄을 겹친다
        marginBottom: '-1px',
        borderRadius: `${vars.radius.sm} ${vars.radius.sm} 0 0`,
        selectors: {
          '&[data-state="active"]': {
            color: vars.color.primary.text,
            boxShadow: `inset 0 -2px 0 ${vars.color.primary.solid}`,
          },
        },
      },
      soft: {
        borderRadius: vars.radius.sm,
        selectors: {
          '&[data-state="active"]': {
            color: vars.color.fg.default,
            backgroundColor: vars.color.bg.default,
            boxShadow: vars.shadow.sm,
          },
        },
      },
    },
    size: {
      sm: { height: '32px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
      md: { height: '40px', paddingInline: vars.space[4], fontSize: vars.font.size.md },
    },
  },
  compoundVariants: [
    // soft 는 리스트 안쪽 여백(4px)만큼 낮춰 전체 높이를 line 과 맞춘다
    { variants: { variant: 'soft', size: 'sm' }, style: { height: '24px' } },
    { variants: { variant: 'soft', size: 'md' }, style: { height: '32px' } },
  ],
  defaultVariants: { variant: 'line', size: 'md' },
});

export const content = style({
  paddingTop: vars.space[4],
  fontFamily: vars.font.family.sans,
  color: vars.color.fg.default,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: '2px',
      borderRadius: vars.radius.sm,
    },
  },
});

export type TabsVariants = NonNullable<RecipeVariants<typeof trigger>>;
