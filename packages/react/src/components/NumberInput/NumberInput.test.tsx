import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { NumberInput, type NumberInputProps } from './NumberInput';

const input = () => screen.getByRole('spinbutton', { name: '수량' }) as HTMLInputElement;
const decrement = () => screen.getByRole('button', { name: '줄이기' }) as HTMLButtonElement;
const increment = () => screen.getByRole('button', { name: '늘리기' }) as HTMLButtonElement;

function Controlled(props: Partial<NumberInputProps>) {
  const [value, setValue] = useState<number | null>(props.defaultValue ?? null);
  return (
    <>
      <NumberInput label="수량" {...props} defaultValue={undefined} value={value} onValueChange={setValue} />
      <output data-testid="value">{String(value)}</output>
    </>
  );
}

describe('NumberInput', () => {
  it('spinbutton 에 현재 값·최소·최대·단위를 붙인 읽기 값을 알린다', () => {
    render(<NumberInput label="수량" defaultValue={3} min={1} max={10} unit="개" />);
    const field = input();
    expect(field.getAttribute('aria-valuenow')).toBe('3');
    expect(field.getAttribute('aria-valuemin')).toBe('1');
    expect(field.getAttribute('aria-valuemax')).toBe('10');
    expect(field.getAttribute('aria-valuetext')).toBe('3개');
    expect(field.getAttribute('inputmode')).toBe('numeric');
  });

  it('비어 있으면 aria-valuenow·valuetext 가 없다', () => {
    render(<NumberInput label="수량" />);
    expect(input().hasAttribute('aria-valuenow')).toBe(false);
    expect(input().hasAttribute('aria-valuetext')).toBe(false);
  });

  it('↑/↓ 는 step, PageUp/PageDown 은 largeStep 만큼 바꾸고, Home/End 는 min/max 로 간다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="수량" defaultValue={5} min={0} max={100} step={2} onValueChange={onValueChange} />);
    input().focus();
    await user.keyboard('{ArrowUp}');
    expect(input().value).toBe('7');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input().value).toBe('3');
    await user.keyboard('{PageUp}');
    expect(input().value).toBe('23');
    await user.keyboard('{End}');
    expect(input().value).toBe('100');
    await user.keyboard('{ArrowUp}'); // 최대에서 더 올라가지 않는다
    expect(input().value).toBe('100');
    await user.keyboard('{Home}');
    expect(input().value).toBe('0');
    expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([7, 5, 3, 23, 100, 0]);
  });

  it('키·버튼으로 바꾼 값을 단위와 함께 알림 영역으로 알린다 (직접 입력·포커스 이탈 때는 알리지 않음)', async () => {
    const user = userEvent.setup();
    const { container } = render(<NumberInput label="수량" defaultValue={1} min={1} max={10} unit="석" />);
    // 알림 영역은 처음부터 비어 있는 채로 있어야 한다 (새로 생긴 live region 은 읽히지 않는다)
    const live = container.querySelector('[aria-live="assertive"]')!;
    expect(live.textContent).toBe('');
    await user.click(input());
    await user.keyboard('{ArrowUp}');
    expect(live.textContent).toBe('2석');
    await user.keyboard('{ArrowUp}');
    expect(live.textContent).toBe('3석');
    await user.click(increment());
    expect(live.textContent).toBe('4석');
    await user.keyboard('{Backspace}5');
    expect(input().value).toBe('5');
    expect(live.textContent).toBe('');
    await user.keyboard('{ArrowDown}');
    expect(live.textContent).toBe('4석');
    await user.tab();
    expect(live.textContent).toBe('');
  });

  it('−/+ 버튼은 Tab 순서에서 빠져 있고, 범위 끝에서 비활성이 된다', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="수량" defaultValue={1} min={1} max={2} />);
    expect(decrement().tabIndex).toBe(-1);
    expect(decrement().getAttribute('aria-controls')).toBe(input().id);
    expect(decrement().disabled).toBe(true);
    await user.click(increment());
    expect(input().value).toBe('2');
    expect(increment().disabled).toBe(true);
    expect(decrement().disabled).toBe(false);
  });

  it('버튼을 눌러도 입력창 포커스를 뺏지 않는다', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="수량" defaultValue={1} />);
    input().focus();
    await user.click(increment());
    expect(document.activeElement).toBe(input());
    expect(input().value).toBe('2');
  });

  it('천 단위 쉼표를 넣고 숫자가 아닌 글자는 버린다. 값은 숫자로 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="수량" min={0} onValueChange={onValueChange} />);
    await user.type(input(), '12a34-5');
    expect(input().value).toBe('12,345');
    expect(onValueChange).toHaveBeenLastCalledWith(12345);
  });

  it('thousandSeparator={false} 면 쉼표를 넣지 않는다', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="수량" thousandSeparator={false} />);
    await user.type(input(), '12345');
    expect(input().value).toBe('12345');
  });

  it('소수: step 의 자릿수만큼 입력받고 "1." 같은 입력 중 상태를 지킨다 (제어 모드에서도)', async () => {
    const user = userEvent.setup();
    render(<Controlled step={0.1} />);
    await user.type(input(), '1.');
    expect(input().value).toBe('1.');
    expect(screen.getByTestId('value').textContent).toBe('1');
    await user.type(input(), '25');
    expect(input().value).toBe('1.2'); // 소수 한 자리까지
    expect(input().getAttribute('inputmode')).toBe('text'); // min 이 없으면 음수를 받으므로 "-" 가 있는 키보드
    await user.keyboard('{ArrowUp}');
    expect(input().value).toBe('1.3'); // 부동소수 오차(1.2000000000000002) 없이
  });

  it('소수 step 을 더해도 부동소수 오차가 표시·값에 남지 않는다 (0.7 + 0.1 = 0.8)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="수량" defaultValue={0.7} step={0.1} onValueChange={onValueChange} />);
    input().focus();
    await user.keyboard('{ArrowUp}');
    // 0.7 + 0.1 은 0.7999999999999999 — 자릿수만 자르면 "0.7" 로 보인다
    expect(input().value).toBe('0.8');
    expect(onValueChange).toHaveBeenLastCalledWith(0.8);
  });

  it('min 이 0 이상이면 "-" 를 받지 않고, 음수를 허용하면 받는다', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<NumberInput label="수량" min={0} />);
    await user.type(input(), '-5');
    expect(input().value).toBe('5');
    unmount();
    render(<NumberInput label="수량" min={-10} />);
    await user.type(input(), '-5');
    expect(input().value).toBe('-5');
    expect(input().getAttribute('aria-valuenow')).toBe('-5');
  });

  it('입력 중에는 범위 밖 값도 받고, 포커스가 빠지면 범위 안으로 맞춘다', async () => {
    const user = userEvent.setup();
    render(<Controlled min={10} max={50} />);
    await user.type(input(), '5');
    expect(input().value).toBe('5');
    expect(screen.getByTestId('value').textContent).toBe('5');
    await user.tab();
    expect(input().value).toBe('10');
    expect(screen.getByTestId('value').textContent).toBe('10');
  });

  it('"-" 만 남기고 나가면 비운다', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="수량" />);
    await user.type(input(), '-');
    expect(input().value).toBe('-');
    await user.tab();
    expect(input().value).toBe('');
  });

  it('비어 있을 때 ↑ 를 누르면 0 에서(범위 밖이면 가까운 끝에서) 시작한다', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="수량" min={5} />);
    input().focus();
    await user.keyboard('{ArrowUp}');
    expect(input().value).toBe('5');
  });

  it('제어 모드: 바깥 값이 바뀌면 따라간다', () => {
    const { rerender } = render(<NumberInput label="수량" value={1} onValueChange={() => {}} />);
    expect(input().value).toBe('1');
    rerender(<NumberInput label="수량" value={2500} onValueChange={() => {}} />);
    expect(input().value).toBe('2,500');
    rerender(<NumberInput label="수량" value={null} onValueChange={() => {}} />);
    expect(input().value).toBe('');
  });

  it('disabled·readOnly 면 키보드로 바뀌지 않고 버튼이 비활성이다', () => {
    const { rerender } = render(<NumberInput label="수량" defaultValue={1} readOnly />);
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().value).toBe('1');
    expect(increment().disabled).toBe(true);
    rerender(<NumberInput label="수량" defaultValue={1} disabled />);
    expect(increment().disabled).toBe(true);
  });

  it('name 을 주면 쉼표 없는 숫자로 제출된다', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <NumberInput label="수량" name="qty" />
      </form>,
    );
    await user.type(input(), '1234');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('qty')).toBe('1234');
  });

  it('hideStepper 면 버튼이 없다', () => {
    render(<NumberInput label="수량" hideStepper />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('버튼 이름은 LocaleProvider 로 바꿀 수 있다', () => {
    render(
      <LocaleProvider messages={en}>
        <NumberInput label="수량" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Increase' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeTruthy();
  });
});
