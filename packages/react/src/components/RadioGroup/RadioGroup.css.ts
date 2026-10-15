import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const items = recipe({
  base: {
    display: 'flex',
    gap: vars.space[3],
  },
  variants: {
    orientation: {
      vertical: { flexDirection: 'column' },
      horizontal: { flexDirection: 'row', flexWrap: 'wrap', columnGap: vars.space[5] },
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const option = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: vars.space[2],
    color: vars.color.fg.default,
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
    },
  },
  defaultVariants: { size: 'md' },
});

const radioSize = createVar();

export const radio = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    // 첫 줄 글자와 세로 가운데를 맞춘다 (line-height 1.5 기준)
    marginTop: `calc((1.5em - ${radioSize}) / 2)`,
    width: radioSize,
    height: radioSize,
    padding: 0,
    border: `1.5px solid ${vars.color.border.strong}`,
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.default,
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast}`,
    selectors: {
      '&:hover:not(:disabled)': { borderColor: vars.color.primary.solid },
      '&[data-state="checked"]': { borderColor: vars.color.primary.solid },
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
      '[aria-invalid="true"] &:not([data-state="checked"])': { borderColor: vars.color.danger.solid },
    },
  },
  variants: {
    size: {
      sm: { vars: { [radioSize]: '16px' } },
      md: { vars: { [radioSize]: '20px' } },
    },
  },
  defaultVariants: { size: 'md' },
});

export const indicator = style({
  width: '50%',
  height: '50%',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.primary.solid,
});

export const text = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  lineHeight: vars.font.lineHeight.normal,
});

export const labelText = style({
  cursor: 'pointer',
  userSelect: 'none',
  selectors: {
    // 비활성 옵션은 컨트롤과 레이블만 흐리게 한다. 설명은 "왜 고를 수 없는지" 를 알려 주므로 대비를 유지한다
    '[data-disabled] &': { cursor: 'not-allowed', opacity: 0.5 },
  },
});

export const description = style({
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
});

export const groupLabel = style({
  marginBottom: vars.space[1],
});
