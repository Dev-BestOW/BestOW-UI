import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '100%',
  fontFamily: vars.font.family.sans,
});

export const header = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space[3],
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.tight,
});

export const label = style({
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const value = style({
  marginInlineStart: 'auto',
  color: vars.color.fg.muted,
  fontVariantNumeric: 'tabular-nums',
});

export const helperText = style({
  fontSize: vars.font.size.xs,
  color: vars.color.fg.muted,
});

export const root = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    touchAction: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
  variants: {
    size: {
      sm: { height: '16px' },
      md: { height: '20px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const track = recipe({
  base: {
    position: 'relative',
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.muted,
    // 트랙 바탕(bg.muted)은 배경과 대비가 1.1~1.6:1 이라 끝이 안 보인다 → 3:1 이상인 fg.subtle 로 안쪽 테두리를 그려
    // "전체 중 어디까지인지" 를 보이게 한다(WCAG 1.4.11). 채움 막대는 자식이라 테두리 위에 그려진다
    boxShadow: `inset 0 0 0 1px ${vars.color.fg.subtle}`,
    '@media': {
      // 고대비(강제 색상) 모드는 배경·그림자를 지운다 → 테두리를 시스템 글자색 외곽선으로
      '(forced-colors: active)': { outline: '1px solid CanvasText' },
    },
  },
  variants: {
    size: {
      sm: { height: '4px' },
      md: { height: '6px' },
    },
  },
  defaultVariants: { size: 'md' },
});

// 채워진 구간과 손잡이 테두리는 primary 의 text 색 — solid 는 다크에서 트랙과 대비가 2:1 안팎이라 구분이 안 된다 (Progress 와 같은 이유)
export const range = style({
  position: 'absolute',
  height: '100%',
  backgroundColor: vars.color.primary.text,
});

export const thumb = recipe({
  base: {
    display: 'block',
    borderRadius: vars.radius.full,
    border: `2px solid ${vars.color.primary.text}`,
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.sm,
    cursor: 'grab',
    transition: `box-shadow ${vars.duration.fast}`,
    selectors: {
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:active': { cursor: 'grabbing' },
      '[data-disabled] &': { cursor: 'not-allowed' },
    },
  },
  variants: {
    size: {
      sm: { width: '16px', height: '16px' },
      md: { width: '20px', height: '20px' },
    },
  },
  defaultVariants: { size: 'md' },
});
