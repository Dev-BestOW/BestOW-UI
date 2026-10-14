import * as RadixSelect from '@radix-ui/react-select';
import { forwardRef, useId, type ReactNode } from 'react';
import { CheckIcon, ChevronDownIcon } from '@bestow-ui/icons';
import { usePortalClassName } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './Select.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** 선택지 목록 */
  options: SelectOption[];
  /** 선택된 값 (제어 모드) */
  value?: string;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string;
  /** 값이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 선택 전 표시할 문구 */
  placeholder?: ReactNode;
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
  disabled?: boolean;
  required?: boolean;
  /** form 제출 시 사용할 이름 */
  name?: string;
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 트리거 className */
  className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder,
    label,
    helperText,
    error,
    size,
    fullWidth,
    disabled,
    required,
    name,
    id,
    'aria-label': ariaLabel,
    className,
  },
  ref,
) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const helperId = helperText ? `${triggerId}-helper` : undefined;
  const portalClassName = usePortalClassName();

  return (
    <div className={cx(fieldStyles.field, fullWidth && fieldStyles.fieldFullWidth)}>
      {label && (
        <label htmlFor={triggerId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
      >
        <RadixSelect.Trigger
          ref={ref}
          id={triggerId}
          aria-label={ariaLabel}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          data-invalid={error || undefined}
          className={cx(fieldStyles.root({ size, fullWidth }), styles.trigger, className)}
        >
          <span className={styles.value}>
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon className={styles.icon}>
            <ChevronDownIcon size={16} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            collisionPadding={8}
            className={cx(portalClassName, styles.content)}
          >
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={styles.item}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={styles.itemIndicator}>
                    <CheckIcon size={16} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
