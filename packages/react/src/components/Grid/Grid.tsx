import type { space } from '@bestow-ui/tokens';
import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { responsiveVars, spaceVar, type Responsive } from '../../utils/responsive';
import * as styles from './Grid.css';

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 요소 (목록이면 'ul') */
  as?: ElementType;
  /** 열 개수 (같은 폭). 구간별로: `{ base: 1, md: 2, lg: 3 }`. 생략하면 한 열 */
  columns?: Responsive<number>;
  /**
   * 칸의 최소 폭(CSS 길이, 예: '220px'·'14rem'). 주면 화면 폭에 맞춰 열 개수를 자동으로 정한다(columns 대신).
   * 화면이 이 폭보다 좁으면 칸이 화면 폭으로 줄어든다(가로 스크롤 없음).
   */
  minItemWidth?: string;
  /** 칸 사이 간격 (space 토큰 키). 구간별 값도 받는다 */
  gap?: Responsive<keyof typeof space>;
}

const repeatColumns = (count: number) => `repeat(${count}, minmax(0, 1fr))`;

export const Grid = /* @__PURE__ */ forwardRef<HTMLElement, GridProps>(function Grid(
  { as: Component = 'div', columns, minItemWidth, gap, className, style, ...rest },
  ref,
) {
  const responsive: Record<string, string> = {};
  if (minItemWidth)
    responsive['--bestow-grid-columns-base'] = `repeat(auto-fill, minmax(min(100%, ${minItemWidth}), 1fr))`;
  else responsiveVars(responsive, 'grid-columns', columns, repeatColumns);
  responsiveVars(responsive, 'gap', gap, spaceVar);

  return (
    <Component
      ref={ref}
      className={cx(styles.grid, styles.columns, gap !== undefined && styles.responsiveGap, className)}
      style={{ ...responsive, ...style } as CSSProperties}
      {...rest}
    />
  );
});
