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

// 네이티브 radio 의 모양을 지우고 다시 그린다. 선택 점은 배경색 + 안쪽 테두리(inset box-shadow)로 만든다
// (input 에는 자식 요소를 둘 수 없다).
export const radio = recipe({
  base: {
    appearance: 'none',
    flexShrink: 0,
    // 첫 줄 글자와 세로 가운데를 맞춘다 (line-height 1.5 기준)
    margin: 0,
    marginTop: `calc((1.5em - ${radioSize}) / 2)`,
    width: radioSize,
    height: radioSize,
    border: `1.5px solid ${vars.color.border.strong}`,
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.default,
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast}`,
    selectors: {
      '&:hover:not(:disabled)': { borderColor: vars.color.primary.solid },
      '&:checked': {
        borderColor: vars.color.primary.solid,
        backgroundColor: vars.color.primary.solid,
        // 점 지름 = 전체의 50%: 안쪽 링 두께 = (전체 - 테두리 2 × 1.5px - 전체/2) / 2
        boxShadow: `inset 0 0 0 calc(${radioSize} / 4 - 0.75px) ${vars.color.bg.default}`,
      },
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
      '[aria-invalid="true"] &:not(:checked)': { borderColor: vars.color.danger.solid },
    },
    '@media': {
      // 고대비(강제 색상) 모드에서는 배경·그림자가 지워져 선택 점이 사라진다 → 브라우저 기본 모양으로 되돌린다
      '(forced-colors: active)': { appearance: 'auto' },
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
