import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '../../i18n/en';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { SkipLink } from './SkipLink';

function Page({ mainProps }: { mainProps?: object }) {
  return (
    <>
      <SkipLink />
      <nav aria-label="메뉴">
        <a href="/a">메뉴 1</a>
        <a href="/b">메뉴 2</a>
      </nav>
      <main id="main" {...mainProps}>
        본문
      </main>
    </>
  );
}

describe('SkipLink', () => {
  it('기본으로 "본문 바로가기" 링크이고 #main 을 가리킨다', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: '본문 바로가기' }).getAttribute('href')).toBe('#main');
  });

  it('페이지에서 첫 Tab 에 포커스를 받는다', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    expect(screen.getByRole('link', { name: '본문 바로가기' })).toBe(document.activeElement);
  });

  it('누르면 본문으로 포커스를 옮긴다 — 본문이 포커스를 못 받으면 tabindex="-1" 을 붙인다', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    await user.keyboard('{Enter}');
    const main = screen.getByRole('main');
    expect(document.activeElement).toBe(main);
    expect(main.getAttribute('tabindex')).toBe('-1');
    // 다음 Tab 은 본문 다음 요소로 간다 (메뉴를 건너뛴다)
  });

  it('본문에 이미 tabindex 가 있으면 바꾸지 않는다', async () => {
    const user = userEvent.setup();
    render(<Page mainProps={{ tabIndex: 0 }} />);
    await user.click(screen.getByRole('link', { name: '본문 바로가기' }));
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('대상이 있을 때만 기본 동작(주소 이동)을 막고, 없거나 다른 페이지 주소면 그대로 둔다', async () => {
    const user = userEvent.setup();
    const prevented: Record<string, boolean> = {};
    render(
      // 링크에서 올라온 클릭의 기본 동작이 막혔는지 기록한 뒤, jsdom 의 페이지 이동(미구현)을 막는다
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={(event) => {
          prevented[(event.target as HTMLElement).textContent!] = event.defaultPrevented;
          event.preventDefault();
        }}
      >
        <SkipLink href="#main" />
        <SkipLink href="#nowhere">없는 곳</SkipLink>
        <main id="main">본문</main>
      </div>,
    );
    await user.click(screen.getByRole('link', { name: '본문 바로가기' }));
    await user.click(screen.getByRole('link', { name: '없는 곳' }));
    expect(prevented).toEqual({ '본문 바로가기': true, '없는 곳': false });
  });

  it('children·LocaleProvider 로 문구를 바꾸고, ref·className 을 전달한다', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <LocaleProvider messages={en}>
        <SkipLink ref={ref} className="custom" />
        <SkipLink href="#search">검색으로 건너뛰기</SkipLink>
      </LocaleProvider>,
    );
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBe(ref.current);
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(screen.getByRole('link', { name: '검색으로 건너뛰기' }).getAttribute('href')).toBe('#search');
  });
});
