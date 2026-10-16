import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox, type ComboboxOption } from './Combobox';

const fruits: ComboboxOption[] = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'grape', label: '포도', disabled: true },
  { value: 'pear', label: '배' },
  { value: 'pineapple', label: '파인애플' },
];

const input = () => screen.getByRole('combobox', { name: '과일' });
const activeOption = () => {
  const id = input().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};

describe('Combobox', () => {
  it('label 이 입력창(combobox) 이름이 되고, 닫혀 있으면 aria-expanded=false 이며 목록이 없다', () => {
    render(<Combobox label="과일" options={fruits} />);
    expect(input().getAttribute('aria-expanded')).toBe('false');
    expect(input().getAttribute('aria-autocomplete')).toBe('list');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('↓ 로 열고 이동(비활성 항목은 건너뜀), Enter 로 선택하면 입력창에 이름이 들어가고 닫힌다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="과일" options={fruits} onValueChange={onValueChange} />);
    input().focus();

    await user.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox', { name: '과일' });
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(input().getAttribute('aria-controls')).toBe(listbox.id);
    expect(activeOption()?.textContent).toBe('사과');

    await user.keyboard('{ArrowDown}{ArrowDown}'); // 바나나 → (포도 건너뜀) → 배
    expect(activeOption()?.textContent).toBe('배');
    expect(document.activeElement).toBe(input()); // 포커스는 입력창에 그대로

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('pear');
    expect((input() as HTMLInputElement).value).toBe('배');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('입력하면 목록을 거르고, 결과가 없으면 안내를 보여 준다', async () => {
    const user = userEvent.setup();
    render(<Combobox label="과일" options={fruits} />);
    await user.type(input(), '파');
    const listbox = screen.getByRole('listbox', { name: '과일' });
    expect(
      within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['파인애플']);

    await user.type(input(), '없음');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('결과가 없어요');
    expect(input().hasAttribute('aria-controls')).toBe(false);
  });

  it('Esc 로 닫으면 입력하던 글자를 지우고 선택된 이름으로 되돌린다', async () => {
    const user = userEvent.setup();
    render(<Combobox label="과일" options={fruits} defaultValue="apple" />);
    expect((input() as HTMLInputElement).value).toBe('사과');
    await user.clear(input());
    await user.type(input(), '바');
    expect(screen.getByRole('listbox')).toBeTruthy();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect((input() as HTMLInputElement).value).toBe('사과');
  });

  it('마우스로 항목을 누르면 선택되고, 선택된 항목은 aria-selected 다', async () => {
    const user = userEvent.setup();
    render(<Combobox label="과일" options={fruits} defaultValue="banana" />);
    await user.click(screen.getByRole('button', { name: '목록 열기' }));
    expect(screen.getByRole('option', { name: '바나나' }).getAttribute('aria-selected')).toBe('true');

    await user.click(screen.getByRole('option', { name: '파인애플' }));
    expect((input() as HTMLInputElement).value).toBe('파인애플');
    expect(document.activeElement).toBe(input());
  });

  it('비활성 항목은 눌러도 선택되지 않는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="과일" options={fruits} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: '목록 열기' }));
    await user.click(screen.getByRole('option', { name: '포도' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작하고, name 이 있으면 선택 값을 form 에 제출한다', async () => {
    const user = userEvent.setup();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Controlled() {
      const [value, setValue] = useState<string>();
      return <Combobox label="과일" name="fruit" options={fruits} value={value} onValueChange={setValue} />;
    }
    const { container } = render(<Controlled />);
    input().focus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect((input() as HTMLInputElement).value).toBe('사과');
    expect(container.querySelector<HTMLInputElement>('input[type=hidden][name=fruit]')?.value).toBe('apple');
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/uncontrolled|controlled/);
    error.mockRestore();
  });

  it('error·helperText·required 를 접근성 속성으로 연결한다', () => {
    render(<Combobox label="과일" options={fruits} error helperText="하나를 골라 주세요" required />);
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-required')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toBe(screen.getByText('하나를 골라 주세요').id);
  });

  describe('선택 지우기', () => {
    it('글자를 모두 지우고 포커스를 옮기면 선택이 지워지고 onValueChange("") 가 호출된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = render(
        <>
          <Combobox label="과일" name="fruit" options={fruits} defaultValue="apple" onValueChange={onValueChange} />
          <button type="button">다음</button>
        </>,
      );
      await user.clear(input());
      await user.tab();
      expect((input() as HTMLInputElement).value).toBe('');
      expect(onValueChange).toHaveBeenCalledWith('');
      expect(container.querySelector<HTMLInputElement>('input[type=hidden][name=fruit]')?.value).toBe('');
    });

    it('글자를 모두 지운 채 Enter 를 누르면 첫 항목이 아니라 선택 지우기가 된다 (제어 모드)', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('banana');
        return (
          <>
            <Combobox label="과일" options={fruits} value={value} onValueChange={setValue} />
            <span data-testid="value">{value}</span>
          </>
        );
      }
      render(<Controlled />);
      await user.clear(input());
      expect(input().getAttribute('aria-activedescendant')).toBeNull();
      await user.keyboard('{Enter}');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect((input() as HTMLInputElement).value).toBe('');
      expect(screen.getByTestId('value').textContent).toBe('');
    });

    it('글자를 모두 지운 뒤 다른 항목을 고르면 그 항목이 선택된다 (지우기로 처리하지 않는다)', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Combobox label="과일" options={fruits} defaultValue="apple" onValueChange={onValueChange} />);
      await user.clear(input());
      await user.click(screen.getByRole('option', { name: '배' }));
      expect((input() as HTMLInputElement).value).toBe('배');
      expect(onValueChange.mock.calls).toEqual([['pear']]);
    });

    it('clearable 이면 값이 있을 때만 "선택 지우기" 버튼이 보이고, 누르면 지우고 입력창에 포커스를 둔다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Combobox label="과일" options={fruits} clearable onValueChange={onValueChange} />);
      expect(screen.queryByRole('button', { name: '선택 지우기' })).toBeNull();
      input().focus();
      await user.keyboard('{ArrowDown}{Enter}');
      expect((input() as HTMLInputElement).value).toBe('사과');

      await user.click(screen.getByRole('button', { name: '선택 지우기' }));
      expect((input() as HTMLInputElement).value).toBe('');
      expect(onValueChange).toHaveBeenLastCalledWith('');
      expect(document.activeElement).toBe(input());
      expect(screen.queryByRole('button', { name: '선택 지우기' })).toBeNull();
    });
  });
});
