import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { Button } from '../Button';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './VerificationCodeInput.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface VerificationCodeInputProps {
  /** 자릿수 */
  length?: number;
  /** 입력값 (제어 모드) */
  value?: string;
  /** 처음 입력값 (비제어 모드) */
  defaultValue?: string;
  /** 입력값이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 모든 자리를 채웠을 때 호출된다 (자동 제출 등) */
  onComplete?: (value: string) => void;
  /** 받을 문자. numeric 이면 숫자 키패드를 띄우고 숫자만 받는다 */
  type?: 'numeric' | 'alphanumeric';
  /** 레이블 (입력창의 이름) */
  label?: ReactNode;
  /** 아래 도움말. 생략하면 "6자리 숫자를 입력하세요" 처럼 자릿수를 안내한다. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** 유효 시간(초). 주면 남은 시간을 보여 주고, 0 이 되면 onExpire 를 호출하고 만료 안내를 읽어 준다 */
  expiresIn?: number;
  onExpire?: () => void;
  /** 주면 재전송 버튼이 생긴다. 누르면 호출되고 입력값과 남은 시간을 처음으로 되돌린다 */
  onResend?: () => void;
  resendText?: string;
  /** 만료 안내 문구 */
  expiredText?: string;
  /** form 제출 시 사용할 이름 */
  name?: string;
  id?: string;
  className?: string;
}

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * 문자로 받은 인증번호 입력. 실제 입력창은 하나라서 문자 자동 채우기(`autocomplete="one-time-code"`)·붙여넣기가 그대로 되고,
 * 스크린리더는 칸마다가 아니라 "인증번호" 하나로 읽는다. 칸 모양은 화면 표시용이다.
 */
export const VerificationCodeInput = /* @__PURE__ */ forwardRef<HTMLInputElement, VerificationCodeInputProps>(
  function VerificationCodeInput(props, ref) {
    const {
      length = 6,
      value,
      defaultValue,
      onValueChange,
      onComplete,
      type = 'numeric',
      label: labelProp,
      helperText,
      error,
      disabled,
      autoFocus,
      expiresIn,
      onExpire,
      onResend,
      resendText: resendTextProp,
      expiredText: expiredTextProp,
      name,
      id,
      className,
    } = props;
    const m = useMessages();
    const label = labelProp ?? m.verificationCode ?? '인증번호';
    const resendText = resendTextProp ?? m.resend ?? '재전송';
    const expiredText = expiredTextProp ?? m.verificationExpired ?? '인증 시간이 지났어요. 재전송해 주세요.';
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const statusId = `${inputId}-status`;
    const inputRef = useRef<HTMLInputElement>(null);

    // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState(defaultValue ?? '');
    const code = (isControlled ? (value ?? '') : innerValue).slice(0, length);
    const [focused, setFocused] = useState(false);

    // 남은 시간: 끝나는 시각을 기준으로 계산해 탭이 잠시 멈춰도 어긋나지 않게 한다
    const [endAt, setEndAt] = useState(() => (expiresIn ? Date.now() + expiresIn * 1000 : null));
    const [remaining, setRemaining] = useState(expiresIn ?? 0);
    const expired = expiresIn !== undefined && remaining <= 0;
    const onExpireRef = useRef(onExpire);
    useEffect(() => {
      onExpireRef.current = onExpire;
    });

    useEffect(() => {
      if (endAt === null) return;
      const tick = () => {
        const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        setRemaining(left);
        if (left === 0) {
          clearInterval(timer);
          onExpireRef.current?.();
        }
      };
      const timer = setInterval(tick, 250);
      tick();
      return () => clearInterval(timer);
    }, [endAt]);

    const setCode = (next: string) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
      if (next.length === length && code.length !== length) onComplete?.(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      const cleaned = (
        type === 'numeric' ? raw.replace(/\D/g, '') : raw.replace(/[^0-9a-z]/gi, '').toUpperCase()
      ).slice(0, length);
      setCode(cleaned);
    };

    const resend = () => {
      onResend?.();
      setCode('');
      if (expiresIn) {
        setEndAt(Date.now() + expiresIn * 1000);
        setRemaining(expiresIn);
      }
      inputRef.current?.focus();
    };

    const description =
      helperText ??
      m.verificationCodeHint?.(length, type) ??
      `${length}자리 ${type === 'numeric' ? '숫자' : '문자'}를 입력하세요.`;
    const activeIndex = Math.min(code.length, length - 1);

    return (
      <div
        className={cx(fieldStyles.field, className)}
        data-invalid={error || undefined}
        data-disabled={disabled || undefined}
      >
        <label htmlFor={inputId} className={fieldStyles.label}>
          {label}
        </label>
        <div className={styles.row}>
          <div className={styles.slots}>
            <input
              ref={mergeRefs(ref, inputRef)}
              id={inputId}
              type="text"
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              autoComplete="one-time-code"
              pattern={type === 'numeric' ? '[0-9]*' : undefined}
              // maxLength 를 쓰면 "987-654" 같은 붙여넣기가 숫자만 남기기 전에 잘린다 → 걸러낸 뒤 직접 자른다
              value={code}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- 인증번호 화면에서 바로 입력하도록 사용하는 쪽이 고른다
              autoFocus={autoFocus}
              aria-invalid={error || undefined}
              aria-describedby={`${helperId} ${statusId}`}
              className={styles.input}
            />
            {Array.from({ length }, (_, index) => (
              <div
                key={index}
                className={styles.slot}
                data-active={focused && index === activeIndex ? '' : undefined}
                aria-hidden
              >
                {code[index] ?? ''}
              </div>
            ))}
          </div>
          {expiresIn !== undefined && (
            <span role="timer" className={styles.timer}>
              {formatTime(remaining)}
            </span>
          )}
          {onResend && (
            <Button size="sm" variant="outline" color="neutral" onClick={resend} disabled={disabled}>
              {resendText}
            </Button>
          )}
        </div>
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {description}
        </p>
        {/* 만료되는 순간 스크린리더가 읽도록 항상 있는 알림 영역에 문구를 넣는다 */}
        <p id={statusId} role="status" className={fieldStyles.helperText({ error: true })}>
          {expired ? expiredText : ''}
        </p>
        {name && <input type="hidden" name={name} value={code} />}
      </div>
    );
  },
);
