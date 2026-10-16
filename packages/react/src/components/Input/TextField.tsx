import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
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
  // ── 아래는 InputProps 에서 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    Omit 으로 물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 필수 입력 (레이블에 * 표시, required 속성) */
  required?: boolean;
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /** 입력창 앞에 표시할 요소 (아이콘, 단위 등) */
  startAdornment?: ReactNode;
  /** 입력창 뒤에 표시할 요소 */
  endAdornment?: ReactNode;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
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
