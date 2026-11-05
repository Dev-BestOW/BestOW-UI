import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { SearchInput } from './SearchInput';

const box = () => screen.getByRole('searchbox') as HTMLInputElement;
const clearButton = () => screen.queryByRole('button', { name: '검색어 지우기' });

describe('SearchInput', () => {
  it('레이블이 없으면 이름이 "검색" 이고, 레이블이 있으면 그 레이블을 쓴다', () => {
    const { rerender } = render(<SearchInput />);
    expect(screen.getByRole('searchbox', { name: '검색' })).toBe(box());
    expect(box().getAttribute('enterkeyhint')).toBe('search');
    rerender(<SearchInput label="주문 검색" />);
    expect(screen.getByRole('searchbox', { name: '주문 검색' })).toBe(box());
    rerender(<SearchInput aria-label="상품 찾기" />);
    expect(screen.getByRole('searchbox', { name: '상품 찾기' })).toBe(box());
  });

  it('글자가 있을 때만 지우기 버튼이 있고, 누르면 지우고 입력창으로 포커스를 돌린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SearchInput onValueChange={onValueChange} />);
    expect(clearButton()).toBeNull();
    await user.type(box(), '사과');
    expect(onValueChange).toHaveBeenLastCalledWith('사과');
    expect(clearButton()!.getAttribute('tabindex')).toBe('-1');
    // 입력창 밖으로 나간 뒤에 눌러도 입력창으로 돌아온다 (지우기 버튼은 Tab 순서에 없어 Tab 이면 밖으로 나간다)
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    await user.click(clearButton()!);
    expect(box().value).toBe('');
    expect(document.activeElement).toBe(box());
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(clearButton()).toBeNull();
  });

  it('Enter 는 onSearch 를 부른다', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    await user.type(box(), '배송{Enter}');
    expect(onSearch).toHaveBeenCalledWith('배송');
  });

  it.each([
    ['조합 중(isComposing)', { isComposing: true }],
    ['조합 직후 Safari(keyCode 229)', { keyCode: 229 }],
  ])('한글 %s Enter 는 검색하지 않는다', (_, init) => {
    const onSearch = vi.fn();
    render(<SearchInput defaultValue="배" onSearch={onSearch} />);
    fireEvent.keyDown(box(), { key: 'Enter', ...init });
    expect(onSearch).not.toHaveBeenCalled();
    fireEvent.keyDown(box(), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('배');
  });

  it('Escape 는 검색어를 지우고, 빈 칸에서는 기본 동작을 막지 않는다', () => {
    render(<SearchInput defaultValue="사과" />);
    expect(fireEvent.keyDown(box(), { key: 'Escape' })).toBe(false);
    expect(box().value).toBe('');
    expect(fireEvent.keyDown(box(), { key: 'Escape' })).toBe(true);
  });

  it('제어 모드는 value 를 따르고 바뀔 값을 알린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SearchInput value="사" onValueChange={onValueChange} />);
    await user.type(box(), '과');
    expect(onValueChange).toHaveBeenCalledWith('사과');
    expect(box().value).toBe('사');
    await user.click(clearButton()!);
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('비활성·읽기 전용이면 지우기 버튼이 없다', () => {
    const { rerender } = render(<SearchInput defaultValue="사과" disabled />);
    expect(clearButton()).toBeNull();
    rerender(<SearchInput defaultValue="사과" readOnly />);
    expect(clearButton()).toBeNull();
  });

  it('startAdornment={null} 이면 돋보기를 뺀다', () => {
    const { container, rerender } = render(<SearchInput />);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<SearchInput startAdornment={null} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('비제어 모드는 form reset 에 처음 검색어로 돌아가며 알린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form>
        <SearchInput defaultValue="사과" onValueChange={onValueChange} />
      </form>,
    );
    await user.type(box(), '즙');
    onValueChange.mockClear();
    act(() => document.querySelector('form')!.reset());
    expect(box().value).toBe('사과');
    expect(onValueChange).toHaveBeenCalledWith('사과');
  });

  it('LocaleProvider 문구를 쓴다', () => {
    render(
      <LocaleProvider messages={en}>
        <SearchInput defaultValue="a" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBe(box());
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
  });
});
