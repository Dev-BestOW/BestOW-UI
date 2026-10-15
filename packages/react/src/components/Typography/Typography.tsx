import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Typography.css';

export type TypographyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption';

const defaultElement: Record<TypographyVariant, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
};

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** 텍스트 스타일 */
  variant?: TypographyVariant;
  /** 렌더링할 요소. 기본값은 variant 에 따라 결정된다 (h1, p, span 등) */
  as?: ElementType;
  /** 글자 색상 */
  color?: 'default' | 'muted' | 'subtle' | 'primary' | 'danger' | 'success' | 'warning' | 'inherit';
  /** variant 의 기본 굵기를 덮어쓴다 */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** 정렬 */
  align?: 'start' | 'center' | 'end';
  /** 한 줄로 자르고 말줄임표를 표시한다 */
  truncate?: boolean;
}

export const Typography = /* @__PURE__ */ forwardRef<HTMLElement, TypographyProps>(function Typography(
  { variant = 'body', as, color, weight, align, truncate, className, ...rest },
  ref,
) {
  const Component = as ?? defaultElement[variant];
  return (
    <Component
      ref={ref}
      className={cx(styles.typography({ variant, color, weight, align, truncate }), className)}
      {...rest}
    />
  );
});
