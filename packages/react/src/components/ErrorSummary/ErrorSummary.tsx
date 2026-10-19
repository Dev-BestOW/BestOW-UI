import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils/cx';
import { focusField } from '../../utils/focusField';
import { mergeRefs } from '../../utils/mergeRefs';
import { Alert } from '../Alert';
import * as styles from './ErrorSummary.css';

export interface ErrorSummaryItem {
  /** 오류가 난 칸의 id — 링크를 누르면 그 칸으로 포커스가 간다(묶음이면 선택된·첫 항목) */
  id: string;
  /** 고칠 내용 (칸 아래 helperText 와 같은 문구를 권장) */
  message: ReactNode;
}

export interface ErrorSummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 고칠 곳 목록. 비어 있으면 아무것도 그리지 않는다 */
  errors: ErrorSummaryItem[];
  /** 제목 (기본 "입력한 내용에 고칠 곳이 N개 있어요") */
  title?: ReactNode;
  /**
   * 이 값이 바뀔 때마다(오류가 있으면) 요약으로 포커스를 옮긴다. 기본은 처음 나타날 때 한 번.
   * 다시 제출해도 오류가 남아 있으면 옮기도록 제출 횟수를 넘긴다 (react-hook-form: `formState.submitCount`).
   */
  focusKey?: unknown;
}

/**
 * 폼 제출에 실패했을 때 고칠 곳을 모아 보여 주는 요약(GOV.UK error summary 패턴). 나타나면 포커스가 와서 스크린리더가 제목·목록을
 * 읽고, 각 링크로 해당 칸에 바로 간다. 칸마다 `error`·`helperText` 도 함께 표시한다.
 * react-hook-form 과 쓸 때는 `shouldFocusError: false` 로 두고 이 요약이 포커스를 받게 한다.
 */
export const ErrorSummary = /* @__PURE__ */ forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary(
  { errors, title, focusKey, className, ...rest },
  ref,
) {
  const m = useMessages();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const hasErrors = errors.length > 0;

  useEffect(() => {
    // 나타날 때와 focusKey 가 바뀔 때만 옮긴다
    if (hasErrors) rootRef.current?.focus();
  }, [focusKey, hasErrors]);

  if (!hasErrors) return null;
  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cx(styles.root, className)}
      {...rest}
    >
      <Alert
        color="danger"
        title={
          <span id={titleId}>
            {title ?? m.errorSummaryTitle?.(errors.length) ?? `입력한 내용에 고칠 곳이 ${errors.length}개 있어요`}
          </span>
        }
      >
        <ul className={styles.list}>
          {errors.map((error) => (
            <li key={error.id}>
              <a
                href={`#${error.id}`}
                className={styles.link}
                onClick={(event) => {
                  // 해시 이동 대신 포커스를 옮긴다 — 묶음·숨긴 input 이어도 조작할 수 있는 곳으로 간다
                  if (focusField(error.id)) event.preventDefault();
                }}
              >
                {error.message}
              </a>
            </li>
          ))}
        </ul>
      </Alert>
    </div>
  );
});
