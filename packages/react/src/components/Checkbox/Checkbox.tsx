import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import * as styles from './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** 체크박스 옆에 표시할 레이블 */
  label?: ReactNode;
  /** 크기 */
  size?: 'sm' | 'md';
  /** 일부 선택 상태 (전체 선택 체크박스 등) */
  indeterminate?: boolean;
  /** 에러 상태 */
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size, indeterminate = false, invalid, disabled, className, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);

  // indeterminate 는 HTML 속성이 없어 DOM 프로퍼티로 설정해야 한다.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx(styles.root({ size }), className)} data-disabled={disabled || undefined}>
      <span className={styles.control({ size })}>
        <input
          ref={mergeRefs(innerRef, ref)}
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 10.5l3.2 3L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className={styles.indeterminateIcon} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {label}
    </label>
  );
});
