import { fireEvent, render, screen } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';

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
    expect(screen.getByRole('radio', { name: '연간' }).getAttribute('aria-checked')).toBe('true');
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
    const { rerender } = render(<RadioGroup label="결제" options={options} value={undefined} />);
    expect(screen.getByRole('radio', { name: '월간' }).getAttribute('aria-checked')).toBe('false');
    rerender(<RadioGroup label="결제" options={options} value="monthly" />);
    expect(screen.getByRole('radio', { name: '월간' }).getAttribute('aria-checked')).toBe('true');
    expect(warn.mock.calls.flat().join(' ')).not.toMatch(/controlled/);
    warn.mockRestore();
  });
});
