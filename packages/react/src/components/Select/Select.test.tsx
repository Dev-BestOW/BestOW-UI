import { fireEvent, render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
];

describe('Select', () => {
  it('label 과 트리거를 연결하고 placeholder 를 보여준다', () => {
    render(<Select label="과일" placeholder="선택하세요" options={options} />);
    const trigger = screen.getByRole('combobox', { name: '과일' });
    expect(trigger.textContent).toContain('선택하세요');
  });

  it('defaultValue 의 label 을 보여준다', () => {
    render(<Select label="과일" defaultValue="banana" options={options} />);
    expect(screen.getByRole('combobox').textContent).toContain('바나나');
  });

  it('옵션을 선택하면 onValueChange 가 호출된다', () => {
    const onValueChange = vi.fn();
    render(<Select label="과일" options={options} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    fireEvent.click(screen.getByRole('option', { name: '사과' }));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작하고 경고가 없다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<Select label="과일" placeholder="선택하세요" options={options} value={undefined} />);
    expect(screen.getByRole('combobox').textContent).toContain('선택하세요');

    rerender(<Select label="과일" placeholder="선택하세요" options={options} value="banana" />);
    expect(screen.getByRole('combobox').textContent).toContain('바나나');

    rerender(<Select label="과일" placeholder="선택하세요" options={options} value={undefined} />);
    expect(screen.getByRole('combobox').textContent).toContain('선택하세요');

    const messages = [...warn.mock.calls, ...error.mock.calls].flat().join(' ');
    expect(messages).not.toMatch(/uncontrolled|controlled/);
    warn.mockRestore();
    error.mockRestore();
  });

  it('error 이면 aria-invalid 와 helperText 를 연결한다', () => {
    render(<Select label="과일" options={options} error helperText="필수예요" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe(screen.getByText('필수예요').id);
  });
});
