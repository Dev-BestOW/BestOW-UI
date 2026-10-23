import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';
import { media } from '../../utils/responsive';

export const container = recipe({
  base: {
    width: '100%',
    marginInline: 'auto',
    paddingInline: vars.space[4],
    '@media': { [media.md]: { paddingInline: vars.space[6] } },
  },
  variants: {
    // 최대 폭은 구간 폭(tokens breakpoint)과 같고 rem 이라 기본 글꼴 크기를 따른다. 좌우 여백은 이 폭 안쪽
    size: {
      sm: { maxWidth: '40rem' },
      md: { maxWidth: '48rem' },
      lg: { maxWidth: '64rem' },
      xl: { maxWidth: '80rem' },
      full: { maxWidth: 'none' },
    },
    /** 좌우 여백 없이 (안에서 직접 여백을 줄 때) */
    flush: { true: { paddingInline: 0, '@media': { [media.md]: { paddingInline: 0 } } } },
  },
  defaultVariants: { size: 'lg' },
});
