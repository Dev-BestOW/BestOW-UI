import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** 렌더링할 요소 (기본 span) */
  as?: ElementType;
}

/**
 * 화면에는 보이지 않고 스크린리더만 읽는 글자. 아이콘만 있는 열 머리글("작업"), 보이는 글자에 붙는 보충 설명 등에 쓴다.
 * `display: none`·`hidden` 과 달리 보조기술이 읽는다. hook 이 없어 서버 컴포넌트로도 렌더링된다.
 */
export const VisuallyHidden = /* @__PURE__ */ forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden(
  { as: Component = 'span', className, ...rest },
  ref,
) {
  return <Component ref={ref} className={cx(visuallyHidden, className)} {...rest} />;
});
