import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './SkipLink.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 건너뛸 곳(본문)의 id 를 가리키는 주소. 기본 "#main" — 본문 요소에 id="main" 을 준다 */
  href?: string;
}

/**
 * 본문 바로가기 (KWCAG 2.2 6.4.1 반복 영역 건너뛰기 / WCAG 2.4.1).
 * 페이지 맨 앞(머리글·메뉴보다 먼저)에 둔다. 평소에는 보이지 않고, 첫 Tab 에 왼쪽 위에 나타난다.
 * 누르면 본문으로 포커스를 옮긴다 — 본문 요소가 원래 포커스를 받지 못하면 tabindex="-1" 을 붙여 옮긴다
 * (주소의 #만 바꾸면 일부 브라우저·SPA 라우터에서 포커스가 그대로 남는다).
 *
 * @example
 * <SkipLink />            // "본문 바로가기" → #main
 * <Header />
 * <main id="main">…</main>
 */
export const SkipLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = '#main', className, children, onClick, ...rest },
  ref,
) {
  const m = useMessages();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href.startsWith('#')) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
    target.scrollIntoView?.({ block: 'start' });
  };

  return (
    <a ref={ref} href={href} className={cx(styles.skipLink, className)} onClick={handleClick} {...rest}>
      {children ?? m.skipToContent ?? '본문 바로가기'}
    </a>
  );
});
