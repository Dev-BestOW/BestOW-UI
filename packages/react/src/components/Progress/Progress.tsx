import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Progress.css';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** 현재 값 (0 ~ max). 생략하거나 null 이면 진행률을 모르는 상태(indeterminate)로 움직이는 막대를 보여 준다 */
  value?: number | null;
  /** 최댓값 */
  max?: number;
  /** 막대 위에 보이는 레이블. progressbar 의 이름이 된다 */
  label?: ReactNode;
  /** 레이블이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 오른쪽에 값 텍스트(기본 "42%")를 보여 준다 */
  showValue?: boolean;
  /** 값 텍스트 형식. 화면 표시와 스크린리더(aria-valuetext)에 함께 쓴다 (예: (v, max) => `${v}/${max}개`) */
  formatValue?: (value: number, max: number) => string;
  /** 막대 두께 (sm 4px · md 8px · lg 12px) */
  size?: 'sm' | 'md' | 'lg';
  /** 의미 색상 */
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
}

const defaultFormat = (value: number, max: number) => `${Math.round((value / max) * 100)}%`;

export const Progress = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    label,
    'aria-label': ariaLabel,
    showValue,
    formatValue = defaultFormat,
    size,
    color,
    className,
    ...rest
  },
  ref,
) {
  const labelId = useId();
  const isIndeterminate = value === undefined || value === null;
  const safeMax = max > 0 ? max : 100;
  const clamped = isIndeterminate ? 0 : Math.min(safeMax, Math.max(0, value));
  const valueText = isIndeterminate ? undefined : formatValue(clamped, safeMax);

  return (
    <div ref={ref} className={cx(styles.root, className)} {...rest}>
      {(label || (showValue && valueText)) && (
        <div className={styles.header}>
          {label && (
            <span id={labelId} className={styles.label}>
              {label}
            </span>
          )}
          {/* 스크린리더는 progressbar 의 aria-valuetext 로 읽으므로 화면용 텍스트는 숨긴다 */}
          {showValue && valueText && (
            <span className={styles.value} aria-hidden>
              {valueText}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={isIndeterminate ? undefined : clamped}
        aria-valuetext={valueText}
        className={styles.track({ size })}
      >
        <div
          className={styles.indicator({ color })}
          data-state={isIndeterminate ? 'indeterminate' : clamped >= safeMax ? 'complete' : 'loading'}
          style={isIndeterminate ? undefined : { width: `${(clamped / safeMax) * 100}%` }}
        />
      </div>
    </div>
  );
});
