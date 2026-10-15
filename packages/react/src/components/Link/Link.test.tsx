import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('href 를 가진 링크로 렌더링한다', () => {
    render(<Link href="/terms">이용약관</Link>);
    const link = screen.getByRole('link', { name: '이용약관' });
    expect(link.getAttribute('href')).toBe('/terms');
    expect(link.hasAttribute('target')).toBe(false);
  });

  it('external 이면 새 창으로 열고 rel 을 붙이며, 스크린리더에 "(새 창)" 을 알린다', () => {
    const { container } = render(
      <Link href="https://example.com" external>
        예시
      </Link>,
    );
    const link = screen.getByRole('link', { name: '예시 (새 창)' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('external 이어도 직접 준 target·rel·안내 문구가 우선한다', () => {
    render(
      <Link href="https://example.com" external target="docs" rel="noopener" externalLabel="(opens in new tab)">
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs (opens in new tab)' });
    expect(link.getAttribute('target')).toBe('docs');
    expect(link.getAttribute('rel')).toBe('noopener');
  });

  it('as 로 라우터 링크 컴포넌트를 쓸 수 있고 ref·className 을 넘긴다', () => {
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
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link as={RouterLink} ref={ref} href="/home" className="custom">
        홈
      </Link>,
    );
    const link = screen.getByRole('link', { name: '홈' });
    expect(link.getAttribute('data-router')).toBe('true');
    expect(ref.current).toBe(link);
    expect(link.classList.contains('custom')).toBe(true);
  });

  it('asChild 면 자식 요소에 링크 스타일·속성을 입혀 그대로 렌더링한다 (서버 컴포넌트용)', () => {
    render(
      <Link asChild color="neutral" className="custom">
        <a href="/home" data-router="true">
          홈
        </a>
      </Link>,
    );
    const link = screen.getByRole('link', { name: '홈' });
    expect(link.getAttribute('data-router')).toBe('true');
    expect(link.getAttribute('href')).toBe('/home');
    expect(link.classList.contains('custom')).toBe(true);
    expect(link.className.split(' ').length).toBeGreaterThan(1); // 링크 recipe 클래스도 붙는다
  });
});
