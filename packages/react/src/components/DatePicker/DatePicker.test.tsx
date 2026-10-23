import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

const TODAY = '2026-10-15';
const input = () => screen.getByRole('textbox', { name: '날짜' }) as HTMLInputElement;

describe('DatePicker', () => {
  it('숫자만 쳐도 하이픈이 들어가고, 올바른 날짜를 다 입력하면 YYYY-MM-DD 로 알린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker today={TODAY} onValueChange={onValueChange} />);
    await user.type(input(), '2026101');
    expect(input().value).toBe('2026-10-1');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.type(input(), '5');
    expect(input().value).toBe('2026-10-15');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-10-15');
  });

  it('없는 날짜·범위 밖 날짜는 오류로 알리고 값은 비운다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker today={TODAY} max="2026-12-31" defaultValue="2026-10-15" onValueChange={onValueChange} />);
    await user.clear(input());
    expect(onValueChange).toHaveBeenLastCalledWith('');
    await user.type(input(), '20260230');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('올바른 날짜가 아니에요.')).toBeTruthy();

    await user.clear(input());
    await user.type(input(), '20270101');
    expect(screen.getByText('고를 수 없는 날짜예요.')).toBeTruthy();
    expect(onValueChange).not.toHaveBeenCalledWith('2027-01-01');
  });

  it('8자리를 채운 순간의 오류는 입력이 멈춘 뒤 status 로 알린다', async () => {
    const user = userEvent.setup();
    render(<DatePicker today={TODAY} max="2026-12-31" />);
    const status = screen.getByRole('status');
    await user.type(input(), '20260230');
    expect(status.textContent).toBe('');
    await waitFor(() => expect(status.textContent).toBe('올바른 날짜가 아니에요.'));
    await user.clear(input());
    expect(status.textContent).toBe('');
    await user.type(input(), '20270101');
    await waitFor(() => expect(status.textContent).toBe('고를 수 없는 날짜예요.'));
  });

  it('달력 버튼으로 열면 선택된 날짜로 포커스가 가고, 고르면 입력창에 넣고 닫혀 버튼으로 포커스가 돌아온다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker today={TODAY} defaultValue="2026-10-15" onValueChange={onValueChange} />);
    const button = screen.getByRole('button', { name: '달력 열기' });
    await user.click(button);
    expect(screen.getByRole('dialog', { name: '달력' })).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('button', { name: '15, 2026년 10월 목요일, 오늘' })),
    );
    await user.keyboard('{ArrowRight}{Enter}');
    expect(input().value).toBe('2026-10-16');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-10-16');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(button));
  });

  it('제어 모드: 바깥 값을 따르고, 입력 도중에는 치던 글자를 지우지 않는다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [date, setDate] = useState('');
      return (
        <>
          <DatePicker today={TODAY} value={date} onValueChange={setDate} name="date" />
          <button type="button" onClick={() => setDate('2026-12-25')}>
            성탄절로
          </button>
        </>
      );
    }
    const { container } = render(<Controlled />);
    await user.type(input(), '2026');
    expect(input().value).toBe('2026');
    await user.click(screen.getByRole('button', { name: '성탄절로' }));
    expect(input().value).toBe('2026-12-25');
    expect(container.querySelector<HTMLInputElement>('input[type=hidden][name=date]')?.value).toBe('2026-12-25');
  });

  it('제어 모드: 올바른 날짜를 고쳐 없는 날짜가 되면 글자를 지우지 않고 오류를 보여 준다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [date, setDate] = useState('');
      return <DatePicker today={TODAY} value={date} onValueChange={setDate} />;
    }
    render(<Controlled />);
    await user.type(input(), '20260228');
    expect(input().value).toBe('2026-02-28');
    // 마지막 글자를 선택해 바로 덮어쓴다 — 올바른 날짜에서 없는 날짜(2026년은 윤년이 아니다)로 한 번에 바뀐다
    input().setSelectionRange(9, 10);
    await user.keyboard('9');
    expect(input().value).toBe('2026-02-29');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('올바른 날짜가 아니에요.')).toBeTruthy();
  });
});
