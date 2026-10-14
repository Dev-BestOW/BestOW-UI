import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Button.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 시각적 스타일 */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  /** 의미 색상 */
  color?: 'primary' | 'neutral' | 'danger';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /** 레이블 앞에 표시할 아이콘 */
  startIcon?: ReactNode;
  /** 레이블 뒤에 표시할 아이콘 */
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, color, size, fullWidth, startIcon, endIcon, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button({ variant, color, size, fullWidth }), className)}
      {...rest}
    >
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
});
