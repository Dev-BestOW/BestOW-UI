import { forwardRef, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
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

// input.checked 를 React 의 값 추적을 거치지 않고 바꾼다 — 그래야 뒤에 보내는 click 을 React 가 "바뀜" 으로 보고
// 바깥 <form onChange> 등에 change 를 전달한다
function setNativeChecked(input: HTMLInputElement, checked: boolean) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked')?.set?.call(input, checked);
}

/**
 * 켜고 끄는 스위치. `<button role="switch">` 로 그리고, form 안에서는 숨긴 checkbox 로 값 제출·required 검증·reset 을 처리한다
 * (1.5 까지 쓰던 Radix Switch 와 같은 동작 — 번들을 줄이려고 직접 구현).
 */
export const Switch = /* @__PURE__ */ forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    size,
    id,
    className,
    disabled,
    required,
    name,
    value = 'on',
    checked: checkedProp,
    defaultChecked,
    onCheckedChange,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolled;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 서버 렌더링에서는 숨긴 input 을 그려 두고(JS 없이도 form 에 값이 들어가게), 마운트 뒤 form 밖이면 뺀다
  const [inForm, setInForm] = useState(true);
  const userToggled = useRef(false);

  const setChecked = (next: boolean) => {
    if (!isControlled) setUncontrolled(next);
    if (next !== checked) onCheckedChange?.(next);
  };
  // form reset 이벤트는 마운트 때 한 번 등록하므로 최신 함수를 ref 로 부른다
  const setCheckedRef = useRef(setChecked);
  setCheckedRef.current = setChecked;

  useEffect(() => {
    const form = buttonRef.current?.form;
    setInForm(!!form);
    if (!form) return;
    const initial = checked;
    const onReset = () => setCheckedRef.current(initial);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
    // 처음 값으로 되돌리는 것이라 마운트 때 한 번만 등록한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 숨긴 input 을 새 값에 맞추고, 사용자가 바꾼 경우 click 을 보내 바깥 form 의 change 듣기에 알린다
  useEffect(() => {
    const input = inputRef.current;
    if (!input || input.checked === checked) return;
    setNativeChecked(input, checked);
    if (userToggled.current) input.dispatchEvent(new Event('click', { bubbles: true }));
    userToggled.current = false;
  }, [checked]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    userToggled.current = true;
    setChecked(!checked);
    // form 안에서는 숨긴 input 이 click 을 대신 올려보낸다 — 바깥에서 click 이 두 번 잡히지 않게
    if (inForm) event.stopPropagation();
  };

  const state = checked ? 'checked' : 'unchecked';

  return (
    <span className={cx(styles.root({ size }), className)} data-disabled={disabled || undefined}>
      <button
        ref={mergeRefs(ref, buttonRef)}
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-required={required}
        aria-label={ariaLabel}
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        className={styles.track({ size })}
        onClick={handleClick}
      >
        <span className={styles.thumb({ size })} data-state={state} data-disabled={disabled ? '' : undefined} />
      </button>
      {inForm && (
        <input
          ref={inputRef}
          type="checkbox"
          aria-hidden
          tabIndex={-1}
          defaultChecked={checked}
          required={required}
          disabled={disabled}
          name={name}
          value={value}
          className={styles.bubbleInput({ size })}
        />
      )}
      {label && (
        <label htmlFor={switchId} className={styles.label}>
          {label}
        </label>
      )}
    </span>
  );
});
