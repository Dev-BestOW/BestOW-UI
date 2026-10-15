import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronRightIcon } from '@bestow-ui/icons';
import { Link } from '../Link';
import * as styles from './Breadcrumb.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface BreadcrumbItemData {
  /** 표시할 이름 */
  label: ReactNode;
  /** 이동할 주소. 마지막 항목(현재 페이지)은 링크로 만들지 않는다 */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** 상위 → 현재 순서의 경로. 마지막 항목이 현재 페이지(aria-current="page")다 */
  items: BreadcrumbItemData[];
  /**
   * 링크로 렌더링할 컴포넌트 (예: Next.js 의 Link). 기본 `<a>`.
   * 컴포넌트(함수)를 넘기므로 클라이언트 컴포넌트에서만 쓸 수 있다 (서버 컴포넌트에서는 생략하면 일반 `<a>` 로 동작)
   */
  linkAs?: ElementType;
  /** 항목 사이 구분 기호 (장식용 — 스크린리더는 읽지 않는다) */
  separator?: ReactNode;
  /** 탐색 영역의 이름 */
  'aria-label'?: string;
}

/**
 * 현재 페이지까지의 경로를 보여 주는 탐색. `<nav>` > `<ol>` 구조이고 마지막 항목에 `aria-current="page"` 를 붙인다.
 */
export const Breadcrumb = /* @__PURE__ */ forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, linkAs, separator, 'aria-label': ariaLabelProp, className, ...rest },
  ref,
) {
  const m = useMessages();
  const ariaLabel = ariaLabelProp ?? m.breadcrumb ?? '이동 경로';
  const sep = separator ?? <ChevronRightIcon size={14} />;
  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden>
                  {sep}
                </span>
              )}
              {isCurrent || item.href === undefined ? (
                <span className={isCurrent ? styles.current : undefined} aria-current={isCurrent ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link as={linkAs} href={item.href} color="neutral" underline="hover" className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
