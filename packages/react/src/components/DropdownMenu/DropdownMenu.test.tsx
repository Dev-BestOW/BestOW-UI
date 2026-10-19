import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { themeClass } from '../../theme/contract.css';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

  it('1.0 에서 제거한 color="default" 는 타입 오류다 (neutral 이 기본값)', () => {
    // @ts-expect-error -- 0.x 의 옛 이름. 1.0 에서 제거됨 (docs/MIGRATION-1.0.md)
    const removed = <DropdownMenuItem color="default">복제</DropdownMenuItem>;
    expect(removed).toBeTruthy();
  });
});

function ViewMenu({
  initialSort,
  keepOpen = false,
  onSortChange = () => {},
}: {
  initialSort?: string;
  keepOpen?: boolean;
  onSortChange?: (value: string) => void;
}) {
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState<string | undefined>(initialSort);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>보기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={grid}
          onCheckedChange={setGrid}
          onSelect={keepOpen ? (e) => e.preventDefault() : undefined}
        >
          격자로 보기
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>
          숨긴 파일 표시
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked="indeterminate">일부 열 표시</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>정렬</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(v) => {
            setSort(v);
            onSortChange(v);
          }}
        >
          <DropdownMenuRadioItem value="name">이름순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">날짜순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size" disabled>
            크기순
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<svg data-testid="move-icon" />}>이동</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>받은 문서함</DropdownMenuItem>
            <DropdownMenuItem>보관함</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const viewTrigger = () => screen.getByRole('button', { name: '보기' });

describe('DropdownMenu — 체크·라디오 항목과 하위 메뉴', () => {
  it('CheckboxItem 은 menuitemcheckbox + aria-checked, 표시는 이름에 섞이지 않는다', async () => {
    const user = userEvent.setup();
    render(<ViewMenu />);
    await user.click(viewTrigger());

    const grid = screen.getByRole('menuitemcheckbox', { name: '격자로 보기' });
    expect(grid.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('menuitemcheckbox', { name: '숨긴 파일 표시' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('menuitemcheckbox', { name: '일부 열 표시' }).getAttribute('aria-checked')).toBe('mixed');
    // 체크 표시는 켜진 항목에만 그려지고 보조기술에는 숨긴다
    expect(grid.querySelector('svg')?.closest('[aria-hidden="true"]')).toBeTruthy();
    expect(screen.getByRole('menuitemcheckbox', { name: '숨긴 파일 표시' }).querySelector('svg')).toBeNull();
  });

  it('CheckboxItem 을 고르면 상태가 바뀌고 기본으로는 메뉴가 닫힌다', async () => {
    const user = userEvent.setup();
    render(<ViewMenu />);
    await user.click(viewTrigger());
    await user.click(screen.getByRole('menuitemcheckbox', { name: '숨긴 파일 표시' }));
    expect(screen.queryByRole('menu')).toBeNull();

    await user.click(viewTrigger());
    expect(screen.getByRole('menuitemcheckbox', { name: '숨긴 파일 표시' }).getAttribute('aria-checked')).toBe('true');
  });

  it('onSelect 에서 preventDefault 하면 열린 채로 이어서 바꿀 수 있다 (키보드 Space)', async () => {
    const user = userEvent.setup();
    render(<ViewMenu keepOpen />);
    viewTrigger().focus();
    await user.keyboard('{Enter}');
    const grid = screen.getByRole('menuitemcheckbox', { name: '격자로 보기' });
    expect(document.activeElement).toBe(grid);

    await user.keyboard(' ');
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(grid.getAttribute('aria-checked')).toBe('false');
    await user.keyboard(' ');
    expect(grid.getAttribute('aria-checked')).toBe('true');
  });

  it('RadioItem 은 menuitemradio — 하나만 선택되고, 비활성은 고를 수 없다', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<ViewMenu initialSort="name" onSortChange={onSortChange} />);
    await user.click(viewTrigger());

    const checked = () =>
      screen
        .getAllByRole('menuitemradio')
        .filter((el) => el.getAttribute('aria-checked') === 'true')
        .map((el) => el.textContent);
    expect(checked()).toEqual(['이름순']);

    await user.click(screen.getByRole('menuitemradio', { name: '크기순' }));
    expect(onSortChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('menuitemradio', { name: '날짜순' }));
    expect(onSortChange).toHaveBeenCalledWith('date');
    await user.click(viewTrigger());
    expect(checked()).toEqual(['날짜순']);
  });

  it('RadioGroup 의 value 가 처음에 undefined 면 아무것도 선택되지 않고, 고르면 선택된다', async () => {
    const user = userEvent.setup();
    render(<ViewMenu />);
    await user.click(viewTrigger());
    expect(screen.getAllByRole('menuitemradio').every((el) => el.getAttribute('aria-checked') === 'false')).toBe(true);
    await user.click(screen.getByRole('menuitemradio', { name: '이름순' }));
    await user.click(viewTrigger());
    expect(screen.getByRole('menuitemradio', { name: '이름순' }).getAttribute('aria-checked')).toBe('true');
  });

  it('SubTrigger 는 aria-haspopup="menu" — → 로 열어 첫 항목에 포커스, ← 로 닫고 돌아온다', async () => {
    const user = userEvent.setup();
    render(<ViewMenu />);
    viewTrigger().focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{End}');

    const sub = screen.getByRole('menuitem', { name: '이동' });
    expect(document.activeElement).toBe(sub);
    expect(sub.getAttribute('aria-haspopup')).toBe('menu');
    expect(sub.getAttribute('aria-expanded')).toBe('false');
    // 아이콘·화살표 표시는 장식
    expect(screen.getByTestId('move-icon').parentElement?.getAttribute('aria-hidden')).toBe('true');
    expect(sub.textContent).toBe('이동');

    await user.keyboard('{ArrowRight}');
    expect(sub.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('menu')).toHaveLength(2);
    expect(document.activeElement?.textContent).toBe('받은 문서함');

    await user.keyboard('{ArrowLeft}');
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(document.activeElement).toBe(sub);
  });

  it('하위 메뉴 목록도 portal 에서 다크 테마 클래스를 붙인다', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme="dark">
        <ViewMenu />
      </ThemeProvider>,
    );
    viewTrigger().focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{End}');
    await user.keyboard('{ArrowRight}');
    const [, subMenu] = screen.getAllByRole('menu');
    expect(subMenu!.closest('[data-theme]')).toBeNull();
    expect(subMenu!.classList.contains(themeClass.dark)).toBe(true);
  });
});
