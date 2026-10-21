import { forwardRef, useId, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './NativeSelect.css';

export interface NativeSelectOption {
  value: string;
  /** `<option>` 은 글자만 담을 수 있어 문자열 */
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'> {
  /** 선택지 목록. 없으면 children 의 `<option>`·`<optgroup>` 을 그대로 쓴다 */
  options?: NativeSelectOption[];
  /** 값이 바뀔 때 새 값으로 호출된다 (Select 와 같은 이름). 네이티브 onChange 도 함께 쓸 수 있다 */
  onValueChange?: (value: string) => void;
  /** 선택 전 표시할 문구 — 값이 '' 인 고를 수 없는 첫 항목으로 들어간다 */
  placeholder?: string;
  /** 위에 표시할 레이블 */
  label?: ReactNode;
  /** 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
}

/**
 * 브라우저 기본 `<select>` 에 Select 와 같은 모양을 입힌 것. Radix 가 없어 가볍고(폼 세트 번들이 크게 준다),
 * 모바일에서는 운영체제의 선택 화면이 열린다. `register(...)` 를 그대로 펼칠 수 있다.
 * 목록 모양을 꾸미거나 항목에 아이콘을 넣어야 하면 Select 를 쓴다.
 */
export const NativeSelect = /* @__PURE__ */ forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  {
    options,
    onValueChange,
    onChange,
    placeholder,
    label,
    helperText,
    error,
    size,
    fullWidth,
    required,
    disabled,
    id,
    value,
    defaultValue,
    className,
    children,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div className={cx(fieldStyles.field, fullWidth && fieldStyles.fieldFullWidth)}>
      {label && (
        <label htmlFor={selectId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <span
        className={cx(fieldStyles.root({ size, fullWidth }), styles.wrapper)}
        data-invalid={error || undefined}
        data-disabled={disabled || undefined}
      >
        <select
          ref={ref}
          id={selectId}
          // 값 prop 이 없고 placeholder 가 있으면 placeholder 로 시작한다(브라우저는 고를 수 없는 항목도 처음에 보여 준다)
          value={value}
          defaultValue={
            value === undefined && defaultValue === undefined && placeholder !== undefined ? '' : defaultValue
          }
          onChange={handleChange}
          required={required}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={cx(helperId, ariaDescribedBy) || undefined}
          className={cx(styles.select({ size }), className)}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDownIcon size={16} className={styles.icon({ size })} />
      </span>
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
