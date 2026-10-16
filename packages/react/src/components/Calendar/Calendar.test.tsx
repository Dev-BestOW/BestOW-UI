import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

const TODAY = '2026-10-15';
const day = (name: string | RegExp) => screen.getByRole('button', { name });

describe('Calendar', () => {
  it('달 제목이 grid 이름이 되고, 날짜는 한국어 전체 이름으로 읽히며 오늘은 aria-current', () => {
    render(<Calendar today={TODAY} />);
    expect(screen.getByRole('grid', { name: '2026년 10월' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: '일' }).getAttribute('abbr')).toBe('일요일');
    const today = day('15, 2026년 10월 목요일, 오늘');
    expect(today.getAttribute('aria-current')).toBe('date');
    expect(today.tabIndex).toBe(0); // 처음 포커스를 받을 날짜는 오늘
    expect(day('14, 2026년 10월 수요일').tabIndex).toBe(-1);
  });

  it('키보드로 날짜·주·달·해를 옮긴다 (보이는 달도 따라간다)', async () => {
    const user = userEvent.setup();
    render(<Calendar today={TODAY} />);
    day(/^15, 2026년 10월/).focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(day(/^16, 2026년 10월/));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(day(/^23, 2026년 10월/));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(day(/^18, 2026년 10월 일요일/));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(day(/^24, 2026년 10월 토요일/));
    await user.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: '2026년 11월' })).toBeTruthy();
    expect(document.activeElement).toBe(day(/^24, 2026년 11월/));
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(document.activeElement).toBe(day(/^24, 2025년 11월/));
  });

  it('Enter 로 고르면 onValueChange 에 YYYY-MM-DD 를 넘기고 선택 표시(aria-selected)를 한다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar today={TODAY} onValueChange={onValueChange} />);
    day(/^15, 2026년 10월/).focus();
    await user.keyboard('{ArrowLeft}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('2026-10-14');
    expect(
      day(/^14, 2026년 10월/)
        .closest('td')
        ?.getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('min·max 밖과 isDateDisabled 날짜는 고를 수 없고, 키보드 이동도 범위 안으로 맞춘다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        today={TODAY}
        min="2026-10-10"
        max="2026-10-20"
        isDateDisabled={(date) => date.getDay() === 0}
        onValueChange={onValueChange}
      />,
    );
    await user.click(day(/^5, 2026년 10월/));
    await user.click(day(/^18, 2026년 10월 일요일/));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(day(/^5, 2026년 10월/).getAttribute('aria-disabled')).toBe('true');
    expect((screen.getByRole('button', { name: '이전 달' }) as HTMLButtonElement).disabled).toBe(true);

    day(/^15, 2026년 10월/).focus();
    await user.keyboard('{PageDown}'); // 11월 15일 → max(10월 20일)로 맞춘다
    expect(document.activeElement).toBe(day(/^20, 2026년 10월/));
  });

  it('공휴일은 이름에 "공휴일" 을 덧붙인다', () => {
    render(<Calendar today={TODAY} isHoliday={(date) => date.getMonth() === 9 && date.getDate() === 9} />);
    expect(day('9, 2026년 10월 금요일, 공휴일').getAttribute('data-holiday')).not.toBeNull();
  });

  it('서버 렌더링: 서버와 브라우저의 오늘이 달라도(UTC 서버·KST 브라우저 등) hydration 이 어긋나지 않는다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 9, 31, 23)); // 서버: 10월 31일
      const html = renderToString(<Calendar />);
      vi.setSystemTime(new Date(2026, 10, 1, 8)); // 브라우저: 11월 1일
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.append(container);
      const onRecoverableError = vi.fn();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      await act(async () => {
        hydrateRoot(container, <Calendar />, { onRecoverableError });
      });
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      // hydration 뒤에는 브라우저의 오늘로 그린다
      expect(screen.getByRole('grid', { name: '2026년 11월' })).toBeTruthy();
      expect(container.querySelector('[aria-current="date"]')?.textContent).toBe('1');
      consoleError.mockRestore();
      container.remove();
    } finally {
      vi.useRealTimers();
    }
  });
});
