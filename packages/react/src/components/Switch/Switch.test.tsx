import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('label 과 연결된 switch 역할로 렌더링한다', () => {
    render(<Switch label="알림 받기" />);
    const sw = screen.getByRole('switch', { name: '알림 받기' });
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('label 을 클릭하면 켜지고 onCheckedChange 가 호출된다', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="알림 받기" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText('알림 받기'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('disabled 이면 바뀌지 않는다', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="알림" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('ref 는 switch 버튼을 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="알림" />);
    expect(ref.current).toBe(screen.getByRole('switch', { name: '알림' }));
  });
});

describe('Switch — 상태', () => {
  it('제어 모드에서는 checked prop 을 따르고 onCheckedChange 로 새 값을 알린다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Switch label="알림" checked={false} onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    rerender(<Switch label="알림" checked onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('switch').getAttribute('data-state')).toBe('checked');
  });

  it('defaultChecked 로 켜진 채 시작하고, Space 키로 끈다', async () => {
    const user = userEvent.setup();
    render(<Switch label="알림" defaultChecked />);
    const sw = screen.getByRole('switch');
    expect(sw.getAttribute('aria-checked')).toBe('true');
    sw.focus();
    await user.keyboard(' ');
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('required 이면 aria-required 를 붙인다', () => {
    render(<Switch label="동의" required />);
    expect(screen.getByRole('switch').getAttribute('aria-required')).toBe('true');
  });
});

describe('Switch — form', () => {
  it('form 밖에서는 숨긴 input 을 그리지 않는다', () => {
    const { container } = render(<Switch label="알림" name="notify" />);
    expect(container.querySelector('input')).toBeNull();
  });

  it('켜져 있을 때만 name=value 로 제출된다', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Switch label="알림" name="notify" value="yes" />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).get('notify')).toBeNull();
    await user.click(screen.getByRole('switch'));
    expect(new FormData(form).get('notify')).toBe('yes');
  });

  it('required 이면 꺼져 있는 동안 form 검증에 실패한다', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Switch label="동의" name="agree" required />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await user.click(screen.getByRole('switch'));
    expect(form.checkValidity()).toBe(true);
  });

  it('form reset 이면 처음 값으로 돌아간다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <form data-testid="form">
        <Switch label="알림" name="notify" onCheckedChange={onCheckedChange} />
      </form>,
    );
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    act(() => (screen.getByTestId('form') as HTMLFormElement).reset());
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('바깥 form 의 onChange 와 onClick 에 한 번씩 알린다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();
    render(
      // 바깥 React onClick 이 한 번만 불리는지 보려는 테스트 — form 에 click 을 다는 것은 의도
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      <form onChange={onChange} onClick={onClick}>
        <Switch label="알림" name="notify" />
      </form>,
    );
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
