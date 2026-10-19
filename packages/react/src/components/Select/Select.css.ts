import { style } from '@vanilla-extract/css';
import { popIn, reducedMotion } from '../../styles/animations.css';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

export const trigger = style({
  cursor: 'pointer',
  textAlign: 'start',
  font: 'inherit',
  selectors: {
    '&[data-placeholder]': { color: vars.color.fg.subtle },
    '&:focus-visible': { outline: 'none' },
  },
});

export const value = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
  transition: `transform ${vars.duration.fast}`,
  selectors: {
    [`${trigger}[data-state="open"] &`]: { transform: 'rotate(180deg)' },
  },
});

export const content = style({
  zIndex: vars.zIndex.dropdown,
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'min(320px, var(--radix-select-content-available-height))',
  overflow: 'hidden',
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  boxShadow: vars.shadow.md,
  transformOrigin: 'var(--radix-select-content-transform-origin)',
  selectors: {
    '&[data-state="open"]': { animation: `${popIn} ${vars.duration.fast} ease-out` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

export const viewport = style({
  padding: vars.space[1],
});

export const item = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  minHeight: '36px',
  paddingBlock: vars.space[2],
  paddingInline: `${vars.space[3]} ${vars.space[8]}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.default,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  selectors: {
    '&[data-highlighted]': { backgroundColor: vars.color.neutral.subtle },
    '&[data-state="checked"]': { fontWeight: vars.font.weight.semibold, color: vars.color.primary.text },
    '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
  // 고대비: 강조 배경이 지워져 키보드로 어느 항목에 있는지 안 보인다 (Combobox 도 이 스타일을 쓴다)
  '@media': { [forcedColors]: { selectors: { '&[data-highlighted]': systemHighlight } } },
});

export const itemIndicator = style({
  position: 'absolute',
  right: vars.space[3],
  display: 'inline-flex',
});
