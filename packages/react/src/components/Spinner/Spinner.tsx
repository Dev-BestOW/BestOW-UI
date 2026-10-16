import { LoaderIcon } from '@bestow-ui/icons';
import { forwardRef, type HTMLAttributes } from 'react';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import * as styles from './Spinner.css';
import { useMessages } from '../../i18n/LocaleProvider';
import { warnOnce } from '../../utils/warnOnce';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 크기 (sm 16px, md 20px, lg 28px) */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 색상. `inherit`(기본)는 부모 글자색을 그대로 쓴다.
   * `current` 는 0.x 의 옛 이름으로 `inherit` 와 같다 — **deprecated, 1.0 에서 제거**.
   */
  color?: 'inherit' | 'primary' | 'neutral' | 'danger' | 'current';
  /**
   * 스크린리더가 읽을 텍스트 (기본 "로딩 중").
   * 빈 문자열이면 장식용으로 보고 `aria-hidden` 처리한다 — 버튼처럼 바깥 요소가 이미 상태를 알릴 때 쓴다.
   */
  label?: string;
}

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, color, label: labelProp, className, ...rest },
  ref,
) {
  const m = useMessages();
  if (color === 'current') {
    warnOnce('Spinner 의 color="current" 는 deprecated 예요. color="inherit" 를 쓰세요 (1.0 에서 제거).');
    color = 'inherit';
  }
  const label = labelProp ?? m.loading ?? '로딩 중';
  const a11y = label ? { role: 'status' } : { 'aria-hidden': true };
  return (
    <span ref={ref} className={cx(styles.spinner({ size, color }), className)} {...a11y} {...rest}>
      <LoaderIcon size="100%" />
      {label && <span className={visuallyHidden}>{label}</span>}
    </span>
  );
});
