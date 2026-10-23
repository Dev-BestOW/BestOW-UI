import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const groupLabel = style({ marginBottom: vars.space[1] });

export const items = recipe({
  base: { display: 'flex', gap: vars.space[3] },
  variants: {
    orientation: {
      vertical: { flexDirection: 'column' },
      horizontal: { flexDirection: 'row', flexWrap: 'wrap', columnGap: vars.space[5] },
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const option = style({ display: 'flex', flexDirection: 'column', gap: '2px' });

// 설명은 체크박스 글자와 줄을 맞춘다 (컨트롤 폭 + 간격 — Checkbox.css 의 control·gap)
export const description = recipe({
  base: {
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.normal,
    color: vars.color.fg.muted,
  },
  variants: {
    size: {
      sm: { marginInlineStart: `calc(16px + ${vars.space[2]})` },
      md: { marginInlineStart: `calc(20px + ${vars.space[2]})` },
    },
  },
  defaultVariants: { size: 'md' },
});
