import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Container.css';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 요소 (페이지 본문이면 'main') */
  as?: ElementType;
  /** 최대 폭 — sm 640 · md 768 · lg 1024(기본) · xl 1280px(구간 폭과 같음, 기본 글꼴 크기를 따름), full 은 제한 없음 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 좌우 여백을 없앤다 (기본은 좁은 화면 16px, md 구간부터 24px) */
  flush?: boolean;
}

/** 내용을 가운데에 두고 최대 폭과 좌우 여백을 정하는 페이지 틀 */
export const Container = /* @__PURE__ */ forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Component = 'div', size, flush, className, ...rest },
  ref,
) {
  return <Component ref={ref} className={cx(styles.container({ size, flush }), className)} {...rest} />;
});
