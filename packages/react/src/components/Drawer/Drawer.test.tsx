import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themeClass } from '../../theme/contract.css';
import { createTheme } from '../../theme/createTheme';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../DropdownMenu';
import { Drawer, DrawerClose } from './Drawer';

describe('Drawer', () => {
  it('trigger 를 누르면 열리고, 제목이 dialog 이름·설명이 aria-describedby 로 연결된다', async () => {
    const user = userEvent.setup();
    render(<Drawer trigger={<button type="button">필터</button>} title="필터" description="조건을 고르세요" />);
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: '필터' }));
    const dialog = screen.getByRole('dialog', { name: '필터' });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('조건을 고르세요').id);
  });

  it('Esc 로 닫히고 포커스가 trigger 로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Drawer trigger={<button type="button">열기</button>} title="패널" />);
    const trigger = screen.getByRole('button', { name: '열기' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('닫기(X) 버튼과 DrawerClose 로 닫는다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Drawer defaultOpen onOpenChange={onOpenChange} title="패널" />);
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    rerender(
      <Drawer
        open
        onOpenChange={onOpenChange}
        title="패널"
        footer={
          <DrawerClose asChild>
            <button type="button">취소</button>
          </DrawerClose>
        }
      />,
    );
    onOpenChange.mockClear();
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('hideCloseButton 이면 X 버튼이 없다', () => {
    render(<Drawer defaultOpen hideCloseButton title="패널" />);
    expect(screen.queryByRole('button', { name: '닫기' })).toBeNull();
  });

  it('side 를 data-side 로 알리고, 기본은 right 다', () => {
    const { rerender } = render(<Drawer open title="패널" />);
    expect(screen.getByRole('dialog').getAttribute('data-side')).toBe('right');
    rerender(<Drawer open side="bottom" title="패널" />);
    expect(screen.getByRole('dialog').getAttribute('data-side')).toBe('bottom');
  });

  it('portal 로 body 에 렌더링돼도 바깥 ThemeProvider 의 모드와 브랜드 오버라이드를 따른다', () => {
    const brand = createTheme({ common: { color: { primary: { solid: '#7c3aed' } } } });
    render(
      <ThemeProvider theme="dark" overrides={brand} data-testid="provider">
        <Drawer open title="패널" />
      </ThemeProvider>,
    );
    const dialog = screen.getByRole('dialog');
    expect(screen.getByTestId('provider').contains(dialog)).toBe(false);
    expect(dialog.classList.contains(themeClass.dark)).toBe(true);
    expect(dialog.style.getPropertyValue('--bestow-color-primary-solid')).toBe('#7c3aed');
  });

  it('메뉴 항목에서 연(trigger 없는) Drawer 를 닫으면 메뉴 버튼으로 포커스가 돌아간다', async () => {
    function MenuThenDrawer() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>행 작업</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpen(true)}>상세 보기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Drawer title="상세" open={open} onOpenChange={setOpen}>
            내용
          </Drawer>
        </>
      );
    }
    const user = userEvent.setup();
    render(<MenuThenDrawer />);
    screen.getByRole('button', { name: '행 작업' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Enter}'); // 첫 항목 "상세 보기"
    expect(screen.getByRole('dialog', { name: '상세' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '행 작업' }));
  });
});
