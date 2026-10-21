import { forwardRef, useRef, type ReactNode } from 'react';
import { formatPhoneNumber, phoneNumberMaxDigits } from '@bestow-ui/korean-utils';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { TextField, type TextFieldProps } from '../Input';
import { useMessages } from '../../i18n/LocaleProvider';

export interface PhoneNumberInputProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> {
  /** 숫자만 있는 전화번호 (제어 모드). 예: "01012345678" */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값으로 호출된다 (하이픈 없음) */
  onValueChange?: (digits: string) => void;
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

const sanitize = (input: string) => {
  const digits = input.replace(/\D/g, '');
  return digits.slice(0, phoneNumberMaxDigits(digits));
};
const isDigit = (char: string) => /\d/.test(char);

/**
 * 전화번호 입력. 입력하는 대로 하이픈을 넣고(010-1234-5678, 02-123-4567, 1588-1234), 값은 숫자만 넘긴다.
 * 휴대폰에서 전화 키패드를 띄우고 브라우저의 전화번호 자동 완성을 받는다.
 */
export const PhoneNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  function PhoneNumberInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      label: labelProp,
      placeholder = '010-0000-0000',
      onKeyDown,
      ...rest
    } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const m = useMessages();
    const label = labelProp ?? m.phoneNumber ?? '휴대폰 번호';
    const field = useFormattedInput({
      isControlled: 'value' in props,
      value,
      defaultValue,
      onValueChange,
      sanitize,
      format: formatPhoneNumber,
      isMeaningful: isDigit,
      inputRef,
    });
    return (
      <TextField
        ref={mergeRefs(ref, inputRef)}
        label={label}
        placeholder={placeholder}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={field.display}
        onChange={field.onChange}
        onKeyDown={(event) => {
          field.onKeyDown(event);
          onKeyDown?.(event);
        }}
        {...rest}
      />
    );
  },
);
