import { forwardRef, useId, useRef, useState, type ReactNode } from 'react';
import { EyeIcon, EyeOffIcon } from '@bestow-ui/icons';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import { useMessages } from '../../i18n/LocaleProvider';
import { TextField, type TextFieldProps } from '../Input';
import * as styles from '../Input/Input.css';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type' | 'endAdornment'> {
  /** 비밀번호를 글자로 보여 준다 (제어 모드) */
  visible?: boolean;
  /** 처음에 보여 줄지 (비제어 모드, 기본 false) */
  defaultVisible?: boolean;
  /** 보기 버튼을 눌러 보이기가 바뀔 때 */
  onVisibleChange?: (visible: boolean) => void;
  /** 보기 버튼 이름 — 기본 "비밀번호 보기". 켜짐/꺼짐은 aria-pressed 로 알린다 */
  toggleLabel?: string;
  /**
   * 브라우저 자동 완성 — 기본 "current-password"(로그인).
   * 회원가입·비밀번호 변경의 새 비밀번호 칸은 "new-password" 로 주면 브라우저가 강한 비밀번호를 제안한다.
   */
  autoComplete?: string;
  // ── 아래는 TextFieldProps 에서 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    Omit 으로 물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 입력창 위에 표시할 레이블 — 기본 "비밀번호" */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말(비밀번호 규칙 등). error 일 때는 에러 메시지로 표시된다 */
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
 * 비밀번호 입력. 입력창 끝의 보기 버튼으로 글자를 보이거나 가린다.
 * 보기 버튼은 Tab 으로 닿고 켜짐/꺼짐을 aria-pressed 로 알린다. 마우스로 눌러도 입력창 포커스와 커서 위치가 그대로다.
 */
export const PasswordInput = /* @__PURE__ */ forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      visible: visibleProp,
      defaultVisible = false,
      onVisibleChange,
      toggleLabel: toggleLabelProp,
      label: labelProp,
      autoComplete = 'current-password',
      id,
      disabled,
      ...rest
    } = props;
    const m = useMessages();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = 'visible' in props;
    const [innerVisible, setInnerVisible] = useState(defaultVisible);
    const visible = isControlled ? Boolean(visibleProp) : innerVisible;

    useFormReset(inputRef, () => {
      if (!isControlled) setInnerVisible(defaultVisible);
    });

    // type 을 바꿔도 브라우저가 커서 위치를 그대로 둔다(Chromium·WebKit 확인, 스토리 CaretStays 가 세 브라우저에서 감시)
    const toggle = () => {
      if (!isControlled) setInnerVisible(!visible);
      onVisibleChange?.(!visible);
    };

    return (
      <TextField
        ref={mergeRefs(ref, inputRef)}
        id={inputId}
        label={labelProp ?? m.password ?? '비밀번호'}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        // 글자로 보일 때 맞춤법 검사·자동 대문자가 비밀번호를 바꾸지 않게
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        disabled={disabled}
        endAdornment={
          <button
            type="button"
            className={styles.inputAction}
            aria-label={toggleLabelProp ?? m.showPassword ?? '비밀번호 보기'}
            aria-pressed={visible}
            aria-controls={inputId}
            disabled={disabled}
            // 마우스로 눌러도 입력창 포커스를 유지한다 (키보드는 Tab 으로 버튼에 와서 Space·Enter)
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggle}
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        }
        {...rest}
      />
    );
  },
);
