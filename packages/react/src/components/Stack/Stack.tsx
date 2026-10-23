import type { space } from '@bestow-ui/tokens';
import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { isResponsiveObject, responsiveVars, spaceVar, type Responsive } from '../../utils/responsive';
import * as styles from './Stack.css';

type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type SpaceKey = keyof typeof space;

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 요소 */
  as?: ElementType;
  /** 배치 방향 (기본 column). 구간별로: `{ base: 'column', md: 'row' }` */
  direction?: Responsive<Direction>;
  /** 자식 사이 간격 (space 토큰 키). 구간별로: `{ base: 3, lg: 6 }` */
  gap?: Responsive<SpaceKey>;
  /** 교차축 정렬 (align-items). 구간별 값도 받는다 */
  align?: Responsive<Align>;
  /** 주축 정렬 (justify-content). 구간별 값도 받는다 */
  justify?: Responsive<Justify>;
  /** 줄바꿈 허용 */
  wrap?: boolean;
}

const flexValues: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};
const flexValue = (value: string) => flexValues[value] ?? value;

// 구간별 값을 받는 속성: [prop, CSS 변수 이름, 값 → CSS, 반응형 클래스]
const responsiveProps = [
  ['direction', 'stack-direction', String, styles.responsiveDirection],
  ['gap', 'gap', spaceVar, styles.responsiveGap],
  ['align', 'stack-align', flexValue, styles.responsiveAlign],
  ['justify', 'stack-justify', flexValue, styles.responsiveJustify],
] as const;

export const Stack = /* @__PURE__ */ forwardRef<HTMLElement, StackProps>(function Stack(
  { as: Component = 'div', direction, gap, align, justify, wrap, className, style, ...rest },
  ref,
) {
  // 한 값이면 지금처럼 recipe 클래스, 구간별 값이면 반응형 클래스 + 인라인 CSS 변수(그 속성은 recipe 에 넘기지 않음)
  const props: Record<string, unknown> = { direction: direction ?? 'column', gap, align, justify };
  const variants: Record<string, unknown> = { wrap };
  const classes: string[] = [];
  const cssVars: Record<string, string> = {};
  for (const [key, name, toCss, responsiveClass] of responsiveProps) {
    const value = props[key] as Responsive<string>;
    if (!isResponsiveObject(value)) variants[key] = value;
    else {
      // 방향은 base 를 주지 않아도 기본 column 에서 시작한다
      responsiveVars(cssVars, name, key === 'direction' ? { base: 'column', ...value } : value, toCss);
      classes.push(responsiveClass);
    }
  }

  return (
    <Component
      ref={ref}
      className={cx(styles.stack(variants), ...classes, className)}
      style={classes.length ? ({ ...cssVars, ...style } as CSSProperties) : style}
      {...rest}
    />
  );
});
