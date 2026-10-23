import { forwardRef, useId, useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import { Checkbox } from '../Checkbox';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './CheckboxGroup.css';

export interface CheckboxOption {
  value: string;
  label: ReactNode;
  /** 레이블 아래 보조 설명 (접근 가능한 이름이 아니라 설명으로 읽힌다) */
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** 선택지 목록 */
  options: CheckboxOption[];
  /** 선택된 값들 (제어 모드). undefined 를 넘기면 아무것도 선택하지 않은 상태 */
  value?: string[];
  /** 처음 선택된 값들 (비제어 모드) */
  defaultValue?: string[];
  /** 값이 바뀔 때 호출된다 — options 순서대로 정렬한 배열 */
  onValueChange?: (value: string[]) => void;
  /** 묶음 위에 표시할 레이블 */
  label?: ReactNode;
  /** 묶음 아래 도움말. error 일 때는 오류 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 오류 상태 — 각 체크박스에 aria-invalid */
  error?: boolean;
  /** 배치 방향 */
  orientation?: 'vertical' | 'horizontal';
  /** 크기 */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /**
   * 하나 이상 골라야 함 — 레이블에 * 와 스크린리더용 "필수" 를 붙인다. "몇 개 이상" 검증은 폼(react-hook-form 등)에서 한다
   * (체크박스마다 네이티브 required 를 주면 "모두 골라야 함" 이 되어 쓰지 않는다).
   */
  required?: boolean;
  /** form 제출 시 사용할 이름 — 고른 값마다 같은 이름으로 제출된다(FormData.getAll) */
  name?: string;
  /** 묶음의 id (ErrorSummary 링크·focusField 가 이 id 로 첫(또는 선택된) 체크박스를 찾는다) */
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 바깥 래퍼 className */
  className?: string;
}

/**
 * 여러 선택지 중 여러 개를 고르는 체크박스 묶음. 묶음 레이블·도움말·오류를 한 번에 연결한다.
 * 약관 동의(전체 동의·필수/선택 표시·보기)는 AgreementGroup 을 쓴다.
 */
export const CheckboxGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      options,
      value,
      defaultValue,
      onValueChange,
      label,
      helperText,
      error,
      orientation,
      size,
      disabled,
      required,
      name,
      id,
      'aria-label': ariaLabel,
      className,
    } = props;
    const m = useMessages();
    // RadioGroup 과 같은 이유로, value prop 을 넘겼다면 undefined 여도 제어 모드로 본다
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState<string[]>(defaultValue ?? []);
    const current = isControlled ? (value ?? []) : innerValue;
    const generatedId = useId();
    const baseId = id ?? generatedId;
    const labelId = label ? `${baseId}-label` : undefined;
    const helperId = helperText ? `${baseId}-helper` : undefined;

    const toggle = (optionValue: string, checked: boolean) => {
      const next = options
        .map((option) => option.value)
        .filter((v) => (v === optionValue ? checked : current.includes(v)));
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    };

    return (
      <div className={cx(fieldStyles.field, className)}>
        {label && (
          <span id={labelId} className={cx(fieldStyles.label, styles.groupLabel)}>
            {label}
            {required && (
              <>
                <span className={fieldStyles.requiredMark} aria-hidden>
                  *
                </span>
                {/* group 역할에는 aria-required 가 없어 이름에 "필수" 를 넣는다. 공백은 숨김 span 밖에(안에 두면 absolute 라 빠진다) */}{' '}
                <span className={visuallyHidden}>({m.required ?? '필수'})</span>
              </>
            )}
          </span>
        )}
        <div
          ref={ref}
          id={baseId}
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={labelId}
          aria-describedby={helperId}
          className={styles.items({ orientation })}
        >
          {options.map((option) => {
            const itemId = `${baseId}-${option.value}`;
            const descriptionId = option.description ? `${itemId}-description` : undefined;
            return (
              <div key={option.value} className={styles.option}>
                <Checkbox
                  id={itemId}
                  name={name}
                  value={option.value}
                  label={option.label}
                  size={size}
                  checked={current.includes(option.value)}
                  onCheckedChange={(checked) => toggle(option.value, checked)}
                  disabled={disabled || option.disabled}
                  invalid={error}
                  aria-describedby={descriptionId}
                />
                {option.description && (
                  <span id={descriptionId} className={styles.description({ size })}>
                    {option.description}
                  </span>
                )}
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
  },
);
