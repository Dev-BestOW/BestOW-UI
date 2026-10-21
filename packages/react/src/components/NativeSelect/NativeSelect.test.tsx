import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NativeSelect } from './NativeSelect';

const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리', disabled: true },
];

describe('NativeSelect', () => {
  it('label 과 연결된 select 이고, placeholder 로 시작한다', () => {
    render(<NativeSelect label="과일" placeholder="선택하세요" options={options} />);
    const select = screen.getByRole('combobox', { name: '과일' }) as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    expect(select.value).toBe('');
    expect(select.selectedOptions[0]?.textContent).toBe('선택하세요');
    // placeholder 는 다시 고를 수 없다
    expect((screen.getByRole('option', { name: '선택하세요' }) as HTMLOptionElement).disabled).toBe(true);
  });

  it('고르면 onValueChange 와 네이티브 onChange 를 모두 부른다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<NativeSelect label="과일" options={options} onValueChange={onValueChange} onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '바나나');
    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('비활성 선택지와 defaultValue 를 반영한다', () => {
    render(<NativeSelect label="과일" options={options} defaultValue="banana" />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('banana');
    expect((screen.getByRole('option', { name: '체리' }) as HTMLOptionElement).disabled).toBe(true);
  });

  it('제어 모드에서는 value 를 따른다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NativeSelect label="과일" options={options} value="apple" onValueChange={onValueChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '바나나');
    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('apple');
  });

  it('helperText·error·required 를 접근성 속성으로 연결한다', () => {
    render(<NativeSelect label="과일" options={options} helperText="하나 골라 주세요" error required />);
    const select = screen.getByRole('combobox', { name: '과일' }) as HTMLSelectElement;
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.required).toBe(true);
    const describedBy = select.getAttribute('aria-describedby')!;
    expect(document.getElementById(describedBy)?.textContent).toBe('하나 골라 주세요');
  });

  it('required + placeholder 이면 고르기 전까지 form 검증에 실패한다', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <NativeSelect label="과일" name="fruit" options={options} placeholder="선택하세요" required />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await user.selectOptions(screen.getByRole('combobox'), '사과');
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('fruit')).toBe('apple');
  });

  it('options 가 없으면 children 을 그린다', () => {
    render(
      <NativeSelect label="지역">
        <optgroup label="수도권">
          <option value="seoul">서울</option>
        </optgroup>
      </NativeSelect>,
    );
    expect(screen.getByRole('group', { name: '수도권' })).toBeTruthy();
    expect(screen.getByRole('option', { name: '서울' })).toBeTruthy();
  });

  it('ref 는 select 를 가리킨다', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<NativeSelect ref={ref} aria-label="과일" options={options} />);
    expect(ref.current).toBe(screen.getByRole('combobox', { name: '과일' }));
  });
});
