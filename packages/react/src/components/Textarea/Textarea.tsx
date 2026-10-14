import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './Textarea.css';

// 서버 렌더링에서는 useLayoutEffect 대신 useEffect 를 쓴다.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** 입력창 위에 표시할 레이블 */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 크기 (안쪽 여백과 글자 크기) */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /** 사용자가 크기를 조절할 수 있는 방향. autoResize 이면 무시된다 */
  resize?: 'none' | 'vertical' | 'both';
  /** 내용에 맞춰 높이가 자동으로 늘어난다. 최대 높이는 style 의 maxHeight 로 제한한다 */
  autoResize?: boolean;
  /** 글자 수를 표시한다. maxLength 가 있으면 "12/200" 형태 */
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helperText,
    error,
    size,
    fullWidth,
    resize,
    autoResize,
    showCount,
    required,
    id,
    rows = 3,
    value,
    defaultValue,
    onChange,
    maxLength,
    className,
    style,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const innerRef = useRef<HTMLTextAreaElement>(null);

  const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : uncontrolledLength;

  const fitHeight = useCallback(() => {
    const el = innerRef.current;
    if (!autoResize || !el) return;
    el.style.height = 'auto';
    const borders = el.offsetHeight - el.clientHeight;
    el.style.height = `${el.scrollHeight + borders}px`;
  }, [autoResize]);

  useIsomorphicLayoutEffect(fitHeight, [fitHeight, value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setUncontrolledLength(event.target.value.length);
    fitHeight();
    onChange?.(event);
  };

  return (
    <div className={cx(fieldStyles.field, fullWidth && fieldStyles.fieldFullWidth)}>
      {label && (
        <label htmlFor={textareaId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={mergeRefs(innerRef, ref)}
        id={textareaId}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        required={required}
        aria-invalid={error || undefined}
        aria-describedby={cx(helperId, ariaDescribedBy) || undefined}
        className={cx(
          styles.textarea({ size, resize: autoResize ? 'none' : resize }),
          !fullWidth && styles.defaultWidth,
          className,
        )}
        style={autoResize ? { overflowY: 'auto', ...style } : style}
        {...rest}
      />
      {(helperText || showCount) && (
        <div className={styles.footer}>
          {helperText && (
            <p id={helperId} className={fieldStyles.helperText({ error })}>
              {helperText}
            </p>
          )}
          {showCount && (
            <span className={cx(styles.count, maxLength !== undefined && length >= maxLength && styles.countOver)}>
              {maxLength !== undefined ? `${length}/${maxLength}` : length}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
