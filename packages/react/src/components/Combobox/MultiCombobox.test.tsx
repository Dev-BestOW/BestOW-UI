import { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComboboxOption } from './Combobox';
import { MultiCombobox } from './MultiCombobox';

const regions: ComboboxOption[] = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구', disabled: true },
  { value: 'incheon', label: '인천' },
  { value: 'gwangju', label: '광주' },
];

const input = () => screen.getByRole('combobox', { name: '지역' }) as HTMLInputElement;
const chips = () =>
  screen.queryByRole('list', { name: '고른 항목' })
    ? within(screen.getByRole('list', { name: '고른 항목' }))
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    : [];
const activeOption = () => {
  const id = input().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};
const status = () => screen.getByRole('status');

describe('MultiCombobox', () => {
  it('목록은 aria-multiselectable 이고, Enter 로 고르면 칩이 생기며 목록은 열린 채 검색어만 지운다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiCombobox label="지역" options={regions} onValueChange={onValueChange} />);

    await user.type(input(), '부');
    expect(screen.getByRole('listbox', { name: '지역' }).getAttribute('aria-multiselectable')).toBe('true');
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith(['busan']);
    expect(chips()).toEqual(['부산']);
    expect(input().value).toBe('');
    // 열린 채로 전체 목록이 보이고, 방금 고른 항목을 가리킨다
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(5);
    expect(activeOption()?.textContent).toBe('부산');
    expect(activeOption()?.getAttribute('aria-selected')).toBe('true');
  });

  it('고른 항목을 다시 고르면 풀린다 (토글), 칩은 고른 순서대로다', async () => {
    const user = userEvent.setup();
    render(<MultiCombobox label="지역" options={regions} />);
    input().focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}'); // 부산
    await user.keyboard('{ArrowUp}{Enter}'); // 서울
    expect(chips()).toEqual(['부산', '서울']);
    await user.keyboard('{ArrowDown}{Enter}'); // 부산 다시 → 풀림
    expect(chips()).toEqual(['서울']);
  });

  it('마우스로 항목을 누르면 토글되고, 비활성 항목은 고를 수 없다', async () => {
    const user = userEvent.setup();
    render(<MultiCombobox label="지역" options={regions} />);
    await user.click(screen.getByRole('button', { name: '목록 열기' }));
    await user.click(screen.getByRole('option', { name: '인천' }));
    await user.click(screen.getByRole('option', { name: '대구' }));
    expect(chips()).toEqual(['인천']);
    expect(screen.getByRole('listbox')).toBeTruthy(); // 열린 채
  });

  it('빈 입력창에서 Backspace 로 마지막 칩을 지우고, 잠시 뒤 "… 삭제됨" 을 알린다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onValueChange = vi.fn();
      render(
        <MultiCombobox
          label="지역"
          options={regions}
          defaultValue={['seoul', 'busan']}
          onValueChange={onValueChange}
        />,
      );
      input().focus();
      await user.keyboard('{Backspace}');
      expect(onValueChange).toHaveBeenLastCalledWith(['seoul']);
      expect(chips()).toEqual(['서울']);
      expect(document.activeElement).toBe(input());
      expect(status().textContent).toBe('');
      act(() => vi.advanceTimersByTime(500));
      expect(status().textContent).toBe('부산 삭제됨');

      // 검색어가 있으면 Backspace 는 글자만 지운다
      await user.keyboard('인');
      await user.keyboard('{Backspace}');
      expect(chips()).toEqual(['서울']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('칩 삭제 버튼은 Tab 순서에 있고, 지우면 포커스가 다음 칩 → 앞 칩 → 입력창으로 간다', async () => {
    const user = userEvent.setup();
    render(<MultiCombobox label="지역" options={regions} defaultValue={['seoul', 'busan', 'incheon']} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '서울 삭제' }));

    await user.tab(); // 부산
    await user.keyboard('{Enter}');
    expect(chips()).toEqual(['서울', '인천']);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '인천 삭제' }));

    await user.keyboard('{Delete}'); // 마지막 칩 → 앞 칩으로
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '서울 삭제' }));

    await user.keyboard('{Backspace}'); // 하나도 없으면 입력창으로
    expect(chips()).toEqual([]);
    expect(screen.queryByRole('list', { name: '고른 항목' })).toBeNull();
    expect(document.activeElement).toBe(input());
  });

  it('maxSelected 만큼 고르면 나머지는 비활성이 되고 안내가 칸 설명으로 연결된다', async () => {
    const user = userEvent.setup();
    render(<MultiCombobox label="지역" options={regions} maxSelected={2} defaultValue={['seoul']} />);
    input().focus();
    await user.keyboard('{ArrowDown}');
    await user.click(screen.getByRole('option', { name: '부산' }));

    const note = screen.getByText('최대 2개까지 고를 수 있어요');
    expect(input().getAttribute('aria-describedby')).toContain(note.id);
    expect(screen.getByRole('option', { name: '인천' }).getAttribute('aria-disabled')).toBe('true');
    await user.click(screen.getByRole('option', { name: '인천' }));
    expect(chips()).toEqual(['서울', '부산']);

    // 고른 항목은 풀 수 있고, 풀면 다시 고를 수 있다
    await user.click(screen.getByRole('option', { name: '서울' }));
    expect(screen.queryByText('최대 2개까지 고를 수 있어요')).toBeNull();
    await user.click(screen.getByRole('option', { name: '인천' }));
    expect(chips()).toEqual(['부산', '인천']);
  });

  it('Esc 는 닫고 검색어를 지우지만 고른 값은 그대로다', async () => {
    const user = userEvent.setup();
    render(<MultiCombobox label="지역" options={regions} defaultValue={['seoul']} />);
    await user.type(input(), '부');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(input().value).toBe('');
    expect(chips()).toEqual(['서울']);
  });

  it('한글 조합 중의 Enter 는 고르지 않는다', async () => {
    render(<MultiCombobox label="지역" options={regions} />);
    fireEvent.change(input(), { target: { value: '부' } });
    fireEvent.keyDown(input(), { key: 'Enter', keyCode: 229 });
    expect(chips()).toEqual([]);
  });

  it('clearable 이면 "선택 지우기" 로 모두 지운다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiCombobox
        label="지역"
        options={regions}
        defaultValue={['seoul', 'busan']}
        clearable
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: '선택 지우기' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(chips()).toEqual([]);
    expect(document.activeElement).toBe(input());
    expect(screen.queryByRole('button', { name: '선택 지우기' })).toBeNull();
  });

  it('제어 모드: value 대로 칩을 그리고, options 에 없는 값은 값 그대로 보인다. name 이면 값마다 제출된다', async () => {
    const user = userEvent.setup();
    function Example() {
      const [values, setValues] = useState<string[]>(['jeju']);
      return (
        <form aria-label="폼">
          <MultiCombobox label="지역" name="regions" options={regions} value={values} onValueChange={setValues} />
        </form>
      );
    }
    render(<Example />);
    expect(chips()).toEqual(['jeju']);
    await user.type(input(), '서{Enter}');
    expect(chips()).toEqual(['jeju', '서울']);
    const data = new FormData(screen.getByRole('form', { name: '폼' }) as HTMLFormElement);
    expect(data.getAll('regions')).toEqual(['jeju', 'seoul']);
  });

  it('removeLabel 로 칩 삭제 버튼 이름을 바꾼다, 비활성이면 칩도 지울 수 없다', () => {
    const { rerender } = render(
      <MultiCombobox label="지역" options={regions} defaultValue={['seoul']} removeLabel={(l) => `${l} 빼기`} />,
    );
    expect(screen.getByRole('button', { name: '서울 빼기' })).toBeTruthy();
    rerender(<MultiCombobox label="지역" options={regions} defaultValue={['seoul']} disabled />);
    expect((screen.getByRole('button', { name: '서울 삭제' }) as HTMLButtonElement).disabled).toBe(true);
    expect(input().disabled).toBe(true);
  });

  it('error·helperText·required 를 접근성 속성으로 연결한다', () => {
    render(<MultiCombobox label="지역" options={regions} error helperText="하나 이상 고르세요" required />);
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-required')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toBe(screen.getByText('하나 이상 고르세요').id);
  });
});
