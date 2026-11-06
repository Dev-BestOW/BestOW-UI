import { forwardRef, type ReactNode } from 'react';
import { formatCorporateNumber, isValidCorporateNumber } from '@bestow-ui/korean-utils';
import { CheckedNumberField, type CheckedNumberProps, type CheckedNumberRules } from '../Input/CheckedNumberField';
import { useMessages } from '../../i18n/LocaleProvider';

export interface CorporateNumberInputProps extends CheckedNumberProps {
  // ── 아래는 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 숫자만 있는 값 (제어 모드). 예: "1301110006246" */
  value?: string;
  /** 처음 값 (비제어 모드) */
  defaultValue?: string;
  /** 숫자만 있는 값과, 13자리를 다 채웠을 때 검증 공식 검증 통과 여부로 호출된다 (그 전에는 valid 가 null) */
  onValueChange?: (digits: string, valid: boolean | null) => void;
  /** 13자리를 채웠는데 검증 공식에 맞지 않거나 덜 채운 채 벗어나면 자동으로 오류를 보여 준다 (기본 true). 직접 error·helperText 를 주면 그 값이 우선한다 */
  validate?: boolean;
  /** 자동 검증 오류 문구 */
  invalidText?: string;
  /** 입력창 위에 표시할 레이블 — 기본 "법인등록번호" */
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
 * 법인등록번호 입력. 000000-0000000 형식으로 하이픈을 넣고, 13자리를 채우면 검증 공식으로 오타를 거른다.
 * (실제로 등기된 법인인지는 등기소 조회가 필요하다. 사업자등록번호는 BusinessNumberInput)
 */
export const CorporateNumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, CorporateNumberInputProps>(
  function CorporateNumberInput({ placeholder = '000000-0000000', ...props }, ref) {
    const m = useMessages();
    const rules: CheckedNumberRules = {
      sanitize: (input) => input.replace(/\D/g, '').slice(0, 13),
      format: formatCorporateNumber,
      isComplete: (digits) => digits.length === 13,
      isValid: isValidCorporateNumber,
      defaultLabel: m.corporateNumber ?? '법인등록번호',
      defaultInvalidText: m.corporateNumberInvalid ?? '올바른 법인등록번호가 아니에요. 번호를 다시 확인해 주세요.',
      incompleteText: m.corporateNumberIncomplete ?? '13자리를 모두 입력해 주세요.',
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
