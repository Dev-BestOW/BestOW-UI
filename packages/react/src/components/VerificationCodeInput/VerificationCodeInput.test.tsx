import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerificationCodeInput } from './VerificationCodeInput';

const input = () => screen.getByRole('textbox', { name: '인증번호' }) as HTMLInputElement;

describe('VerificationCodeInput', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('입력창 하나에 "인증번호" 이름을 주고, 자동 채우기·숫자 키패드 속성과 자릿수 안내를 연결한다', () => {
    render(<VerificationCodeInput />);
    const field = input();
    expect(field.getAttribute('autocomplete')).toBe('one-time-code');
    expect(field.getAttribute('inputmode')).toBe('numeric');
    expect(field.getAttribute('aria-describedby')).toContain(screen.getByText('6자리 숫자를 입력하세요.').id);
    // 칸 모양은 화면 표시용이라 스크린리더에 따로 나오지 않는다
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('숫자만 받고, 붙여넣기도 자릿수만큼 잘라 넣으며, 다 채우면 onComplete 를 한 번 부른다', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onValueChange = vi.fn();
    render(<VerificationCodeInput onComplete={onComplete} onValueChange={onValueChange} />);
    await user.click(input());
    await user.keyboard('12a3');
    expect(input().value).toBe('123');

    await user.clear(input());
    await user.paste('987-6543 21');
    expect(input().value).toBe('987654');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('987654');

    await user.keyboard('9'); // 이미 다 찼으면 더 들어가지 않는다
    expect(input().value).toBe('987654');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('alphanumeric 이면 영문·숫자를 대문자로 받는다', async () => {
    const user = userEvent.setup();
    render(<VerificationCodeInput type="alphanumeric" length={4} />);
    await user.type(input(), 'a1-b2');
    expect(input().value).toBe('A1B2');
  });

  it('expiresIn 이 지나면 onExpire 를 부르고 만료 안내를 알림 영역에 넣으며, 재전송하면 입력값과 시간을 되돌린다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onExpire = vi.fn();
    const onResend = vi.fn();
    render(<VerificationCodeInput expiresIn={180} onExpire={onExpire} onResend={onResend} />);
    expect(screen.getByRole('timer').textContent).toBe('03:00');
    expect(screen.getByRole('status').textContent).toBe('');

    await user.type(input(), '12');
    await act(async () => {
      vi.advanceTimersByTime(61_000);
    });
    expect(screen.getByRole('timer').textContent).toBe('01:59');

    await act(async () => {
      vi.advanceTimersByTime(120_000);
    });
    expect(screen.getByRole('timer').textContent).toBe('00:00');
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent).toBe('인증 시간이 지났어요. 재전송해 주세요.');

    await user.click(screen.getByRole('button', { name: '재전송' }));
    expect(onResend).toHaveBeenCalledTimes(1);
    expect(input().value).toBe('');
    expect(screen.getByRole('timer').textContent).toBe('03:00');
    expect(screen.getByRole('status').textContent).toBe('');
    expect(document.activeElement).toBe(input());
  });

  it('error 면 aria-invalid, helperText 로 안내를 바꾸고, name 이 있으면 form 에 제출한다', () => {
    const { container } = render(
      <VerificationCodeInput error helperText="인증번호가 맞지 않아요." name="code" defaultValue="123456" />,
    );
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toContain(screen.getByText('인증번호가 맞지 않아요.').id);
    expect(container.querySelector<HTMLInputElement>('input[type=hidden][name=code]')?.value).toBe('123456');
  });
});
