import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CorporateNumberInput } from './CorporateNumberInput';

const input = () => screen.getByRole('textbox', { name: '법인등록번호' }) as HTMLInputElement;

describe('CorporateNumberInput', () => {
  it('6-7 로 하이픈을 넣고, 13자리를 채우면 검증 결과와 함께 값을 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CorporateNumberInput onValueChange={onValueChange} />);
    await user.type(input(), '1301110');
    expect(input().value).toBe('130111-0');
    expect(onValueChange).toHaveBeenLastCalledWith('1301110', null);
    await user.type(input(), '0062469');
    expect(input().value).toBe('130111-0006246');
    expect(onValueChange).toHaveBeenLastCalledWith('1301110006246', true);
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });

  it('검증 공식에 맞지 않으면 오류, 덜 채우고 벗어나면 자릿수 안내', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CorporateNumberInput />);
    await user.type(input(), '1301110006247');
    expect(screen.getByText(/올바른 법인등록번호가 아니에요/)).toBeTruthy();
    unmount();
    render(<CorporateNumberInput />);
    await user.type(input(), '130111');
    await user.tab();
    expect(screen.getByText('13자리를 모두 입력해 주세요.')).toBeTruthy();
  });
});
