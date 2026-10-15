import { render, screen } from '@testing-library/react';
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
});
