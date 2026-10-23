import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as fieldStyles from '../Input/Input.css';

/**
 * FormField 가 자식에게 넘기는 연결 속성. 입력 요소(또는 입력 역할을 하는 요소)에 그대로 펼쳐 넣는다.
 * role="group" 처럼 aria-invalid·aria-required 를 받지 못하는 역할이면 그 둘은 빼고 안의 컨트롤에 준다(axe aria-allowed-attr).
 */
export interface FormFieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

/** render 함수의 둘째 인자 — 입력에 펼치지 않는 정보 */
export interface FormFieldMeta {
  /** 레이블 요소의 id — label 로 이름을 받을 수 없는 요소(div role="combobox" 등)는 aria-labelledby 에 넣는다 */
  labelId?: string;
  /** 도움말 요소의 id */
  helperId?: string;
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> {
  /** 입력 위에 표시할 레이블 (짧게 — 보조 설명은 helperText) */
  label?: ReactNode;
  /** 입력 아래 도움말. error 일 때는 오류 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 오류 상태 — 자식에 aria-invalid 를 넘기고 helperText 를 오류 색으로 */
  error?: boolean;
  /** 필수 — 레이블에 * 를 붙이고 자식에 aria-required 를 넘긴다(네이티브 검증이 필요하면 입력에 required 를 직접) */
  required?: boolean;
  /** 입력 요소의 id. 생략하면 만든다 (ErrorSummary 링크·focusField 가 이 id 로 찾아간다) */
  id?: string;
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /**
   * 입력을 그리는 함수. 첫째 인자를 입력 요소에 그대로 펼쳐 넣는다.
   * @example {(field) => <input {...field} />}
   * @example {(field, { labelId }) => <CustomSelect {...field} aria-labelledby={labelId} />}
   */
  children: (control: FormFieldControlProps, meta: FormFieldMeta) => ReactNode;
}

/**
 * 직접 만든 입력·다른 라이브러리 입력에 TextField 와 같은 레이블·도움말·오류 연결을 붙인다.
 * hook 은 useId 뿐이라 서버 컴포넌트에서도 쓸 수 있다.
 */
export const FormField = /* @__PURE__ */ forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, helperText, error, required, id, fullWidth, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = label ? `${controlId}-label` : undefined;
  const helperId = helperText ? `${controlId}-helper` : undefined;

  return (
    <div ref={ref} className={cx(fieldStyles.field, fullWidth && fieldStyles.fieldFullWidth, className)} {...rest}>
      {label && (
        <label id={labelId} htmlFor={controlId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children(
        {
          id: controlId,
          'aria-describedby': helperId,
          'aria-invalid': error || undefined,
          'aria-required': required || undefined,
        },
        { labelId, helperId },
      )}
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
