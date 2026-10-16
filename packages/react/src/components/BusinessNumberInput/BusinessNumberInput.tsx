import { forwardRef, useRef, useState, type ReactNode } from 'react';
import { mergeRefs } from '../../utils/mergeRefs';
import { formatBusinessNumber, isValidBusinessNumber } from '../../utils/koreanFormat';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { TextField, type TextFieldProps } from '../Input';
import { useMessages } from '../../i18n/LocaleProvider';

export interface BusinessNumberInputProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> {
  /** 숫자만 있는 사업자등록번호 (제어 모드). 예: "1248100998" */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 10자리를 다 채웠을 때 검증 공식 통과 여부로 호출된다 (다 채우기 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /**
   * 10자리를 다 채웠는데 검증 공식에 맞지 않으면 자동으로 오류를 보여 준다 (기본 true).
   * 직접 error·helperText 를 주면 그 값이 우선한다.
   */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
  // ── 아래는 TextFieldProps 에서 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    Omit 으로 물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 입력창 위에 표시할 레이블 */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 필수 입력 (레이블에 * 표시, required 속성) */
  required?: boolean;
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  placeholder?: string;
  /** form 제출 시 사용할 이름 */
  name?: string;
}

const sanitize = (input: string) => input.replace(/\D/g, '').slice(0, 10);
const isDigit = (char: string) => /\d/.test(char);

/**
 * 사업자등록번호 입력. 123-45-67890 형식으로 하이픈을 넣고, 10자리를 채우면 검증 공식으로 확인한다.
 * (검증 공식은 오타를 거르는 용도 — 실제 등록·휴폐업 여부는 국세청 조회가 필요하다)
 */
export const BusinessNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, BusinessNumberInputProps>(
  function BusinessNumberInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      validate = true,
      invalidText: invalidTextProp,
      label: labelProp,
      placeholder = '000-00-00000',
      error,
      helperText,
      onBlur,
      onKeyDown,
      ...rest
    } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const m = useMessages();
    const invalidText =
      invalidTextProp ?? m.businessNumberInvalid ?? '올바른 사업자등록번호가 아니에요. 번호를 다시 확인해 주세요.';
    const label = labelProp ?? m.businessNumber ?? '사업자등록번호';
    const incompleteText = m.businessNumberIncomplete ?? '10자리를 모두 입력해 주세요.';
    // 입력 중에는 오류를 띄우지 않고, 10자리를 채웠거나 입력창을 벗어난 뒤에 보여 준다
    const [touched, setTouched] = useState(false);
    const field = useFormattedInput({
      isControlled: 'value' in props,
      value,
      defaultValue,
      onValueChange: (digits) => onValueChange?.(digits, digits.length === 10 ? isValidBusinessNumber(digits) : null),
      sanitize,
      format: formatBusinessNumber,
      isMeaningful: isDigit,
      inputRef,
    });
    const complete = field.raw.length === 10;
    const autoInvalid = validate && field.raw.length > 0 && (complete ? !isValidBusinessNumber(field.raw) : touched);
    const showAuto = autoInvalid && error === undefined;

    return (
      <TextField
        ref={mergeRefs(ref, inputRef)}
        label={label}
        placeholder={placeholder}
        inputMode="numeric"
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
        helperText={showAuto ? (complete ? invalidText : incompleteText) : helperText}
        {...rest}
      />
    );
  },
);
