import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themeClass } from '../../theme/contract.css';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

function Example({ onEdit = () => {}, onDelete = () => {} }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>더보기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>문서</DropdownMenuLabel>
          <DropdownMenuItem icon={<svg data-testid="edit-icon" />} shortcut="⌘E" onSelect={onEdit}>
            편집
          </DropdownMenuItem>
          <DropdownMenuItem disabled>공유 (권한 없음)</DropdownMenuItem>
          <DropdownMenuItem>복제</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem color="danger" onSelect={onDelete}>
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const trigger = () => screen.getByRole('button', { name: '더보기' });

describe('DropdownMenu', () => {
  it('닫혀 있을 때 트리거에 aria-haspopup / aria-expanded=false 가 있다', () => {
    render(<Example />);
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('클릭하면 menu 가 열리고 항목·그룹·구분선 역할을 갖춘다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const button = trigger();
    await user.click(button);

    const menu = screen.getByRole('menu');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-labelledby')).toBe(button.id);
    // 모달 메뉴라 열린 동안 바깥 요소는 보조기술에서 숨겨진다
    expect(screen.queryByRole('button', { name: '더보기' })).toBeNull();
    const items = screen.getAllByRole('menuitem');
    const names = ['편집', '공유 (권한 없음)', '복제', '삭제'];
    expect(items).toHaveLength(names.length);
    names.forEach((name, i) => expect(screen.getByRole('menuitem', { name })).toBe(items[i]));
    expect(screen.getByRole('group')).toBeTruthy();
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  it('아이콘과 단축키는 보이지만 항목 이름에는 섞이지 않는다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());

    const edit = screen.getByRole('menuitem', { name: '편집' });
    expect(edit.textContent).toBe('편집⌘E');
    expect(screen.getByText('⌘E').getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByTestId('edit-icon').parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  it('항목을 클릭하면 onSelect 가 호출되고 메뉴가 닫히며 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    await user.click(trigger());
    await user.click(screen.getByRole('menuitem', { name: '편집' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('키보드: Enter 로 열면 첫 항목에 포커스, 방향키는 disabled 항목을 건너뛰고, Enter 로 선택한다', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    trigger().focus();

    await user.keyboard('{Enter}');
    expect(document.activeElement?.textContent).toBe('편집⌘E');

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement?.textContent).toBe('복제');

    await user.keyboard('{End}');
    expect(document.activeElement?.textContent).toBe('삭제');

    await user.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('disabled 항목은 aria-disabled 이고 선택되지 않는다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    const disabled = screen.getByRole('menuitem', { name: '공유 (권한 없음)' });
    expect(disabled.getAttribute('aria-disabled')).toBe('true');

    await user.click(disabled);
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('Escape 로 닫히고 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('portal 로 렌더링돼도 다크 테마 클래스를 붙인다', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme="dark">
        <Example />
      </ThemeProvider>,
    );
    await user.click(trigger());
    const menu = screen.getByRole('menu');
    expect(menu.closest('[data-theme]')).toBeNull();
    expect(menu.classList.contains(themeClass.dark)).toBe(true);
  });

  it('deprecated color="default" 는 neutral 과 같은 스타일이고 개발 모드에서 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <Button>열기</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem color="neutral">새 이름</DropdownMenuItem>
          <DropdownMenuItem color="default">옛 이름</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByRole('menuitem', { name: '옛 이름' }).className).toBe(
      screen.getByRole('menuitem', { name: '새 이름' }).className,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('color="neutral"'));
    warn.mockRestore();
  });
});
