import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type AnchorHTMLAttributes, type ElementType, type HTMLAttributes } from 'react';
import { ExternalLinkIcon } from '@bestow-ui/icons';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import * as styles from './Link.css';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /**
   * 렌더링할 요소. Next.js 등의 라우터 링크를 넘기면 그 컴포넌트로 렌더링한다 (예: `as={NextLink}`).
   * 컴포넌트(함수)를 넘기므로 서버 컴포넌트에서는 쓸 수 없다 → 그때는 asChild 를 쓴다
   */
  as?: ElementType;
  /**
   * 자식 요소(라우터 링크 등)에 스타일과 속성을 입혀 그대로 렌더링한다. 서버 컴포넌트에서도 쓸 수 있다.
   * external 아이콘·안내는 붙지 않는다.
   * @example <Link asChild><NextLink href="/">홈</NextLink></Link>
   */
  asChild?: boolean;
  /** 글자색. inherit 은 부모 글자색을 그대로 쓴다 */
  color?: 'primary' | 'neutral' | 'inherit';
  /** 밑줄. 문장 안의 링크는 색만으로 구분되지 않도록 always(기본)를 쓴다. 메뉴·목록처럼 링크임이 분명할 때 hover */
  underline?: 'always' | 'hover';
  /**
   * 새 창으로 여는 외부 링크. `target="_blank"`·`rel="noopener noreferrer"` 를 붙이고,
   * 아이콘과 스크린리더용 "(새 창)" 안내를 덧붙인다
   */
  external?: boolean;
  /** external 일 때 스크린리더에 덧붙이는 안내 */
  externalLabel?: string;
}

export const Link = /* @__PURE__ */ forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    as: Component = 'a',
    asChild,
    color,
    underline,
    external,
    externalLabel = '(새 창)',
    target,
    rel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const linkClassName = cx(styles.link({ color, underline }), className);
  if (asChild) {
    return (
      // Slot 의 props 타입은 HTMLElement 기준이라 <a> 전용 속성(target·rel 등)은 그대로 넘기도록 단언한다
      <Slot ref={ref} className={linkClassName} {...({ target, rel, ...rest } as HTMLAttributes<HTMLElement>)}>
        {children}
      </Slot>
    );
  }
  return (
    <Component
      ref={ref}
      className={linkClassName}
      target={external ? (target ?? '_blank') : target}
      rel={external ? (rel ?? 'noopener noreferrer') : rel}
      {...rest}
    >
      {children}
      {external && (
        <>
          {/* 이 공백이 없으면 이름이 "예시(새 창)" 처럼 붙어서 읽힌다. inline-flex 안이라 화면에는 그려지지 않는다 */}{' '}
          <ExternalLinkIcon className={styles.externalIcon} />
          <span className={visuallyHidden}>{externalLabel}</span>
        </>
      )}
    </Component>
  );
});
