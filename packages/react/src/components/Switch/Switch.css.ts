import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { reducedMotion } from '../../styles/animations.css';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { controlBorderColor } from '../../styles/inputBorder.css';
import { vars } from '../../theme/contract.css';

export const root = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    color: vars.color.fg.default,
    selectors: {
      '&[data-disabled]': { opacity: 0.5 },
    },
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
    },
  },
  defaultVariants: { size: 'md' },
});

export const track = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    padding: '2px',
    border: 'none',
    borderRadius: vars.radius.full,
    backgroundColor: controlBorderColor,
    cursor: 'pointer',
    transition: `background-color ${vars.duration.fast}`,
    selectors: {
      '&[data-state="checked"]': { backgroundColor: vars.color.primary.solid },
      '&[data-state="checked"]:hover:not(:disabled)': { backgroundColor: vars.color.primary.solidHover },
      '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
      '&:disabled': { cursor: 'not-allowed' },
    },
    // 고대비: 트랙 배경이 지워져 스위치가 사라진다 → 테두리, 켜지면 시스템 강조색
    '@media': {
      [forcedColors]: {
        border: '1px solid CanvasText',
        // hover 규칙(켜짐 + hover = 원래 색)이 더 구체적이라 함께 덮는다
        selectors: {
          '&[data-state="checked"], &[data-state="checked"]:hover:not(:disabled)': {
            ...systemHighlight,
            borderColor: 'Highlight',
          },
        },
      },
    },
  },
  variants: {
    size: {
      sm: { width: '28px', height: '16px' },
      md: { width: '36px', height: '20px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const thumb = recipe({
  base: {
    display: 'block',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.sm,
    transition: `transform ${vars.duration.fast}`,
    selectors: {
      '&[data-state="checked"]': { backgroundColor: vars.color.primary.contrast },
    },
    '@media': {
      [reducedMotion]: { transition: 'none' },
      [forcedColors]: {
        forcedColorAdjust: 'none',
        backgroundColor: 'CanvasText',
        boxShadow: 'none',
        selectors: { '&[data-state="checked"]': { backgroundColor: 'HighlightText' } },
      },
    },
  },
  variants: {
    size: {
      sm: {
        width: '12px',
        height: '12px',
        selectors: { '&[data-state="checked"]': { transform: 'translateX(12px)' } },
      },
      md: {
        width: '16px',
        height: '16px',
        selectors: { '&[data-state="checked"]': { transform: 'translateX(16px)' } },
      },
    },
  },
  defaultVariants: { size: 'md' },
});

// form 안에서 값 제출·required 검증을 맡는 숨긴 checkbox. 트랙 위에 겹쳐 두어 브라우저의 검증 말풍선이 스위치를 가리키게 한다
export const bubbleInput = recipe({
  base: {
    position: 'absolute',
    top: '50%',
    left: 0,
    margin: 0,
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(-50%)',
  },
  variants: {
    size: {
      sm: { width: '28px', height: '16px' },
      md: { width: '36px', height: '20px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const label = style({
  cursor: 'pointer',
  userSelect: 'none',
  selectors: {
    '[data-disabled] > &': { cursor: 'not-allowed' },
  },
});
