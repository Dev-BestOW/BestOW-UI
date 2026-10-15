import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 에러 상태 표시 (aria-invalid 도 함께 설정된다) */
  invalid?: boolean;
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /** 입력창 앞에 표시할 요소 (아이콘, 단위 등) */
  startAdornment?: ReactNode;
  /** 입력창 뒤에 표시할 요소 */
  endAdornment?: ReactNode;
  /** 바깥 래퍼에 적용할 className. className 은 input 요소에 적용된다 */
  rootClassName?: string;
}

export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, invalid, fullWidth, startAdornment, endAdornment, rootClassName, className, disabled, ...rest },
  ref,
) {
  return (
    <div
      className={cx(styles.root({ size, fullWidth }), rootClassName)}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      {startAdornment && <span className={styles.adornment}>{startAdornment}</span>}
      <input
        ref={ref}
        className={cx(styles.input, className)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {endAdornment && <span className={styles.adornment}>{endAdornment}</span>}
    </div>
  );
});
