import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountInput } from './AmountInput';

const input = () => screen.getByRole('textbox', { name: '금액' }) as HTMLInputElement;

describe('AmountInput', () => {
  it('천 단위 쉼표를 넣고, 숫자로 값을 넘기며, 읽기 쉬운 금액을 describedby 로 연결한다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AmountInput onValueChange={onValueChange} />);
    await user.type(input(), '125000');
    expect(input().value).toBe('125,000');
    expect(onValueChange).toHaveBeenLastCalledWith(125000);
    const reading = screen.getByText('12만 5,000원');
    expect(input().getAttribute('aria-describedby')).toContain(reading.id || reading.closest('p')!.id);
  });

  it('앞의 0 은 지우고, 비우면 null 을 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AmountInput onValueChange={onValueChange} />);
    await user.type(input(), '007');
    expect(input().value).toBe('7');
    await user.clear(input());
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByText(/원$/)).toBeTruthy(); // 단위 "원" 은 입력창 뒤에 그대로
  });

  it('max 를 넘으면 max 로 맞춘다', async () => {
    const user = userEvent.setup();
    render(<AmountInput max={50000} />);
    await user.type(input(), '99999');
    expect(input().value).toBe('50,000');
  });

  it('쉼표 바로 뒤에서 Backspace 를 누르면 쉼표 앞 숫자를 지운다', async () => {
    const user = userEvent.setup();
    render(<AmountInput defaultValue={1234567} />); // 1,234,567
    const field = input();
    field.focus();
    field.setSelectionRange(2, 2); // "1,|234,567"
    await user.keyboard('{Backspace}');
    expect(field.value).toBe('234,567');
    expect(field.selectionStart).toBe(0);
  });
  describe('빠른 금액', () => {
    const button = (name: string) => screen.getByRole('button', { name });

    it('빠른 금액 버튼이 금액을 더한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<AmountInput quickAmounts={[10000, 50000]} onValueChange={onValueChange} />);
      await user.click(button('+1만'));
      await user.click(button('+1만'));
      await user.click(button('+5만'));
      expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([10000, 20000, 70000]);
      expect(input().value).toBe('70,000');
    });

    it('max 를 넘으면 max 로 맞춘다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<AmountInput quickAmounts={[10000]} max={30000} defaultValue={25000} onValueChange={onValueChange} />);
      await user.click(button('+1만'));
      expect(onValueChange).toHaveBeenLastCalledWith(30000);
      expect(input().value).toBe('30,000');
    });

    it('전액은 max 로 바꾸고, max 가 없으면 전액 버튼이 없다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { rerender } = render(<AmountInput max={500000} showMaxButton onValueChange={onValueChange} />);
      await user.click(button('전액'));
      expect(onValueChange).toHaveBeenLastCalledWith(500000);
      expect(input().value).toBe('500,000');
      rerender(<AmountInput showMaxButton />);
      expect(screen.queryByRole('button', { name: '전액' })).toBeNull();
      expect(screen.queryByRole('group')).toBeNull();
    });

    it('제어 모드는 부모 값만 바꾼다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<AmountInput quickAmounts={[10000]} value={1000} onValueChange={onValueChange} />);
      await user.click(button('+1만'));
      expect(onValueChange).toHaveBeenLastCalledWith(11000);
      expect(input().value).toBe('1,000');
    });

    it('빈 값에서 더한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<AmountInput quickAmounts={[10000]} value={null} onValueChange={onValueChange} />);
      await user.click(button('+1만'));
      expect(onValueChange).toHaveBeenLastCalledWith(10000);
    });

    it('버튼은 "빠른 금액" 묶음 안의 type="button" 이다', () => {
      render(<AmountInput quickAmounts={[10000]} />);
      const group = screen.getByRole('group', { name: '빠른 금액' });
      expect(group.contains(button('+1만'))).toBe(true);
      expect(button('+1만').getAttribute('type')).toBe('button');
    });

    it('disabled 면 버튼도 비활성', () => {
      render(<AmountInput quickAmounts={[10000]} max={100} showMaxButton disabled />);
      expect((button('+1만') as HTMLButtonElement).disabled).toBe(true);
      expect((button('전액') as HTMLButtonElement).disabled).toBe(true);
    });

    it('누른 뒤 합계를 status 로 알리고, 직접 입력하면 비운다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      try {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<AmountInput quickAmounts={[10000, 50000]} />);
        const status = screen.getByRole('status');
        expect(status.textContent).toBe('');
        await user.click(button('+1만'));
        await user.click(button('+5만'));
        expect(status.textContent).toBe('');
        act(() => vi.advanceTimersByTime(800));
        expect(status.textContent).toBe('6만원');
        await user.type(input(), '1');
        expect(status.textContent).toBe('');
      } finally {
        vi.useRealTimers();
      }
    });

    it('quickAmounts 가 없으면 예전과 같은 구조', () => {
      const { container } = render(<AmountInput />);
      expect(screen.queryByRole('group')).toBeNull();
      expect(screen.queryByRole('status')).toBeNull();
      expect((container.firstChild as HTMLElement).contains(input())).toBe(true);
      expect((container.firstChild as HTMLElement).querySelector('label')).not.toBeNull();
      expect(container.childElementCount).toBe(1);
    });
  });
});
