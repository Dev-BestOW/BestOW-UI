import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BusinessNumberInput } from './BusinessNumberInput';

const input = () => screen.getByRole('textbox', { name: '사업자등록번호' }) as HTMLInputElement;

describe('BusinessNumberInput', () => {
  it('3-2-5 로 하이픈을 넣고, 10자리를 채우면 검증 결과와 함께 값을 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BusinessNumberInput onValueChange={onValueChange} />);
    await user.type(input(), '12481');
    expect(input().value).toBe('124-81');
    expect(onValueChange).toHaveBeenLastCalledWith('12481', null);
    await user.type(input(), '00998');
    expect(input().value).toBe('124-81-00998');
    expect(onValueChange).toHaveBeenLastCalledWith('1248100998', true);
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });

  it('10자리인데 검증 공식에 맞지 않으면 오류를 describedby 로 알린다', async () => {
    const user = userEvent.setup();
    render(<BusinessNumberInput />);
    await user.type(input(), '1234567890');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    const message = screen.getByText(/올바른 사업자등록번호가 아니에요/);
    expect(input().getAttribute('aria-describedby')).toContain(message.id);
  });

  it('10자리를 채운 순간의 오류는 입력이 멈춘 뒤 status 로 알리고, 고치면 비운다', async () => {
    const user = userEvent.setup();
    render(<BusinessNumberInput />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe(''); // 처음부터 있는 빈 영역
    await user.type(input(), '1234567890');
    // 마지막 글자를 읽는 동안 바꾸면 VoiceOver 가 버린다 — 바로 넣지 않는다
    expect(status.textContent).toBe('');
    await waitFor(() =>
      expect(status.textContent).toBe('올바른 사업자등록번호가 아니에요. 번호를 다시 확인해 주세요.'),
    );
    await user.keyboard('{Backspace}');
    expect(status.textContent).toBe('');
    // 같은 오류가 다시 나도 다시 알린다 (늦춰서)
    await user.type(input(), '0');
    expect(status.textContent).toBe('');
    await waitFor(() => expect(status.textContent).toContain('올바른 사업자등록번호가 아니에요'));
  });

  it('올바른 번호·덜 채우고 벗어난 경우·직접 준 error 는 알리지 않는다', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<BusinessNumberInput />);
    await user.type(input(), '1248100998');
    await user.type(input(), '{Backspace}');
    await user.tab(); // 자릿수 안내는 화면·설명으로만 (벗어난 뒤라 알림은 방해)
    expect(screen.getByText('10자리를 모두 입력해 주세요.')).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(screen.getByRole('status').textContent).toBe('');
    rerender(<BusinessNumberInput error helperText="국세청 조회 결과 휴업 중이에요" />);
    await user.type(input(), '0'); // 10자리 — 틀린 번호지만 직접 준 error 가 우선
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('입력 중에는 오류를 띄우지 않고, 덜 채운 채 벗어나면 자릿수를 안내한다', async () => {
    const user = userEvent.setup();
    render(<BusinessNumberInput />);
    await user.type(input(), '1234');
    expect(input().hasAttribute('aria-invalid')).toBe(false);
    await user.tab();
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('10자리를 모두 입력해 주세요.')).toBeTruthy();
  });

  it('validate={false} 면 자동 검증을 하지 않고, 직접 준 error 가 우선한다', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<BusinessNumberInput validate={false} />);
    await user.type(input(), '1234567890');
    expect(input().hasAttribute('aria-invalid')).toBe(false);
    rerender(<BusinessNumberInput error={false} helperText="국세청 조회 중이에요" />);
    expect(screen.getByText('국세청 조회 중이에요')).toBeTruthy();
  });
});
