import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const row = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space[3],
});

// 실제 입력창(하나)을 칸들 위에 투명하게 겹친다 — 클릭·붙여넣기·자동 채우기는 이 입력창이 받는다
export const slots = style({
  position: 'relative',
  display: 'inline-flex',
  gap: vars.space[2],
});

export const input = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'transparent',
  caretColor: 'transparent',
  // iOS 가 16px 미만 입력창에 포커스하면 화면을 확대한다
  fontSize: '16px',
  letterSpacing: '-1em',
  cursor: 'text',
  selectors: {
    '&::selection': { background: 'transparent' },
    '&:disabled': { cursor: 'not-allowed' },
  },
});

export const slot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '52px',
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  color: vars.color.fg.default,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
  transition: `border-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
  selectors: {
    // 입력창에 포커스가 있을 때 다음에 입력될 칸을 강조한다
    [`${slots}:focus-within &[data-active]`]: {
      borderColor: vars.color.border.focus,
      boxShadow: `0 0 0 1px ${vars.color.border.focus}`,
    },
    '[data-invalid] &': { borderColor: vars.color.danger.solid },
    '[data-disabled] &': { backgroundColor: vars.color.bg.muted, opacity: 0.6 },
  },
});

export const timer = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.danger.text,
});
