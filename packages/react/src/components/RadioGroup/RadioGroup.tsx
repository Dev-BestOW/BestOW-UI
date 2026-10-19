import { forwardRef, useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** 레이블 아래 보조 설명 */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** 선택지 목록 */
  options: RadioOption[];
  /** 선택된 값 (제어 모드). undefined 를 넘기면 아무것도 선택하지 않은 상태 */
  value?: string;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string;
  /** 값이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 그룹 위에 표시할 레이블 */
  label?: ReactNode;
  /** 그룹 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 배치 방향 */
  orientation?: 'vertical' | 'horizontal';
  /** 크기 */
  size?: 'sm' | 'md';
  disabled?: boolean;
  required?: boolean;
  /** form 제출 시 사용할 이름 */
  name?: string;
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 바깥 래퍼 className */
  className?: string;
}

/**
 * 여러 선택지 중 하나를 고르는 라디오 버튼 묶음.
 *
 * 네이티브 `<input type="radio">` 로 만든다 — 화살표 이동·선택, Tab 으로 들어오기, 비활성 건너뛰기, 폼 제출·`required` 검증을
 * 브라우저가 처리한다. (1.1 까지는 Radix RadioGroup 이었는데, Radix 는 "포커스가 옮겨질 때 화살표 키가 아직 눌려 있는지" 로
 * 선택을 정해서 키를 바로 떼는 입력(자동화·일부 보조기기)에서는 포커스만 옮겨지고 선택이 빠졌다 — E2E 에서 20회 중 19회.)
 */
export const RadioGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const {
    options,
    value,
    defaultValue,
    onValueChange,
    label,
    helperText,
    error,
    orientation = 'vertical',
    size,
    disabled,
    required,
    name,
    id,
    'aria-label': ariaLabel,
    className,
  } = props;
  // Select 와 같은 이유로, value prop 을 넘겼다면 undefined 여도 제어 모드로 본다.
  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const current = isControlled ? (value ?? '') : innerValue;
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = label ? `${baseId}-label` : undefined;
  const helperId = helperText ? `${baseId}-helper` : undefined;
  // 브라우저는 같은 name 끼리 한 묶음으로 화살표 이동한다. name 을 안 받았으면 만든 이름으로 묶되,
  // 그 이름이 폼에 제출되지 않게 존재하지 않는 form id 를 가리켜 폼에서 뗀다(같은 "폼 없음" 끼리라 묶음은 유지된다).
  const groupName = name ?? `${baseId}-radio`;
  const detachedForm = name ? undefined : `${baseId}-no-form`;

  const handleChange = (next: string) => {
    if (next === current) return;
    if (!isControlled) setInnerValue(next);
    onValueChange?.(next);
  };

  return (
    <div className={cx(fieldStyles.field, className)}>
      {label && (
        <span id={labelId} className={cx(fieldStyles.label, styles.groupLabel)}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </span>
      )}
      <div
        ref={ref}
        id={baseId}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={labelId}
        aria-describedby={helperId}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        data-disabled={disabled || undefined}
        className={styles.items({ orientation })}
      >
        {options.map((option) => {
          const itemId = `${baseId}-${option.value}`;
          const descriptionId = option.description ? `${itemId}-description` : undefined;
          const itemDisabled = disabled || option.disabled;
          const checked = option.value === current;
          return (
            <div key={option.value} className={styles.option({ size })} data-disabled={itemDisabled || undefined}>
              <input
                type="radio"
                id={itemId}
                name={groupName}
                form={detachedForm}
                value={option.value}
                checked={checked}
                onChange={() => handleChange(option.value)}
                disabled={itemDisabled}
                required={required}
                aria-describedby={descriptionId}
                data-state={checked ? 'checked' : 'unchecked'}
                className={styles.radio({ size })}
              />
              {/* 접근 가능한 이름은 label 만, 보조 설명은 aria-describedby 로 따로 읽힌다 */}
              <span className={styles.text}>
                <label htmlFor={itemId} className={styles.labelText}>
                  {option.label}
                </label>
                {option.description && (
                  <span id={descriptionId} className={styles.description}>
                    {option.description}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
