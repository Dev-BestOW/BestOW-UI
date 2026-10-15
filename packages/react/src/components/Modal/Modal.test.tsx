import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalClose } from './Modal';

describe('Modal', () => {
  it('trigger 를 누르면 열리고 제목과 설명이 연결된다', () => {
    render(<Modal trigger={<button>열기</button>} title="제목" description="설명" />);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByText('열기'));
    const dialog = screen.getByRole('dialog', { name: '제목' });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('설명').id);
  });

  it('닫기 버튼과 ModalClose 로 닫을 수 있다', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal
        defaultOpen
        onOpenChange={onOpenChange}
        title="제목"
        footer={
          <ModalClose asChild>
            <button>취소</button>
          </ModalClose>
        }
      />,
    );
    fireEvent.click(screen.getByText('취소'));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('hideCloseButton 이면 X 버튼이 없다', () => {
    render(<Modal defaultOpen hideCloseButton title="제목" />);
    expect(screen.queryByRole('button', { name: '닫기' })).toBeNull();
  });

  it('trigger 없이 open 으로 제어해도 닫히면 연 버튼으로 포커스가 돌아간다 (body 로 사라지지 않는다)', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            코드로 열기
          </button>
          <Modal open={open} onOpenChange={setOpen} title="제목" />
        </>
      );
    }
    render(<Controlled />);
    const opener = screen.getByRole('button', { name: '코드로 열기' });
    await user.click(opener);
    expect(screen.getByRole('dialog', { name: '제목' })).toBeTruthy();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });
});
