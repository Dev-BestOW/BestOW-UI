import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert', () => {
  it('제목과 내용을 보여 주고, 기본으로는 role 이 없다 (고정 안내문은 스크린리더가 끼어들어 읽지 않게)', () => {
    const { container } = render(<Alert title="안내">점검이 있어요.</Alert>);
    expect(screen.getByText('안내')).toBeTruthy();
    expect(screen.getByText('점검이 있어요.')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('role')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('role="alert" 를 넘기면 alert 영역이 되고 이름 없이도 내용을 읽을 수 있다', () => {
    render(
      <Alert role="alert" color="danger" title="저장하지 못했어요">
        네트워크를 확인해 주세요.
      </Alert>,
    );
    expect(screen.getByRole('alert').textContent).toContain('저장하지 못했어요');
  });

  it('기본 아이콘은 장식용(aria-hidden)이고, icon={false} 면 표시하지 않는다', () => {
    const { container, rerender } = render(<Alert color="warning">주의</Alert>);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('data-icon')).toBe('TriangleAlert');
    expect(svg?.closest('[aria-hidden="true"]')).not.toBeNull();

    // 직접 넘긴 아이콘(이모지 등)도 장식용으로 감싸 스크린리더가 읽지 않는다
    rerender(<Alert icon={<span data-testid="custom">🎉</span>}>주의</Alert>);
    expect(screen.getByTestId('custom').closest('[aria-hidden="true"]')).not.toBeNull();

    rerender(<Alert icon={false}>주의</Alert>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('color 마다 기본 아이콘이 다르다', () => {
    const icons = (['primary', 'success', 'warning', 'danger'] as const).map((color) => {
      const { container, unmount } = render(<Alert color={color}>내용</Alert>);
      const name = container.querySelector('svg')?.getAttribute('data-icon');
      unmount();
      return name;
    });
    expect(icons).toEqual(['Info', 'CircleCheck', 'TriangleAlert', 'CircleAlert']);
  });

  it('onClose 가 있으면 "닫기" 버튼을 표시하고, 누르면 호출한다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<Alert>내용</Alert>);
    expect(screen.queryByRole('button')).toBeNull();

    rerender(
      <Alert onClose={onClose} closeLabel="알림 닫기">
        내용
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: '알림 닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('action 을 함께 보여 준다', () => {
    render(<Alert action={<button type="button">갱신하기</button>}>구독이 곧 만료돼요.</Alert>);
    expect(screen.getByRole('button', { name: '갱신하기' })).toBeTruthy();
  });

  it('variant·color 에 따라 다른 클래스를 쓴다', () => {
    render(
      <>
        <Alert data-testid="default">기본</Alert>
        <Alert data-testid="danger" variant="solid" color="danger">
          위험
        </Alert>
      </>,
    );
    expect(screen.getByTestId('default').className).not.toBe(screen.getByTestId('danger').className);
  });

  it('ref, className, HTML 속성을 전달한다', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} className="custom" data-testid="alert" id="notice">
        내용
      </Alert>,
    );
    expect(ref.current).toBe(screen.getByTestId('alert'));
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.id).toBe('notice');
  });
});
