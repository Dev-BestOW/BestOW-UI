import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('label 을 클릭하면 체크된다', () => {
    render(<Checkbox label="동의" />);
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox', { name: '동의' });
    fireEvent.click(screen.getByText('동의'));
    expect(checkbox.checked).toBe(true);
  });

  it('indeterminate 를 DOM 프로퍼티로 반영한다', () => {
    const { rerender } = render(<Checkbox label="전체" indeterminate />);
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
    expect(checkbox.indeterminate).toBe(true);
    rerender(<Checkbox label="전체" indeterminate={false} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('외부 ref 도 input 을 가리킨다', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="동의" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('onCheckedChange 는 체크 상태(boolean)를, onChange 는 이벤트를 받는다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(<Checkbox label="동의" onCheckedChange={onCheckedChange} onChange={onChange} />);
    await user.click(screen.getByRole('checkbox', { name: '동의' }));
    await user.click(screen.getByRole('checkbox', { name: '동의' }));
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
