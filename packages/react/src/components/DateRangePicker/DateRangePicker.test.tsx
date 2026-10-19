import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { focusField } from '../../utils/focusField';
import { DateRangePicker } from './DateRangePicker';
import { dateRangePresets, presetRange } from './presets';

const start = () => screen.getByRole('textbox', { name: '시작일' }) as HTMLInputElement;
const end = () => screen.getByRole('textbox', { name: '종료일' }) as HTMLInputElement;

describe('DateRangePicker', () => {
  it('fieldset(legend 가 이름) 안에 시작일·종료일 칸이 있다', () => {
    render(<DateRangePicker label="조회 기간" today="2026-10-19" />);
    expect(screen.getByRole('group', { name: '조회 기간' }).tagName).toBe('FIELDSET');
    expect(start()).toBeTruthy();
    expect(end()).toBeTruthy();
  });

  it('숫자를 입력하면 기간이 넘어온다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker label="조회 기간" today="2026-10-19" onValueChange={onValueChange} />);
    await user.type(start(), '20261001');
    await user.type(end(), '20261019');
    expect(start().value).toBe('2026-10-01');
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-10-01', end: '2026-10-19' });
  });

  it('시작일은 종료일보다 늦을 수 없다 — 늦으면 비우고 이유를 보여 준다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker label="조회 기간" today="2026-10-19" onValueChange={onValueChange} />);
    await user.type(end(), '20261010');
    await user.type(start(), '20261015');
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '', end: '2026-10-10' });
    expect(start().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('고를 수 없는 날짜예요.')).toBeTruthy();
  });

  it('빠른 선택은 오늘에서 거슬러 올라간 기간을 넣고, 같은 기간이면 눌린 상태다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker label="조회 기간" today="2026-10-19" presets={dateRangePresets} onValueChange={onValueChange} />,
    );
    const group = screen.getByRole('group', { name: '빠른 선택' });
    expect(group).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '1주일' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-10-12', end: '2026-10-19' });
    expect(start().value).toBe('2026-10-12');
    expect(end().value).toBe('2026-10-19');
    expect(screen.getByRole('button', { name: '1주일' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '1개월' }).getAttribute('aria-pressed')).toBe('false');

    // 직접 고치면 더는 그 빠른 선택이 아니다
    await user.clear(start());
    await user.type(start(), '20261011');
    expect(screen.getByRole('button', { name: '1주일' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('presetRange: 오늘 하루·주·달(월말은 그 달 마지막 날로)', () => {
    expect(presetRange({ label: '오늘', days: 0 }, '2026-10-19')).toEqual({ start: '2026-10-19', end: '2026-10-19' });
    expect(presetRange({ label: '1개월', months: 1 }, '2026-03-31')).toEqual({
      start: '2026-02-28',
      end: '2026-03-31',
    });
    expect(presetRange({ label: '3개월', months: 3 }, '2026-10-19')).toEqual({
      start: '2026-07-19',
      end: '2026-10-19',
    });
  });

  it('제어 모드: 바깥 값이 바뀌면 따라간다', () => {
    const { rerender } = render(
      <DateRangePicker label="기간" today="2026-10-19" value={{ start: '2026-10-01', end: '2026-10-05' }} />,
    );
    expect(start().value).toBe('2026-10-01');
    rerender(<DateRangePicker label="기간" today="2026-10-19" value={{ start: '2026-09-01', end: '2026-09-30' }} />);
    expect(start().value).toBe('2026-09-01');
    expect(end().value).toBe('2026-09-30');
  });

  it('id 를 주면 ErrorSummary(focusField)가 시작일로 간다, 문구는 LocaleProvider 로', () => {
    render(
      <LocaleProvider messages={en}>
        <DateRangePicker id="period" label="Period" presets={[{ label: 'Today', days: 0 }]} today="2026-10-19" />
      </LocaleProvider>,
    );
    focusField('period');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Start date' }));
    expect(screen.getByRole('group', { name: 'Quick select' })).toBeTruthy();
  });
});
