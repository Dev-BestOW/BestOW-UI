import { forwardRef, useId, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import { isValidResidentNumber, parseResidentNumber } from '@bestow-ui/korean-utils';
import { useMessages } from '../../i18n/LocaleProvider';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useDelayedAnnouncement } from '../../utils/useDelayedAnnouncement';
import { Input } from '../Input';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './ResidentNumberInput.css';

export interface ResidentNumberInputProps {
  /** 숫자만 있는 값 (제어 모드). 예: "9001011234567" (digits={7} 이면 "9001011") */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 다 채웠을 때 생년월일·뒷자리 첫 숫자가 맞는지로 호출된다 (다 채우기 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /**
   * 받을 자릿수. 13(기본)은 뒤 7자리를 가려서(password) 받고, 7 은 생년월일 + 뒷자리 첫 숫자만 받는다(나이·성별 확인 —
   * 주민번호 전체가 필요 없으면 7 을 쓴다).
   */
  digits?: 13 | 7;
  /**
   * 다 채웠는데 생년월일·뒷자리 첫 숫자가 맞지 않으면 자동으로 오류를 보여 준다 (기본 true). 마지막 검증 숫자는 보지 않는다
   * (2020년 10월 이후 번호는 임의 번호). 직접 error·helperText 를 주면 그 값이 우선한다.
   */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
  /** 위에 표시할 레이블 (기본 "주민등록번호") */
  label?: ReactNode;
  /** 아래 도움말. error 일 때는 오류 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 오류 상태 */
  error?: boolean;
  /** 필수 입력 (레이블에 * 표시, required 속성) */
  required?: boolean;
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** form 제출 시 사용할 이름 — 숫자만 있는 값을 숨긴 input 으로 제출한다 */
  name?: string;
  /** 묶음 id — 앞칸은 `${id}-front`, 뒷칸은 `${id}-back` (ErrorSummary 링크·focusField 는 이 id 로 앞칸을 찾는다) */
  id?: string;
  /** 바깥 래퍼 className */
  className?: string;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}

const onlyDigits = (input: string) => input.replace(/\D/g, '');

/**
 * 주민·외국인등록번호 입력 — 앞 6자리와 뒷자리를 두 칸으로 받고 뒷자리는 가린다(password). 번호를 통째로 앞칸에 붙여 넣으면 두 칸에 나눠 넣는다.
 * 앞칸을 다 채워도 포커스를 옮기지 않는다(예고 없는 포커스 이동은 WCAG 3.2.2). 뒷칸이 비었을 때 Backspace 는 앞칸으로 간다.
 *
 * 주민등록번호는 법령에 근거가 있을 때만 수집할 수 있다(개인정보 보호법 제24조의2). 나이·성별만 필요하면 `digits={7}`.
 */
export const ResidentNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, ResidentNumberInputProps>(
  function ResidentNumberInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      digits = 13,
      validate = true,
      invalidText: invalidTextProp,
      label: labelProp,
      helperText,
      error,
      required,
      disabled,
      size,
      name,
      id,
      className,
      onBlur,
    } = props;
    const m = useMessages();
    const label = labelProp ?? m.residentNumber ?? '주민등록번호';
    const invalidText =
      invalidTextProp ??
      m.residentNumberInvalid ??
      '올바른 주민등록번호가 아니에요. 생년월일과 뒷자리 첫 숫자를 확인해 주세요.';
    const incompleteText = m.residentNumberIncomplete?.(digits) ?? `${digits}자리를 모두 입력해 주세요.`;
    const backLength = digits - 6;

    // 두 칸을 따로 들고 있는다 — 앞칸을 덜 채운 채 뒷칸을 쓰면 합친 값만으로는 어디서 나눌지 알 수 없다.
    // 제어 모드에서 바깥 값이 지금 두 칸을 합친 것과 다를 때만 바깥 값으로 다시 나눈다.
    const isControlled = 'value' in props;
    const split = (v: string) => {
      const d = onlyDigits(v).slice(0, digits);
      return { front: d.slice(0, 6), back: d.slice(6) };
    };
    const [parts, setParts] = useState(() => split((isControlled ? value : defaultValue) ?? ''));
    const current = isControlled && (value ?? '') !== parts.front + parts.back ? split(value ?? '') : parts;
    const raw = current.front + current.back;

    const generatedId = useId();
    const baseId = id ?? generatedId;
    const frontId = `${baseId}-front`;
    const backId = `${baseId}-back`;
    const labelId = `${baseId}-label`;
    const frontRef = useRef<HTMLInputElement>(null);
    const backRef = useRef<HTMLInputElement>(null);

    const complete = current.front.length === 6 && current.back.length === backLength;
    const isValid = (v: string) => (digits === 13 ? isValidResidentNumber(v) : parseResidentNumber(v) !== null);
    const update = (next: { front: string; back: string }) => {
      setParts(next);
      const nextRaw = next.front + next.back;
      if (nextRaw === raw) return;
      const nextComplete = next.front.length === 6 && next.back.length === backLength;
      onValueChange?.(nextRaw, nextComplete ? isValid(nextRaw) : null);
    };

    // 입력 중에는 오류를 띄우지 않고, 다 채웠거나 두 칸을 모두 벗어난 뒤에 보여 준다
    const [touched, setTouched] = useState(false);
    const autoInvalid = validate && raw.length > 0 && (complete ? !isValid(raw) : touched);
    const showAuto = autoInvalid && error === undefined;
    const invalid = error ?? autoInvalid;
    const helper = showAuto ? (complete ? invalidText : incompleteText) : helperText;
    const helperId = helper ? `${baseId}-helper` : undefined;
    // 다 채운 순간 생긴 오류는 입력이 멈춘 뒤 알린다(BusinessNumberInput 과 같음)
    const announcement = useDelayedAnnouncement(showAuto && complete ? invalidText : '');

    const common = {
      inputMode: 'numeric' as const,
      autoComplete: 'off',
      size,
      disabled,
      required,
      invalid,
      'aria-describedby': helperId,
    };

    return (
      <div
        className={cx(fieldStyles.field, className)}
        onBlur={(event) => {
          // 포커스가 묶음 밖으로 나갈 때만 (앞칸 → 뒷칸 이동은 제외)
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTouched(true);
          onBlur?.(event);
        }}
      >
        <label id={labelId} htmlFor={frontId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
        <div role="group" id={baseId} aria-labelledby={labelId} className={styles.row}>
          <Input
            {...common}
            ref={mergeRefs(ref, frontRef)}
            id={frontId}
            aria-label={m.residentNumberFront ?? '앞 6자리'}
            placeholder="000000"
            rootClassName={styles.front}
            maxLength={6}
            value={current.front}
            onChange={(event) => update({ front: onlyDigits(event.target.value).slice(0, 6), back: current.back })}
            onPaste={(event) => {
              // 번호를 통째로(하이픈 포함) 붙여 넣으면 두 칸에 나눈다 — maxLength 가 자르기 전에 가로챈다
              const pasted = onlyDigits(event.clipboardData.getData('text'));
              if (pasted.length <= 6) return;
              event.preventDefault();
              update(split(pasted));
            }}
          />
          <span className={styles.separator} aria-hidden>
            -
          </span>
          <Input
            {...common}
            ref={backRef}
            id={backId}
            type={digits === 13 ? 'password' : 'text'}
            aria-label={
              digits === 13 ? (m.residentNumberBack ?? '뒤 7자리') : (m.residentNumberBackFirst ?? '뒷자리 첫 숫자')
            }
            maxLength={backLength}
            rootClassName={digits === 13 ? styles.back : styles.backOne}
            value={current.back}
            onChange={(event) =>
              update({ front: current.front, back: onlyDigits(event.target.value).slice(0, backLength) })
            }
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && current.back === '') {
                event.preventDefault();
                frontRef.current?.focus();
              }
            }}
          />
          {digits === 7 && (
            <span className={styles.hiddenDigits} aria-hidden>
              ●●●●●●
            </span>
          )}
        </div>
        {helper && (
          <p id={helperId} className={fieldStyles.helperText({ error: invalid })}>
            {helper}
          </p>
        )}
        {name && <input type="hidden" name={name} value={raw} />}
        <span role="status" className={visuallyHidden}>
          {announcement}
        </span>
      </div>
    );
  },
);
