import { style } from '@vanilla-extract/css';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

export const root = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: vars.space[2],
  fontFamily: vars.font.family.sans,
  color: vars.color.fg.default,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
});

export const heading = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
});

export const grid = style({
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
});

export const weekday = style({
  width: '40px',
  height: '32px',
  padding: 0,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.muted,
  textAlign: 'center',
  selectors: {
    // 한국 달력 관례: 일요일 빨강, 토요일 파랑
    '&[data-weekday="0"]': { color: vars.color.danger.text },
    '&[data-weekday="6"]': { color: vars.color.primary.text },
  },
});

export const cell = style({
  padding: '2px',
  textAlign: 'center',
});

export const day = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  padding: 0,
  border: '1px solid transparent',
  borderRadius: vars.radius.full,
  background: 'transparent',
  color: vars.color.fg.default,
  font: 'inherit',
  fontSize: vars.font.size.sm,
  fontVariantNumeric: 'tabular-nums',
  cursor: 'pointer',
  selectors: {
    '&[data-weekday="0"], &[data-holiday]': { color: vars.color.danger.text },
    // 공휴일을 색만으로 알리지 않도록 숫자 아래에 점을 찍는다 (KWCAG 5.4.1 / WCAG 1.4.1)
    '&[data-holiday]::after': {
      content: '""',
      position: 'absolute',
      bottom: '4px',
      left: '50%',
      width: '4px',
      height: '4px',
      marginLeft: '-2px',
      borderRadius: vars.radius.full,
      backgroundColor: 'currentColor',
    },
    '&[data-weekday="6"]:not([data-holiday])': { color: vars.color.primary.text },
    '&:hover:not([aria-disabled="true"])': { backgroundColor: vars.color.bg.muted },
    '&[aria-current="date"]': { borderColor: vars.color.border.strong, fontWeight: vars.font.weight.semibold },
    '&[data-selected]': {
      backgroundColor: vars.color.primary.solid,
      color: vars.color.primary.contrast,
      fontWeight: vars.font.weight.semibold,
    },
    '&[data-selected]:hover': { backgroundColor: vars.color.primary.solidHover },
    '&[aria-disabled="true"]': { opacity: 0.4, cursor: 'not-allowed', textDecoration: 'line-through' },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
  '@media': { [forcedColors]: { selectors: { '&[data-selected], &[data-selected]:hover': systemHighlight } } },
});
