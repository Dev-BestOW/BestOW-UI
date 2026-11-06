import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountNumberInput } from './AccountNumberInput';

const input = () => screen.getByRole('textbox', { name: '계좌번호' }) as HTMLInputElement;

describe('AccountNumberInput', () => {
  it('숫자만 받고(하이픈 붙여넣기도 숫자로) 서식을 넣지 않는다, 최대 16자리', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AccountNumberInput onValueChange={onValueChange} />);
    input().focus();
    await user.paste('110-123-456789');
    expect(input().value).toBe('110123456789');
    expect(onValueChange).toHaveBeenLastCalledWith('110123456789', true);
    await user.type(input(), '123456789');
    expect(input().value).toBe('1101234567891234');
  });

  it('10자리 전에는 valid 가 null, 10~16자리는 오류 없음', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AccountNumberInput onValueChange={onValueChange} />);
    await user.type(input(), '123456789');
    expect(onValueChange).toHaveBeenLastCalledWith('123456789', null);
    await user.type(input(), '0');
    expect(onValueChange).toHaveBeenLastCalledWith('1234567890', true);
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });

  it('10자리보다 짧은 채 벗어나면 안내하고, 채우면 사라진다', async () => {
    const user = userEvent.setup();
    render(<AccountNumberInput />);
    await user.type(input(), '12345');
    fireEvent.blur(input());
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('계좌번호를 10자리 이상 입력해 주세요.')).toBeTruthy();
    await user.type(input(), '67890');
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });
});
