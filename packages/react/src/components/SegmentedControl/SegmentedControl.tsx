import { forwardRef, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './SegmentedControl.css';

export interface SegmentedControlOption {
  value: string;
  /** 칸에 보이는 글자 (접근 가능한 이름이 된다) */
  label: ReactNode;
  /** 글자 앞 아이콘 (장식용) */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 선택지 (2~5개 권장 — 많으면 Select 를 쓴다) */
  options: SegmentedControlOption[];
  /** 선택된 값 (제어 모드) */
  value?: string;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string;
  /** 값이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 위에 보이는 레이블. 없으면 aria-label 로 이름을 준다 */
  label?: ReactNode;
  /** label 이 없을 때 스크린리더용 이름 (예: "기간") */
  'aria-label'?: string;
  /** 크기 — 전체 높이가 Button·Input 과 같다 (sm 32 / md 40 / lg 48) */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채우고 칸을 같은 너비로 나눈다 */
  fullWidth?: boolean;
  disabled?: boolean;
  /** form 제출 시 사용할 이름 */
  name?: string;
  id?: string;
  className?: string;
}

const NEXT_KEYS: Record<string, 1 | -1> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * 여러 값 중 하나를 고르는 칸 묶음 (기간 일/주/월, 보기 방식 등).
 * 의미는 라디오 그룹과 같다(WAI-ARIA radiogroup): Tab 으로 그룹에 들어가면 선택된 칸, 화살표로 옮기면 바로 선택된다.
 * 선택에 따라 아래 내용이 바뀌는 "패널" 이 있으면 Tabs 를 쓴다.
 *
 * Radix RadioGroup 을 쓰지 않고 직접 구현한다 — Radix 는 "포커스가 옮겨질 때 화살표 키가 아직 눌려 있는지" 로 선택을 정해서
 * 키를 아주 빨리 떼는 입력(자동화·일부 보조기기)에서는 포커스만 옮겨지고 선택이 안 되는 경우가 있었다(E2E 에서 약 20%).
 */
export const SegmentedControl = /* @__PURE__ */ forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(props, ref) {
    const {
      options,
      value,
      defaultValue,
      onValueChange,
      label,
      'aria-label': ariaLabel,
      size,
      fullWidth,
      disabled,
      name,
      id,
      className,
    } = props;
    // Select·RadioGroup 과 같은 이유로, value prop 을 넘겼다면 undefined 여도 제어 모드로 본다.
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState(defaultValue ?? '');
    const current = isControlled ? (value ?? '') : innerValue;
    const generatedId = useId();
    const labelId = label ? `${id ?? generatedId}-label` : undefined;
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const isEnabled = (index: number) => !disabled && !options[index]?.disabled;
    const select = (index: number) => {
      const next = options[index]!.value;
      if (next === current) return;
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    };

    // roving tabindex: Tab 으로 들어오면 선택된 칸(없거나 비활성이면 첫 활성 칸)에 포커스가 간다
    const checkedIndex = options.findIndex((option) => option.value === current);
    const tabStop =
      checkedIndex >= 0 && isEnabled(checkedIndex) ? checkedIndex : options.findIndex((_, i) => isEnabled(i));

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let target = -1;
      const step = NEXT_KEYS[event.key];
      if (step) {
        // 비활성 칸은 건너뛰고, 끝에서 처음으로 돈다
        for (let i = 1; i <= options.length; i++) {
          const candidate = (index + step * i + options.length) % options.length;
          if (isEnabled(candidate)) {
            target = candidate;
            break;
          }
        }
      } else if (event.key === 'Home') {
        target = options.findIndex((_, i) => isEnabled(i));
      } else if (event.key === 'End') {
        for (let i = options.length - 1; i >= 0 && target < 0; i--) if (isEnabled(i)) target = i;
      }
      if (target < 0) return;
      event.preventDefault();
      itemRefs.current[target]?.focus();
      select(target);
    };

    const group = (
      <div
        ref={ref}
        id={id}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-label={label ? undefined : ariaLabel}
        aria-disabled={disabled || undefined}
        className={cx(styles.root({ fullWidth }), !label && className)}
      >
        {options.map((option, index) => {
          const checked = index === checkedIndex;
          return (
            <button
              key={option.value}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={index === tabStop ? 0 : -1}
              disabled={!isEnabled(index)}
              data-state={checked ? 'checked' : 'unchecked'}
              data-disabled={isEnabled(index) ? undefined : ''}
              className={styles.item({ size, fullWidth })}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {option.icon && (
                <span aria-hidden className={styles.icon}>
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          );
        })}
        {name && <input type="hidden" name={name} value={current} />}
      </div>
    );

    if (!label) return group;
    return (
      <div className={cx(fieldStyles.field, className)}>
        <span id={labelId} className={fieldStyles.label}>
          {label}
        </span>
        {group}
      </div>
    );
  },
);
