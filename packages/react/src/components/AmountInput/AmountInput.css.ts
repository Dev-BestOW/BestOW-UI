import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

// 금액은 오른쪽 정렬 + 자릿수 폭을 맞춰 쉼표 위치가 흔들리지 않게 한다
export const input = style({
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
});

// 빠른 금액 버튼이 있을 때만 쓰는 바깥 묶음 — 입력칸과 같은 폭
export const root = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const rootFullWidth = style({
  display: 'flex',
  width: '100%',
});

// 좁은 화면에서는 줄을 바꾼다 (320px 리플로)
export const quickAmounts = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
});
