import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// 가로로 넘치면 이 영역만 스크롤된다
export const container = style({
  position: 'relative',
  width: '100%',
  overflow: 'auto',
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.default,
  selectors: {
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const table = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.default,
  fontVariantNumeric: 'tabular-nums',
  // 한글이 단어 중간에서 끊기지 않게 한다 ("정노/을")
  wordBreak: 'keep-all',
});

export const caption = style({
  captionSide: 'top',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  textAlign: 'left',
  fontWeight: vars.font.weight.semibold,
  color: vars.color.fg.default,
  borderBottom: `1px solid ${vars.color.border.default}`,
});

export const header = style({});

export const stickyHeader = style({});

export const body = style({});

export const striped = style({});

export const footer = style({});

export const row = style({
  transition: `background-color ${vars.duration.fast}`,
  selectors: {
    [`${body} &:hover`]: { backgroundColor: vars.color.bg.subtle },
    [`${striped} ${body} &:nth-of-type(even)`]: { backgroundColor: vars.color.bg.subtle },
    [`${striped} ${body} &:nth-of-type(even):hover`]: { backgroundColor: vars.color.bg.muted },
    '&[data-state="selected"]': { backgroundColor: vars.color.primary.subtle },
  },
});

const cellBase = {
  textAlign: 'left',
  verticalAlign: 'middle',
  borderBottom: `1px solid ${vars.color.border.default}`,
} as const;

export const cell = recipe({
  base: {
    ...cellBase,
    selectors: {
      // 마지막 행은 바깥 테두리(container)와 겹치지 않게 아래 선을 뺀다
      [`${body} tr:last-child > &, ${footer} tr:last-child > &`]: { borderBottom: 'none' },
    },
  },
  variants: {
    size: {
      sm: { padding: `${vars.space[2]} ${vars.space[3]}` },
      md: { padding: `${vars.space[3]} ${vars.space[4]}` },
    },
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  },
  defaultVariants: { size: 'md', align: 'left' },
});

export const head = style({
  fontWeight: vars.font.weight.semibold,
  color: vars.color.fg.muted,
  backgroundColor: vars.color.bg.subtle,
  whiteSpace: 'nowrap',
  selectors: {
    [`${stickyHeader} &`]: { position: 'sticky', top: 0, zIndex: 1 },
  },
});

export const footerCell = style({
  fontWeight: vars.font.weight.semibold,
  backgroundColor: vars.color.bg.subtle,
  borderTop: `1px solid ${vars.color.border.default}`,
});

export const sortButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  margin: `-${vars.space[1]} -${vars.space[2]}`,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.bg.muted, color: vars.color.fg.default },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const sortIcon = style({
  flexShrink: 0,
  selectors: {
    // 정렬되지 않은 열은 옅게 보여 "정렬할 수 있다" 만 알린다
    '&[data-active="false"]': { opacity: 0.35 },
  },
});

export const emptyCell = style({
  paddingBlock: vars.space[8],
  textAlign: 'center',
  color: vars.color.fg.muted,
});

export const emptyContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[3],
});
