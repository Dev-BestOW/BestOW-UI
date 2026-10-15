import { style } from '@vanilla-extract/css';

// 금액은 오른쪽 정렬 + 자릿수 폭을 맞춰 쉼표 위치가 흔들리지 않게 한다
export const input = style({
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
});
