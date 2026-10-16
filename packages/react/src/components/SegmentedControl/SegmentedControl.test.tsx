import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

const periods: SegmentedControlOption[] = [
  { value: 'day', label: '일' },
  { value: 'week', label: '주' },
  { value: 'month', label: '월' },
  { value: 'year', label: '연', disabled: true },
];

const group = () => screen.getByRole('radiogroup', { name: '기간' });
const radio = (name: string) => screen.getByRole('radio', { name });

describe('SegmentedControl', () => {
  it('aria-label 이 라디오 그룹 이름이 되고, 선택된 칸은 aria-checked 다', () => {
    render(<SegmentedControl aria-label="기간" options={periods} defaultValue="week" />);
    expect(group()).toBeTruthy();
    expect(radio('주').getAttribute('aria-checked')).toBe('true');
    expect(radio('일').getAttribute('aria-checked')).toBe('false');
  });

  it('보이는 label 을 주면 그 글자가 그룹 이름이 된다', () => {
    render(<SegmentedControl label="기간" options={periods} defaultValue="day" />);
    expect(group().getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('Tab 으로 들어가면 선택된 칸에 포커스, 화살표로 옮기면 바로 선택된다 (비활성 칸은 건너뛰고 끝에서 처음으로 돈다)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="기간" options={periods} defaultValue="week" onValueChange={onValueChange} />);
    await user.tab();
    expect(document.activeElement).toBe(radio('주'));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(radio('월'));
    expect(radio('월').getAttribute('aria-checked')).toBe('true');
    await user.keyboard('{ArrowRight}'); // '연' 은 비활성 → 처음으로
    expect(document.activeElement).toBe(radio('일'));
    await user.keyboard('{ArrowLeft}'); // 처음에서 왼쪽 → 끝으로 돌되 비활성 '연' 은 건너뛴다
    expect(document.activeElement).toBe(radio('월'));
    expect(onValueChange.mock.calls).toEqual([['month'], ['day'], ['month']]);
  });

  it('Home/End 는 첫·마지막 활성 칸, 선택된 칸 하나만 Tab 정지점이다', async () => {
    const user = userEvent.setup();
    render(<SegmentedControl aria-label="기간" options={periods} defaultValue="week" />);
    expect(screen.getAllByRole('radio').map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '0', '-1', '-1']);
    await user.tab();
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(radio('월'));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(radio('일'));
    expect(radio('일').getAttribute('aria-checked')).toBe('true');
  });

  it('선택된 값이 없으면 첫 활성 칸이 Tab 정지점이고, 들어가기만 해서는 선택되지 않는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="기간" options={periods} onValueChange={onValueChange} />);
    await user.tab();
    expect(document.activeElement).toBe(radio('일'));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard(' ');
    expect(radio('일').getAttribute('aria-checked')).toBe('true');
  });

  it('누르면 선택되고, 비활성 칸은 선택되지 않는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="기간" options={periods} defaultValue="day" onValueChange={onValueChange} />);
    await user.click(radio('월'));
    await user.click(radio('연'));
    expect(onValueChange.mock.calls).toEqual([['month']]);
    expect(radio('연').hasAttribute('disabled')).toBe(true);
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작한다 (uncontrolled → controlled 경고 없음)', async () => {
    const user = userEvent.setup();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Controlled() {
      const [value, setValue] = useState<string>();
      return (
        <>
          <SegmentedControl aria-label="기간" options={periods} value={value} onValueChange={setValue} />
          <span data-testid="value">{value ?? '없음'}</span>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByTestId('value').textContent).toBe('없음');
    await user.click(radio('주'));
    expect(screen.getByTestId('value').textContent).toBe('week');
    expect(radio('주').getAttribute('aria-checked')).toBe('true');
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/uncontrolled|controlled/);
    error.mockRestore();
  });

  it('name 이 있으면 form 에 선택 값을 제출하고, ref 는 그룹을 가리킨다', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <form>
        <SegmentedControl ref={ref} aria-label="기간" name="period" options={periods} defaultValue="month" />
      </form>,
    );
    expect(ref.current).toBe(group());
    const data = new FormData(container.querySelector('form')!);
    expect(data.get('period')).toBe('month');
  });

  it('아이콘은 이름에 섞이지 않는다', () => {
    render(
      <SegmentedControl
        aria-label="보기"
        options={[
          { value: 'list', label: '목록', icon: <svg data-testid="list-icon" /> },
          { value: 'grid', label: '격자' },
        ]}
      />,
    );
    expect(radio('목록')).toBeTruthy();
    expect(screen.getByTestId('list-icon').parentElement?.getAttribute('aria-hidden')).toBe('true');
  });
});
