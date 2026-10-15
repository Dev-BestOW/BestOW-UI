import { LoaderIcon } from '@bestow-ui/icons';
import { forwardRef, type HTMLAttributes } from 'react';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import * as styles from './Spinner.css';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 크기 (sm 16px, md 20px, lg 28px) */
  size?: 'sm' | 'md' | 'lg';
  /** 색상. `current` 는 부모 글자색을 그대로 쓴다 */
  color?: 'current' | 'primary' | 'neutral' | 'danger';
  /**
   * 스크린리더가 읽을 텍스트 (기본 "로딩 중").
   * 빈 문자열이면 장식용으로 보고 `aria-hidden` 처리한다 — 버튼처럼 바깥 요소가 이미 상태를 알릴 때 쓴다.
   */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, color, label = '로딩 중', className, ...rest },
  ref,
) {
  const a11y = label ? { role: 'status' } : { 'aria-hidden': true };
  return (
    <span ref={ref} className={cx(styles.spinner({ size, color }), className)} {...a11y} {...rest}>
      <LoaderIcon size="100%" />
      {label && <span className={visuallyHidden}>{label}</span>}
    </span>
  );
});
