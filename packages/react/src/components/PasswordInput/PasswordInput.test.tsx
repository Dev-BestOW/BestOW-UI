import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { PasswordInput } from './PasswordInput';

const toggle = () => screen.getByRole('button', { name: '비밀번호 보기' });
const input = () => screen.getByLabelText('비밀번호') as HTMLInputElement;

describe('PasswordInput', () => {
  it('기본은 가린 비밀번호 칸이고, 보기 버튼이 그 칸을 가리킨다', () => {
    render(<PasswordInput />);
    expect(input().type).toBe('password');
    expect(input().getAttribute('autocomplete')).toBe('current-password');
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(toggle().getAttribute('aria-controls')).toBe(input().id);
    expect(toggle().getAttribute('type')).toBe('button');
  });

  it('보기 버튼을 누르면 글자로 보이고 다시 누르면 가린다', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.click(toggle());
    expect(input().type).toBe('text');
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    await user.click(toggle());
    expect(input().type).toBe('password');
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
  });

  it('입력 중에 마우스로 보기 버튼을 눌러도 입력창 포커스가 그대로다', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.type(input(), 'abc');
    await user.click(toggle());
    expect(document.activeElement).toBe(input());
    expect(input().value).toBe('abc');
  });

  it('키보드: Tab 으로 보기 버튼에 가서 Space 로 바꾼다', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.tab();
    expect(document.activeElement).toBe(input());
    await user.tab();
    expect(document.activeElement).toBe(toggle());
    await user.keyboard(' ');
    expect(input().type).toBe('text');
  });

  it('제어 모드는 visible 을 따르고 바뀔 값을 알린다', async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    render(<PasswordInput visible={false} onVisibleChange={onVisibleChange} />);
    await user.click(toggle());
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(input().type).toBe('password');
  });

  it('제어 모드에서 부모가 값을 바꾸면 따른다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [visible, setVisible] = useState(false);
      return <PasswordInput visible={visible} onVisibleChange={setVisible} />;
    }
    render(<Controlled />);
    await user.click(toggle());
    expect(input().type).toBe('text');
  });

  it('비활성이면 보기 버튼도 비활성이다', () => {
    render(<PasswordInput disabled />);
    expect((input() as HTMLInputElement | HTMLButtonElement).disabled).toBe(true);
    expect((toggle() as HTMLInputElement | HTMLButtonElement).disabled).toBe(true);
  });

  it('레이블·도움말·오류·새 비밀번호 자동 완성', () => {
    render(
      <PasswordInput
        label="새 비밀번호"
        helperText="8자 이상"
        error
        required
        autoComplete="new-password"
        name="password"
      />,
    );
    const field = screen.getByLabelText(/새 비밀번호/) as HTMLInputElement;
    expect(document.getElementById(field.getAttribute('aria-describedby')!)?.textContent).toBe('8자 이상');
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(field.required).toBe(true);
    expect(field.getAttribute('autocomplete')).toBe('new-password');
    expect(field.getAttribute('name')).toBe('password');
  });

  it('form reset 이면 다시 가린다 (비제어)', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <PasswordInput />
      </form>,
    );
    await user.click(toggle());
    expect(input().type).toBe('text');
    act(() => document.querySelector('form')!.reset());
    expect(input().type).toBe('password');
  });

  it('LocaleProvider 문구를 쓴다', () => {
    render(
      <LocaleProvider messages={en}>
        <PasswordInput />
      </LocaleProvider>,
    );
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeTruthy();
  });
});
