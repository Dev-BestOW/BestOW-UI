import { fireEvent, render, screen } from '@testing-library/react';
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
});
