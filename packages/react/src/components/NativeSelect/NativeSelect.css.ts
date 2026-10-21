import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// 테두리·포커스·오류·비활성 모양은 Input 의 root 를 그대로 쓰고, select 가 상자 전체(여백 포함)를 채워 어디를 눌러도 열리게 한다
export const wrapper = style({
  position: 'relative',
  paddingInline: 0,
  cursor: 'pointer',
});

export const select = recipe({
  base: {
    appearance: 'none',
    flex: 1,
    minWidth: 0,
    height: '100%',
    margin: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    cursor: 'inherit',
    textOverflow: 'ellipsis',
    selectors: {
      // 값이 '' 인 placeholder 가 선택된 동안은 흐린 글자 (Select 의 placeholder 와 같은 색)
      '&:has(option[value=""]:checked)': { color: vars.color.fg.subtle },
      '&:disabled': { cursor: 'not-allowed' },
      // 운영체제 목록 창의 색 — 다크 테마에서는 어두운 목록(Chrome·Edge 의 Windows 등 꾸밀 수 있는 곳만)
      '[data-theme="dark"] &': { colorScheme: 'dark' },
      '[data-theme="dark"] [data-theme="light"] &': { colorScheme: 'light' },
    },
  },
  variants: {
    // Input root 의 좌우 여백 + 오른쪽은 화살표 자리
    size: {
      sm: { paddingInline: `${vars.space[2]} ${vars.space[8]}` },
      md: { paddingInline: `${vars.space[3]} ${vars.space[8]}` },
      lg: { paddingInline: `${vars.space[4]} ${vars.space[10]}` },
    },
  },
  defaultVariants: { size: 'md' },
});

export const icon = recipe({
  base: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: vars.color.fg.subtle,
    pointerEvents: 'none',
  },
  variants: {
    size: {
      sm: { right: vars.space[2] },
      md: { right: vars.space[3] },
      lg: { right: vars.space[4] },
    },
  },
  defaultVariants: { size: 'md' },
});
