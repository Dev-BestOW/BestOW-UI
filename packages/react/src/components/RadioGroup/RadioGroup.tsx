import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { forwardRef, useId, type ReactNode } from 'react';
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

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(props, ref) {
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
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = label ? `${baseId}-label` : undefined;
  const helperId = helperText ? `${baseId}-helper` : undefined;

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
      <RadixRadioGroup.Root
        ref={ref}
        id={baseId}
        value={isControlled ? (value ?? '') : undefined}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        disabled={disabled}
        required={required}
        name={name}
        aria-label={ariaLabel}
        aria-labelledby={labelId}
        aria-describedby={helperId}
        aria-invalid={error || undefined}
        className={styles.items({ orientation })}
      >
        {options.map((option) => {
          const itemId = `${baseId}-${option.value}`;
          const descriptionId = option.description ? `${itemId}-description` : undefined;
          const itemDisabled = disabled || option.disabled;
          return (
            <div key={option.value} className={styles.option({ size })} data-disabled={itemDisabled || undefined}>
              <RadixRadioGroup.Item
                id={itemId}
                value={option.value}
                disabled={option.disabled}
                aria-describedby={descriptionId}
                className={styles.radio({ size })}
              >
                <RadixRadioGroup.Indicator className={styles.indicator} />
              </RadixRadioGroup.Item>
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
      </RadixRadioGroup.Root>
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
