import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themeClass } from '../../theme/contract.css';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import { Popover, PopoverClose, type PopoverProps } from './Popover';

function Example(props: Partial<PopoverProps>) {
  return (
    <>
      <Popover
        title="공유 설정"
        content={
          <>
            <label>
              이메일
              <input />
            </label>
            <PopoverClose asChild>
              <Button>완료</Button>
            </PopoverClose>
          </>
        }
        {...props}
      >
        <Button>공유</Button>
      </Popover>
      <button type="button">바깥 버튼</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: '공유' });

describe('Popover', () => {
  it('닫혀 있을 때 트리거에 aria-haspopup="dialog" / aria-expanded=false 가 있다', () => {
    render(<Example />);
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('클릭하면 title 을 이름으로 가진 dialog 가 열리고, 트리거와 aria-controls 로 연결된다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());

    const dialog = screen.getByRole('dialog', { name: '공유 설정' });
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(dialog.id);
    expect(screen.getByRole('heading', { name: '공유 설정' })).toBeTruthy();
  });

  it('title 이 없으면 aria-label 을 이름으로 쓴다', async () => {
    const user = userEvent.setup();
    render(<Example title={undefined} aria-label="빠른 공유" />);
    await user.click(trigger());
    expect(screen.getByRole('dialog', { name: '빠른 공유' })).toBeTruthy();
  });

  it('열리면 내용 안의 첫 포커스 가능한 요소로 포커스가 이동한다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '이메일' }));
  });

  it('Escape 로 닫히고 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('바깥을 클릭하면 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '바깥 버튼' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('PopoverClose 로 감싼 버튼과 showClose 의 X 버튼으로 닫을 수 있다', async () => {
    const user = userEvent.setup();
    render(<Example showClose />);

    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '완료' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('showClose 를 주지 않으면 X 버튼이 없다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(screen.queryByRole('button', { name: '닫기' })).toBeNull();
  });

  it('제어 모드: open 과 onOpenChange 로 열림 상태를 관리한다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Example
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }
    render(<Controlled />);

    await user.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('portal 로 렌더링돼도 다크 테마 클래스를 붙인다', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme="dark">
        <Example />
      </ThemeProvider>,
    );
    await user.click(trigger());
    const dialog = screen.getByRole('dialog');
    expect(dialog.closest('[data-theme]')).toBeNull();
    expect(dialog.classList.contains(themeClass.dark)).toBe(true);
  });
});
