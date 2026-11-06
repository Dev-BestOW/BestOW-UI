import { forwardRef, type ReactNode } from 'react';
import { accountNumberDigits, isValidAccountNumber } from '@bestow-ui/korean-utils';
import { CheckedNumberField, type CheckedNumberProps, type CheckedNumberRules } from '../Input/CheckedNumberField';
import { useMessages } from '../../i18n/LocaleProvider';

export interface AccountNumberInputProps extends CheckedNumberProps {
  // ── 아래는 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 숫자만 있는 값 (제어 모드). 예: "110123456789" */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 10자리 이상일 때 자릿수(10~16자리) 검증 통과 여부로 호출된다 (그 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /** 10자리보다 짧은 채 입력창을 벗어나면 자동으로 오류를 보여 준다 (기본 true). 직접 error·helperText 를 주면 그 값이 우선한다 */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
  /** 입력창 위에 표시할 레이블 — 기본 "계좌번호" */
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
 * 계좌번호 입력. 은행·상품마다 자릿수와 하이픈 위치가 달라 서식을 넣지 않고 숫자만 받는다(최대 16자리) —
 * 은행 앱에서 "110-123-456789" 처럼 복사해 붙여 넣어도 숫자만 남는다. 10자리보다 짧게 두고 벗어나면 안내한다.
 * 은행은 KOREAN_BANKS 로 Combobox·Select 를 함께 둔다. 실제 계좌·예금주 확인은 은행·결제사의 예금주 조회가 필요하다.
 */
export const AccountNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, AccountNumberInputProps>(
  function AccountNumberInput({ placeholder = '숫자만 입력', ...props }, ref) {
    const m = useMessages();
    const rules: CheckedNumberRules = {
      sanitize: accountNumberDigits,
      format: (digits) => digits,
      isComplete: (digits) => digits.length >= 10,
      isValid: isValidAccountNumber,
      defaultLabel: m.accountNumber ?? '계좌번호',
      // 10~16자리는 모두 통과라 다 채운 뒤의 오류는 없다 — 덜 채운 채 벗어날 때만
      defaultInvalidText: m.accountNumberIncomplete ?? '계좌번호를 10자리 이상 입력해 주세요.',
      incompleteText: m.accountNumberIncomplete ?? '계좌번호를 10자리 이상 입력해 주세요.',
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
