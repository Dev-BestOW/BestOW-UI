import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// 테두리·포커스·비활성 모양은 Input.css 의 root 를 그대로 쓰고, 높이만 바꾼다 — 칩이 여러 줄이 되도록 height 대신 minHeight.
// root 의 size 변형(height)과 우선순위가 같아 '&&' 로 한 단계 높인다(CSS 순서에 기대지 않게).
export const root = recipe({
  base: {
    alignItems: 'flex-start',
    paddingBlock: '3px',
    selectors: { '&&': { height: 'auto' } },
  },
  variants: {
    size: {
      sm: { selectors: { '&&': { minHeight: '32px' } } },
      md: { selectors: { '&&': { minHeight: '40px' } } },
      lg: { selectors: { '&&': { minHeight: '48px' } } },
    },
  },
  defaultVariants: { size: 'md' },
});

/** 칩 목록 + 입력창 (줄바꿈) */
export const body = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  minWidth: 0,
});

/** 입력창 한 줄 높이 — 칩(sm 24px·md 32px)과 같은 줄 높이 */
export const input = recipe({
  base: {
    flex: '1 0 6rem',
    selectors: { '&&': { height: 'auto' } },
  },
  variants: {
    size: {
      sm: { minHeight: '24px' },
      md: { minHeight: '32px' },
      lg: { minHeight: '40px' },
    },
  },
  defaultVariants: { size: 'md' },
});

/** 오른쪽 버튼들 — 칩이 여러 줄이어도 첫 줄 가운데에 둔다 */
export const actions = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[1],
  },
  variants: {
    size: {
      sm: { minHeight: '24px' },
      md: { minHeight: '32px' },
      lg: { minHeight: '40px' },
    },
  },
  defaultVariants: { size: 'md' },
});
