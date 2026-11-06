import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { CardNumberInput } from './CardNumberInput';

const input = () => screen.getByRole('textbox', { name: '카드번호' }) as HTMLInputElement;

describe('CardNumberInput', () => {
  it('4자리씩 하이픈을 넣고, 16자리를 채우면 Luhn 결과와 함께 값을 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CardNumberInput onValueChange={onValueChange} />);
    expect(input().getAttribute('autocomplete')).toBe('cc-number');
    expect(input().getAttribute('inputmode')).toBe('numeric');
    await user.type(input(), '41111');
    expect(input().value).toBe('4111-1');
    expect(onValueChange).toHaveBeenLastCalledWith('41111', null);
    await user.type(input(), '11111111111999');
    expect(input().value).toBe('4111-1111-1111-1111');
    expect(onValueChange).toHaveBeenLastCalledWith('4111111111111111', true);
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });

  it('아메리칸 익스프레스는 4-6-5 로 15자리에서 끝난다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CardNumberInput onValueChange={onValueChange} />);
    await user.type(input(), '3782822463100059');
    expect(input().value).toBe('3782-822463-10005');
    expect(onValueChange).toHaveBeenLastCalledWith('378282246310005', true);
  });

  it('다 채웠는데 Luhn 에 맞지 않으면 오류를 보이고 입력이 멈춘 뒤 알린다', async () => {
    const user = userEvent.setup();
    render(<CardNumberInput />);
    await user.type(input(), '4111111111111112');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('');
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe('올바른 카드번호가 아니에요. 번호를 다시 확인해 주세요.'),
    );
  });

  it('덜 채우고 벗어나면 끝까지 입력하라고 안내한다', async () => {
    const user = userEvent.setup();
    render(<CardNumberInput />);
    await user.type(input(), '4111');
    await user.tab();
    expect(screen.getByText('카드번호를 끝까지 입력해 주세요.')).toBeTruthy();
  });

  it('LocaleProvider 문구를 쓴다', () => {
    render(
      <LocaleProvider messages={en}>
        <CardNumberInput />
      </LocaleProvider>,
    );
    expect(screen.getByRole('textbox', { name: 'Card number' })).toBeTruthy();
  });
});
