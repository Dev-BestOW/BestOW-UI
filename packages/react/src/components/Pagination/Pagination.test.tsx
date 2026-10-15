import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

const nav = () => screen.getByRole('navigation', { name: '페이지 탐색' });
const current = () => screen.getAllByRole('button').find((el) => el.getAttribute('aria-current') === 'page');
/** 화면에 보이는 순서대로 페이지 버튼 텍스트 + 생략 부호 */
const visibleItems = () => Array.from(nav().querySelectorAll('li')).map((li) => li.textContent).slice(1, -1);

describe('Pagination', () => {
  it('nav(기본 이름 "페이지 탐색") 안의 목록으로 렌더링하고 현재 페이지에 aria-current="page" 를 붙인다', () => {
    render(<Pagination totalPages={10} defaultPage={5} />);
    expect(within(nav()).getByRole('list')).toBeTruthy();
    expect(current()?.getAttribute('aria-label')).toBe('5 페이지');
    expect(screen.getAllByRole('button').filter((el) => el.hasAttribute('aria-current'))).toHaveLength(1);
  });

  it('생략 부호를 보여 주되 스크린리더에서는 숨긴다', () => {
    render(<Pagination totalPages={10} defaultPage={5} />);
    expect(visibleItems()).toEqual(['1', '…', '4', '5', '6', '…', '10']);
    const hidden = Array.from(nav().querySelectorAll('li[aria-hidden="true"]'));
    expect(hidden.map((li) => li.textContent)).toEqual(['…', '…']);
    // 버튼 외에 스크린리더에 노출되는 항목이 없다
    expect(within(nav()).getAllByRole('listitem')).toHaveLength(7);
  });

  it('첫 페이지에서는 이전 버튼이, 마지막 페이지에서는 다음 버튼이 비활성화된다', () => {
    const { rerender } = render(<Pagination totalPages={3} page={1} />);
    expect(screen.getByRole('button', { name: '이전 페이지' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: '다음 페이지' }).hasAttribute('disabled')).toBe(false);

    rerender(<Pagination totalPages={3} page={3} />);
    expect(screen.getByRole('button', { name: '이전 페이지' }).hasAttribute('disabled')).toBe(false);
    expect(screen.getByRole('button', { name: '다음 페이지' }).hasAttribute('disabled')).toBe(true);
  });

  it('비제어 모드: 페이지·이전·다음 버튼으로 이동하고 onPageChange 를 호출한다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '3 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(current()?.textContent).toBe('3');

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    expect(current()?.textContent).toBe('4');

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByRole('button', { name: '10 페이지' }));
    expect(visibleItems()).toEqual(['1', '…', '6', '7', '8', '9', '10']);
  });

  it('현재 페이지를 다시 누르면 onPageChange 를 호출하지 않는다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={5} defaultPage={2} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('제어 모드: page 를 바꾸지 않으면 표시도 바뀌지 않고, 바꾸면 따라간다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination totalPages={5} page={2} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '4 페이지' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(current()?.textContent).toBe('2');

    rerender(<Pagination totalPages={5} page={4} onPageChange={onPageChange} />);
    expect(current()?.textContent).toBe('4');
  });

  it('제어 모드를 상태와 연결하면 정상 동작한다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(1);
      return <Pagination totalPages={20} page={page} onPageChange={setPage} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: '5 페이지' }));
    expect(current()?.textContent).toBe('5');
    expect(visibleItems()).toEqual(['1', '…', '4', '5', '6', '…', '20']);
  });

  it('범위를 벗어난 page 는 1 ~ totalPages 로 맞춘다', () => {
    const { rerender } = render(<Pagination totalPages={5} page={99} />);
    expect(current()?.textContent).toBe('5');
    rerender(<Pagination totalPages={5} page={-3} />);
    expect(current()?.textContent).toBe('1');
  });

  it('totalPages 가 1 미만이면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<Pagination totalPages={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('키보드: Tab 으로 버튼 사이를 이동하고 Enter 로 페이지를 바꾼다 (비활성 버튼은 건너뛴다)', async () => {
    const user = userEvent.setup();
    render(<Pagination totalPages={3} />);
    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe('1 페이지'); // 이전 버튼은 disabled
    await user.tab();
    await user.keyboard('{Enter}');
    expect(current()?.textContent).toBe('2');
  });

  it('aria-label 과 getItemLabel 로 이름을 바꿀 수 있다 (다국어)', () => {
    render(
      <Pagination
        totalPages={3}
        aria-label="Pagination"
        getItemLabel={(type, page) => (type === 'page' ? `Page ${page}` : type === 'next' ? 'Next' : 'Previous')}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
  });

  it('ref 와 className 을 nav 에 전달한다', () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} className="custom" totalPages={3} />);
    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });
});
