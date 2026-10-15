import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Badge.css';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 시각적 스타일 */
  variant?: 'solid' | 'soft' | 'outline';
  /** 의미 색상 */
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 텍스트 앞에 표시할 아이콘 (장식용 — 의미는 텍스트로 전달한다) */
  startIcon?: ReactNode;
}

export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, color, size, startIcon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(styles.badge({ variant, color, size }), className)} {...rest}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children}
    </span>
  );
});
