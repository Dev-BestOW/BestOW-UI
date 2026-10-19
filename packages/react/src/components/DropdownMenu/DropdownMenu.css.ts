import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

export const content = style({
  zIndex: vars.zIndex.dropdown,
  minWidth: '180px',
  maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
  overflowY: 'auto',
  padding: vars.space[1],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family.sans,
  transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
  selectors: {
    '&[data-state="open"]': { animation: `${popIn} ${vars.duration.fast} ease-out` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const item = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: '36px',
  paddingInline: vars.space[3],
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.default,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  selectors: {
    '&[data-highlighted]': { backgroundColor: vars.color.neutral.subtle },
    '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
  // 고대비: 강조 배경이 지워져 키보드로 어느 항목에 있는지 안 보인다
  '@media': {
    [forcedColors]: { selectors: { '&[data-highlighted], &[data-state="open"]': systemHighlight } },
  },
});

export const danger = style({
  color: vars.color.danger.text,
  selectors: {
    '&[data-highlighted]': { backgroundColor: vars.color.danger.subtle },
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
  selectors: {
    [`${danger} &`]: { color: 'inherit' },
  },
});

export const shortcut = style({
  marginInlineStart: 'auto',
  paddingInlineStart: vars.space[4],
  fontSize: vars.font.size.xs,
  letterSpacing: '0.05em',
  color: vars.color.fg.subtle,
});

export const label = style({
  paddingInline: vars.space[3],
  paddingBlock: vars.space[2],
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.fg.subtle,
});

export const separator = style({
  height: '1px',
  marginBlock: vars.space[1],
  marginInline: `calc(${vars.space[1]} * -1)`,
  backgroundColor: vars.color.border.default,
});

/** 체크·라디오 표시 자리. 아이콘(16px)과 같은 폭이라 아이콘 항목과 글자 줄이 맞는다 */
export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '16px',
  height: '16px',
  color: vars.color.primary.text,
});

export const indicatorInner = style({
  display: 'inline-flex',
});

export const radioDot = style({
  width: '8px',
  height: '8px',
  borderRadius: vars.radius.full,
  backgroundColor: 'currentColor',
});

export const subTrigger = style({
  selectors: {
    // 하위 메뉴가 열려 포커스가 그쪽으로 옮겨가도 어느 항목에서 열렸는지 보이게
    '&[data-state="open"]': { backgroundColor: vars.color.neutral.subtle },
  },
});

export const subChevron = style({
  display: 'inline-flex',
  marginInlineStart: 'auto',
  paddingInlineStart: vars.space[4],
  color: vars.color.fg.subtle,
});
