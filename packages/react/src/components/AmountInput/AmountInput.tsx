import { forwardRef, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { formatKoreanAmount } from '../../utils/koreanFormat';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { TextField, type TextFieldProps } from '../Input';
import * as styles from './AmountInput.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface AmountInputProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode' | 'endAdornment'
> {
  /** 금액 (제어 모드). 비어 있으면 null */
  value?: number | null;
  /** 처음 금액 (비제어 모드) */
  defaultValue?: number | null;
  /** 금액이 바뀔 때 호출된다. 비우면 null */
  onValueChange?: (amount: number | null) => void;
  /** 최댓값. 넘게 입력하면 최댓값으로 맞춘다 */
  max?: number;
  /** 단위 (입력창 뒤에 표시, 한글 읽기에도 붙는다) */
  unit?: string;
  /**
   * 아래에 "12만 5,000원" 처럼 읽기 쉬운 금액을 보여 준다 (기본 true).
   * helperText 를 주면 그 아래 줄로 함께 보여 준다.
   */
  showKoreanAmount?: boolean;
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

const MAX_DIGITS = 15; // Number.MAX_SAFE_INTEGER 안쪽 (천조 원 단위까지)
const isDigit = (char: string) => /\d/.test(char);

/**
 * 금액 입력. 천 단위 쉼표를 넣고 뒤에 단위("원")를 붙이며, 아래에 "12만 5,000원" 처럼 읽기 쉬운 금액을 보여 준다.
 * 값은 숫자(number)로 넘긴다.
 */
export const AmountInput = /* @__PURE__ */ forwardRef<HTMLInputElement, AmountInputProps>(
  function AmountInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      max,
      unit: unitProp,
      showKoreanAmount = true,
      label: labelProp,
      placeholder = '0',
      helperText,
      onKeyDown,
      className,
      ...rest
    } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const m = useMessages();
    const unit = unitProp ?? m.currencyUnit ?? '원';
    const label = labelProp ?? m.amount ?? '금액';

    const sanitize = (input: string) => {
      let digits = input
        .replace(/\D/g, '')
        .replace(/^0+(?=\d)/, '')
        .slice(0, MAX_DIGITS);
      if (max !== undefined && digits && Number(digits) > max) digits = String(Math.floor(max));
      return digits;
    };
    const toRaw = (amount: number | null | undefined) =>
      amount === null || amount === undefined ? '' : String(Math.floor(Math.abs(amount)));

    const field = useFormattedInput({
      isControlled: 'value' in props,
      value: toRaw(value),
      defaultValue: toRaw(defaultValue),
      onValueChange: (digits) => onValueChange?.(digits === '' ? null : Number(digits)),
      sanitize,
      format: (digits) => (digits === '' ? '' : Number(digits).toLocaleString('ko-KR')),
      isMeaningful: isDigit,
      inputRef,
    });

    const reading: ReactNode =
      showKoreanAmount && field.raw !== '' ? formatKoreanAmount(Number(field.raw), unit) : null;

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
        endAdornment={unit}
        helperText={
          reading && helperText ? (
            <>
              {reading}
              <br />
              {helperText}
            </>
          ) : (
            (reading ?? helperText)
          )
        }
        className={cx(styles.input, className)}
        {...rest}
      />
    );
  },
);
