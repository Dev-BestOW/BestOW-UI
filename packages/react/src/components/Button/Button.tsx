import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from '../Spinner/Spinner';
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
  /**
   * 진행 중 상태. `startIcon` 자리에 스피너를 보여 주고 `aria-busy` 를 붙이며 클릭(폼 제출 포함)을 막는다.
   * `disabled` 와 달리 포커스는 유지된다.
   */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, color, size, fullWidth, startIcon, endIcon, loading, className, type = 'button', onClick, children, ...rest },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  const leading = loading ? <Spinner size="sm" label="" /> : startIcon;

  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button({ variant, color, size, fullWidth }), className)}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {leading && <span className={styles.icon}>{leading}</span>}
      {children}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
});
