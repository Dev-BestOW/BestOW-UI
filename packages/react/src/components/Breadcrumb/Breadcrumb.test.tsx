import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { render, screen, within } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

const items = [{ label: '홈', href: '/' }, { label: '설정', href: '/settings' }, { label: '멤버' }];

describe('Breadcrumb', () => {
  it('"이동 경로" 이름의 nav 안에 순서 있는 목록으로 렌더링한다', () => {
    render(<Breadcrumb items={items} />);
    const nav = screen.getByRole('navigation', { name: '이동 경로' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('앞 항목은 링크, 마지막 항목은 링크가 아닌 현재 페이지(aria-current="page")다', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('link', { name: '홈' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: '설정' }).getAttribute('href')).toBe('/settings');
    expect(screen.queryByRole('link', { name: '멤버' })).toBeNull();
    expect(screen.getByText('멤버').getAttribute('aria-current')).toBe('page');
  });

  it('마지막 항목은 href 가 있어도 링크로 만들지 않는다 (현재 페이지로 이동하는 링크 방지)', () => {
    render(
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: '멤버', href: '/members' },
        ]}
      />,
    );
    expect(screen.queryByRole('link', { name: '멤버' })).toBeNull();
    expect(screen.getByText('멤버').getAttribute('aria-current')).toBe('page');
  });

  it('구분 기호는 스크린리더가 읽지 않는다', () => {
    render(<Breadcrumb items={items} separator="/" />);
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
    for (const sep of separators) expect(sep.getAttribute('aria-hidden')).toBe('true');
  });

  it('linkAs 로 라우터 링크를 쓰고, aria-label·ref 를 바꿀 수 있다', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function RouterLink(
      { children, ...props },
      ref,
    ) {
      return (
        <a ref={ref} data-router="true" {...props}>
          {children}
        </a>
      );
    });
    const ref = createRef<HTMLElement>();
    render(<Breadcrumb ref={ref} items={items} linkAs={RouterLink} aria-label="Breadcrumb" />);
    expect(screen.getByRole('link', { name: '홈' }).getAttribute('data-router')).toBe('true');
    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Breadcrumb' }));
  });
});
