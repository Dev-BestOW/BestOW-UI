import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const radio = (name: string) => screen.getByRole('radio', { name }) as HTMLInputElement;

const options = [
  { value: 'monthly', label: '월간', description: '매달 결제' },
  { value: 'yearly', label: '연간' },
  { value: 'lifetime', label: '평생', disabled: true },
];

describe('RadioGroup', () => {
  it('그룹 label 과 각 radio 의 label 을 연결한다', () => {
    render(<RadioGroup label="결제 주기" options={options} />);
    expect(screen.getByRole('radiogroup', { name: '결제 주기' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: '월간' })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('보조 설명은 이름이 아니라 설명(aria-describedby)으로 연결한다', () => {
    render(<RadioGroup label="결제 주기" options={options} />);
    const monthly = screen.getByRole('radio', { name: '월간' });
    expect(monthly.getAttribute('aria-describedby')).toBe(screen.getByText('매달 결제').id);
  });

  it('label 을 클릭하면 선택되고 onValueChange 가 호출된다', () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="결제 주기" options={options} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByText('연간'));
    expect(onValueChange).toHaveBeenCalledWith('yearly');
    expect(radio('연간').checked).toBe(true);
  });

  it('비활성 선택지는 선택되지 않는다', () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="결제 주기" options={options} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByText('평생'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('error 이면 aria-invalid 와 helperText 를 그룹에 연결한다', () => {
    render(<RadioGroup label="결제 주기" options={options} error helperText="선택해 주세요" />);
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('선택해 주세요').id);
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<RadioGroup label="결제" options={options} value={undefined} />);
    expect(radio('월간').checked).toBe(false);
    rerender(<RadioGroup label="결제" options={options} value="monthly" />);
    expect(radio('월간').checked).toBe(true);
    expect([...warn.mock.calls, ...error.mock.calls].flat().join(' ')).not.toMatch(/controlled/);
    warn.mockRestore();
    error.mockRestore();
  });

  it('제어 모드에서 부모가 값을 바꾸지 않으면 선택이 그대로다', () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="결제" options={options} value="monthly" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '연간' }));
    expect(onValueChange).toHaveBeenCalledWith('yearly');
    expect(radio('월간').checked).toBe(true);
    expect(radio('연간').checked).toBe(false);
  });

  it('비제어 모드: defaultValue 로 시작하고 고르면 바뀐다. 선택한 것을 다시 눌러도 onValueChange 는 부르지 않는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup label="결제" options={options} defaultValue="monthly" onValueChange={onValueChange} />);
    expect(radio('월간').checked).toBe(true);
    await user.click(screen.getByRole('radio', { name: '월간' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('radio', { name: '연간' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(radio('연간').checked).toBe(true);
    expect(radio('월간').checked).toBe(false);
  });

  it('비활성 선택지는 disabled, 그룹 disabled 이면 모두 disabled', () => {
    const { rerender } = render(<RadioGroup label="결제" options={options} />);
    expect(radio('평생').disabled).toBe(true);
    expect(radio('월간').disabled).toBe(false);
    rerender(<RadioGroup label="결제" options={options} disabled />);
    (screen.getAllByRole('radio') as HTMLInputElement[]).forEach((el) => expect(el.disabled).toBe(true));
  });

  it('ref 는 radiogroup 요소, required 면 그룹에 aria-required 와 각 radio 에 required', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadioGroup ref={ref} label="결제" options={options} required />);
    const group = screen.getByRole('radiogroup', { name: '결제' });
    expect(ref.current).toBe(group);
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(radio('월간').required).toBe(true);
  });

  it('name 을 주면 선택한 값이 폼에 제출된다', () => {
    render(
      <form data-testid="form">
        <RadioGroup label="결제" name="billing" options={options} defaultValue="yearly" />
      </form>,
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('billing')).toBe('yearly');
  });

  it('name 이 없으면 만든 이름으로 묶기만 하고 폼에는 제출하지 않는다', () => {
    render(
      <form data-testid="form">
        <RadioGroup label="결제" options={options} defaultValue="yearly" />
      </form>,
    );
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(new Set(radios.map((el) => el.name)).size).toBe(1);
    expect([...new FormData(screen.getByTestId('form') as HTMLFormElement).keys()]).toEqual([]);
  });
});
