import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

// 자릿수 폭을 맞춰 값이 바뀔 때 글자가 흔들리지 않게 한다
export const input = style({
  fontVariantNumeric: 'tabular-nums',
});

export const end = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
});

export const unit = style({
  color: vars.color.fg.muted,
});

/** −/+ 버튼. 입력창 높이 안에 들어가도록 줄이고, 입력창 안쪽 여백 쪽으로 조금 붙인다 */
export const stepper = recipe({
  base: {
    marginInline: `calc(${vars.space[1]} * -1)`,
  },
  variants: {
    size: {
      // Button 의 minHeight 보다 작게 쓰므로 minHeight 도 함께 맞춘다
      sm: { width: '24px', height: '24px', minHeight: '24px' },
      md: { width: '32px', height: '32px', minHeight: '32px' },
      lg: { width: '36px', height: '36px', minHeight: '36px' },
    },
  },
  defaultVariants: { size: 'md' },
});
