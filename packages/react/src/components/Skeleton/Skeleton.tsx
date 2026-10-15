import { assignInlineVars } from '@vanilla-extract/dynamic';
import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Skeleton.css';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** 모양. text 는 글자 높이(1em), circle 은 width 를 지름으로 쓴다 */
  variant?: 'text' | 'rect' | 'circle';
  /** 너비. 숫자는 px (기본: text·rect 100%, circle 40px) */
  width?: number | string;
  /** 높이. 숫자는 px (기본: text 1em, rect 100px, circle 은 width 와 같음) */
  height?: number | string;
  /** text 에서 여러 줄을 그린다. 마지막 줄은 60% 너비 */
  lines?: number;
}

const toCss = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

/**
 * 콘텐츠를 불러오는 동안 자리를 표시한다. 장식용이라 스크린리더에서 숨긴다 —
 * 로딩 중인 영역(감싸는 요소)에 `aria-busy="true"` 를 붙여 상태를 알린다.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines = 1, className, style, ...rest },
  ref,
) {
  const w = toCss(width ?? (variant === 'circle' ? 40 : '100%'));
  const h = toCss(height ?? (variant === 'circle' ? w : variant === 'rect' ? 100 : '1em'));

  if (variant === 'text' && lines > 1) {
    return (
      <span
        ref={ref}
        aria-hidden
        className={cx(styles.lines, className)}
        style={{ ...assignInlineVars({ [styles.width]: w }), ...style }}
        {...rest}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={styles.skeleton({ variant })}
            style={assignInlineVars({ [styles.width]: i === lines - 1 ? '60%' : '100%', [styles.height]: h })}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      aria-hidden
      className={cx(styles.skeleton({ variant }), className)}
      style={{ ...assignInlineVars({ [styles.width]: w, [styles.height]: h }), ...style }}
      {...rest}
    />
  );
});
