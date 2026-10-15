import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Input, type InputProps } from './Input';
import * as styles from './Input.css';

export interface TextFieldProps extends Omit<InputProps, 'invalid'> {
  /** 입력창 위에 표시할 레이블 */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
}

export const TextField = /* @__PURE__ */ forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helperText, error, required, fullWidth, id, 'aria-describedby': ariaDescribedBy, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={cx(styles.field, fullWidth && styles.fieldFullWidth)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <Input
        ref={ref}
        id={inputId}
        invalid={error}
        required={required}
        fullWidth={fullWidth}
        aria-describedby={cx(helperId, ariaDescribedBy) || undefined}
        {...rest}
      />
      {helperText && (
        <p id={helperId} className={styles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
