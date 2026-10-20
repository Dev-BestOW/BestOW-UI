import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { inputBorderColor, inputBorderHoverColor } from '../../styles/inputBorder.css';
import { vars } from '../../theme/contract.css';

// 한 줄 입력창은 높이를 고정한다 — 글자 200%(14 → 28px)에서도 안쪽(38px)에 들어가고, input 이 height: 100% 로 루트를 채워
// 클릭 영역이 넓다(minHeight 로 바꾸면 100% 가 계산되지 않아 input 이 17px 로 줄었다).
export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    border: `1px solid ${inputBorderColor}`,
    borderRadius: vars.radius.md,
    backgroundColor: vars.color.bg.default,
    color: vars.color.fg.default,
    transition: `border-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
    cursor: 'text',
    selectors: {
      '&:hover:not([data-disabled])': { borderColor: inputBorderHoverColor },
      '&:focus-within': {
        borderColor: vars.color.border.focus,
        boxShadow: `0 0 0 1px ${vars.color.border.focus}`,
      },
      '&[data-invalid]': { borderColor: vars.color.danger.solid },
      '&[data-invalid]:focus-within': { boxShadow: `0 0 0 1px ${vars.color.danger.solid}` },
      '&[data-disabled]': {
        backgroundColor: vars.color.bg.muted,
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
  },
  variants: {
    size: {
      sm: { height: '32px', paddingInline: vars.space[2], fontSize: vars.font.size.sm },
      md: { height: '40px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
      lg: { height: '48px', paddingInline: vars.space[4], fontSize: vars.font.size.md },
    },
    fullWidth: {
      true: { display: 'flex', width: '100%' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const input = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  selectors: {
    '&::placeholder': { color: vars.color.fg.subtle },
    '&:disabled': { cursor: 'not-allowed' },
  },
});

export const adornment = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
});

export const field = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const fieldFullWidth = style({
  display: 'flex',
  width: '100%',
});

export const label = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.default,
});

export const requiredMark = style({
  marginInlineStart: '2px',
  color: vars.color.danger.text,
});

export const helperText = recipe({
  base: {
    margin: 0,
    fontSize: vars.font.size.xs,
    lineHeight: vars.font.lineHeight.normal,
    color: vars.color.fg.subtle,
  },
  variants: {
    error: {
      true: { color: vars.color.danger.text },
    },
  },
});
