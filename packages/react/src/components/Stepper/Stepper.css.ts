import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

const CIRCLE = '28px';
const LINE_GAP = vars.space[2]; // 원과 연결선 사이 여백

export const root = recipe({
  base: {
    display: 'flex',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    fontFamily: vars.font.family.sans,
  },
  variants: {
    orientation: {
      horizontal: { flexDirection: 'row', alignItems: 'flex-start' },
      vertical: { flexDirection: 'column' },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

// 단계 사이 연결선은 앞 단계(li)의 ::after 로 그린다. 완료한 단계 뒤의 선은 primary(text 색 — 배경 대비 3:1 이상)로 칠한다.
// 공통 속성은 base 에, 방향별 위치만 variant 에 둔다 (CSS 크기)
export const step = recipe({
  base: {
    position: 'relative',
    minWidth: 0,
    display: 'flex',
    selectors: {
      '&:not(:last-child)::after': {
        content: '""',
        position: 'absolute',
        borderRadius: vars.radius.full,
        backgroundColor: vars.color.border.strong,
      },
      '&[data-status="complete"]::after': { backgroundColor: vars.color.primary.text },
    },
    // 고대비: 연결선(배경색)이 지워진다 → 시스템 글자색, 완료 구간은 강조색
    '@media': {
      [forcedColors]: {
        selectors: {
          '&:not(:last-child)::after': { forcedColorAdjust: 'none', backgroundColor: 'CanvasText' },
          '&[data-status="complete"]::after': { backgroundColor: 'Highlight' },
        },
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        selectors: {
          '&::after': {
            top: `calc(${CIRCLE} / 2 - 1px)`,
            insetInlineStart: `calc(50% + ${CIRCLE} / 2 + ${LINE_GAP})`,
            insetInlineEnd: `calc(-50% + ${CIRCLE} / 2 + ${LINE_GAP})`,
            height: '2px',
          },
        },
      },
      vertical: {
        gap: vars.space[3],
        paddingBottom: vars.space[6],
        selectors: {
          '&:last-child': { paddingBottom: 0 },
          // 세로는 설명이 없는 단계 사이가 짧아 여백을 줄인다 (선 길이 = 단계 간격 - 여백 × 2)
          '&::after': {
            insetInlineStart: `calc(${CIRCLE} / 2 - 1px)`,
            top: `calc(${CIRCLE} + ${vars.space[1]})`,
            bottom: vars.space[1],
            width: '2px',
          },
        },
      },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const indicator = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: vars.radius.full,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.semibold,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  },
  variants: {
    status: {
      complete: {
        backgroundColor: vars.color.primary.solid,
        color: vars.color.primary.contrast,
        // 고대비: 채운 원이 지워져 체크만 남는다 → 강조색으로 채운다
        '@media': { [forcedColors]: systemHighlight },
      },
      current: {
        border: `2px solid ${vars.color.primary.solid}`,
        backgroundColor: vars.color.bg.default,
        color: vars.color.primary.text,
      },
      upcoming: {
        border: `1.5px solid ${vars.color.border.strong}`,
        backgroundColor: vars.color.bg.default,
        color: vars.color.fg.muted,
      },
    },
  },
});

export const text = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    lineHeight: vars.font.lineHeight.normal,
  },
  variants: {
    orientation: {
      horizontal: { marginTop: vars.space[2], paddingInline: vars.space[1] },
      // 첫 줄 글자를 원의 세로 가운데에 맞춘다 (sm 글자 × 1.5 줄 높이 기준)
      vertical: { paddingTop: `calc((${CIRCLE} - ${vars.font.size.sm} * 1.5) / 2)` },
    },
  },
});

export const label = recipe({
  base: { fontSize: vars.font.size.sm },
  variants: {
    status: {
      complete: { color: vars.color.fg.default, fontWeight: vars.font.weight.medium },
      current: { color: vars.color.fg.default, fontWeight: vars.font.weight.semibold },
      upcoming: { color: vars.color.fg.muted },
    },
  },
});

export const description = style({
  fontSize: vars.font.size.xs,
  color: vars.color.fg.muted,
});
