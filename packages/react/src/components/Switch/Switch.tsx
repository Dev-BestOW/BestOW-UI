import * as RadixSwitch from '@radix-ui/react-switch';
import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Switch.css';

export interface SwitchProps {
  /** 스위치 옆에 표시할 레이블 */
  label?: ReactNode;
  /** 크기 */
  size?: 'sm' | 'md';
  /** 켜짐 상태 (제어 모드) */
  checked?: boolean;
  /** 처음 켜짐 상태 (비제어 모드) */
  defaultChecked?: boolean;
  /** 켜짐 상태가 바뀔 때 호출된다 */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  /** form 제출 시 사용할 이름 */
  name?: string;
  /** form 제출 시 켜져 있을 때의 값 (기본 "on") */
  value?: string;
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 바깥 래퍼 className */
  className?: string;
}

export const Switch = /* @__PURE__ */ forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, size, id, className, disabled, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <span className={cx(styles.root({ size }), className)} data-disabled={disabled || undefined}>
      <RadixSwitch.Root
        ref={ref}
        id={switchId}
        disabled={disabled}
        aria-label={ariaLabel}
        className={styles.track({ size })}
        {...rest}
      >
        <RadixSwitch.Thumb className={styles.thumb({ size })} />
      </RadixSwitch.Root>
      {label && (
        <label htmlFor={switchId} className={styles.label}>
          {label}
        </label>
      )}
    </span>
  );
});
