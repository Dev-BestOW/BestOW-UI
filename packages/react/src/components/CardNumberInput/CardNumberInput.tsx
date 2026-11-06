import { forwardRef, type ReactNode } from 'react';
import { cardNumberLength, formatCardNumber, isValidCardNumber } from '@bestow-ui/korean-utils';
import { CheckedNumberField, type CheckedNumberProps, type CheckedNumberRules } from '../Input/CheckedNumberField';
import { useMessages } from '../../i18n/LocaleProvider';

export interface CardNumberInputProps extends CheckedNumberProps {
  // ── 아래는 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 숫자만 있는 값 (제어 모드). 예: "1234567890123456" */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 다 채웠을 때(16자리, 아메리칸 익스프레스 15자리) 검사 공식(Luhn) 검증 통과 여부로 호출된다 (그 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /** 다 채웠는데 검사 공식에 맞지 않거나 덜 채운 채 벗어나면 자동으로 오류를 보여 준다 (기본 true). 직접 error·helperText 를 주면 그 값이 우선한다 */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
  /** 입력창 위에 표시할 레이블 — 기본 "카드번호" */
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

/**
 * 카드번호 입력. 4자리씩 하이픈을 넣고(아메리칸 익스프레스는 4-6-5), 다 채우면 검사 공식(Luhn)으로 오타를 거른다.
 * 브라우저·비밀번호 관리자의 카드 자동 완성(cc-number)을 받는다. 실제로 쓸 수 있는 카드인지는 결제사가 확인한다.
 * 화면에 다시 보일 때는 maskCardNumber 로 가린다.
 */
export const CardNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, CardNumberInputProps>(
  function CardNumberInput({ placeholder = '0000-0000-0000-0000', ...props }, ref) {
    const m = useMessages();
    const rules: CheckedNumberRules = {
      sanitize: (input) => {
        const digits = input.replace(/\D/g, '');
        return digits.slice(0, cardNumberLength(digits));
      },
      format: formatCardNumber,
      isComplete: (digits) => digits.length === cardNumberLength(digits),
      isValid: isValidCardNumber,
      defaultLabel: m.cardNumber ?? '카드번호',
      defaultInvalidText: m.cardNumberInvalid ?? '올바른 카드번호가 아니에요. 번호를 다시 확인해 주세요.',
      incompleteText: m.cardNumberIncomplete ?? '카드번호를 끝까지 입력해 주세요.',
      autoComplete: 'cc-number',
    };
    return (
      <CheckedNumberField
        ref={ref}
        rules={rules}
        isControlled={'value' in props}
        placeholder={placeholder}
        {...props}
      />
    );
  },
);
