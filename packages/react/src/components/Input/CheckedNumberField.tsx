import { forwardRef, useRef, useState } from 'react';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { useDelayedAnnouncement } from '../../utils/useDelayedAnnouncement';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { TextField, type TextFieldProps } from './TextField';

/** 숫자 번호 입력(사업자등록번호·카드번호·법인등록번호·계좌번호)이 공통으로 받는 prop */
export interface CheckedNumberProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> {
  /** 숫자만 있는 값 (제어 모드) */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 다 채웠을 때 검증 통과 여부로 호출된다 (다 채우기 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /**
   * 다 채웠는데 검증에 맞지 않거나, 덜 채운 채 입력창을 벗어나면 자동으로 오류를 보여 준다 (기본 true).
   * 직접 error·helperText 를 주면 그 값이 우선한다.
   */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
}

/** 번호마다 다른 부분 — 내부용(공개 API 아님) */
export interface CheckedNumberRules {
  /** 입력에서 숫자만 남기고 최대 자릿수로 자른다 */
  sanitize: (input: string) => string;
  /** 화면에 보일 서식 (하이픈) */
  format: (digits: string) => string;
  /** 검증할 만큼 채웠는지 — 채운 순간 바로 검증한다. 덜 채운 값은 입력창을 벗어날 때 */
  isComplete: (digits: string) => boolean;
  isValid: (digits: string) => boolean;
  defaultLabel: string;
  defaultInvalidText: string;
  incompleteText: string;
  autoComplete?: string;
}

const isDigit = (char: string) => /\d/.test(char);

/**
 * 숫자 번호 입력의 공통 동작: 입력하는 대로 서식, 다 채우면 검증, 덜 채운 채 벗어나면 "끝까지 입력" 안내.
 * 다 채운 순간 생긴 오류는 입력이 멈춘 뒤 처음부터 있는 status 영역으로 알린다(설명으로는 다시 들어가야 들린다 — 스크린리더 수동 점검 2026-10-21).
 */
export const CheckedNumberField = /* @__PURE__ */ forwardRef<
  HTMLInputElement,
  CheckedNumberProps & { rules: CheckedNumberRules; isControlled: boolean }
>(function CheckedNumberField(props, ref) {
  const {
    rules,
    isControlled,
    value,
    defaultValue,
    onValueChange,
    validate = true,
    invalidText: invalidTextProp,
    label,
    error,
    helperText,
    onBlur,
    onKeyDown,
    ...rest
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const invalidText = invalidTextProp ?? rules.defaultInvalidText;
  // 입력 중에는 오류를 띄우지 않고, 다 채웠거나 입력창을 벗어난 뒤에 보여 준다
  const [touched, setTouched] = useState(false);
  useFormReset(inputRef, () => setTouched(false));
  const field = useFormattedInput({
    isControlled,
    value,
    defaultValue,
    onValueChange: (digits) => onValueChange?.(digits, rules.isComplete(digits) ? rules.isValid(digits) : null),
    sanitize: rules.sanitize,
    format: rules.format,
    isMeaningful: isDigit,
    inputRef,
  });
  const complete = rules.isComplete(field.raw);
  const autoInvalid = validate && field.raw.length > 0 && (complete || touched) && !rules.isValid(field.raw);
  const showAuto = autoInvalid && error === undefined;
  const announcement = useDelayedAnnouncement(showAuto && complete ? invalidText : '');

  return (
    <>
      <TextField
        ref={mergeRefs(ref, inputRef)}
        label={label ?? rules.defaultLabel}
        inputMode="numeric"
        autoComplete={rules.autoComplete}
        value={field.display}
        onChange={field.onChange}
        onKeyDown={(event) => {
          field.onKeyDown(event);
          onKeyDown?.(event);
        }}
        onBlur={(event) => {
          setTouched(true);
          onBlur?.(event);
        }}
        error={error ?? autoInvalid}
        helperText={showAuto ? (complete ? invalidText : rules.incompleteText) : helperText}
        {...rest}
      />
      <span role="status" className={visuallyHidden}>
        {announcement}
      </span>
    </>
  );
});
