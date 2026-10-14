import type { space } from '@bestow-ui/tokens';
import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Stack.css';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 요소 */
  as?: ElementType;
  /** 배치 방향 */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** 자식 사이 간격 (space 토큰 키) */
  gap?: keyof typeof space;
  /** 교차축 정렬 (align-items) */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** 주축 정렬 (justify-content) */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** 줄바꿈 허용 */
  wrap?: boolean;
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as: Component = 'div', direction, gap, align, justify, wrap, className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx(styles.stack({ direction, gap, align, justify, wrap }), className)}
      {...rest}
    />
  );
});
