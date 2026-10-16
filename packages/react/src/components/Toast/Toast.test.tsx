import { act, fireEvent, render, screen } from '@testing-library/react';
import { ToastProvider, useToast, type ToastOptions } from './Toast';

function Trigger(options: ToastOptions) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>띄우기</button>;
}

describe('Toast', () => {
  it('toast() 로 띄운 내용을 보여준다', () => {
    render(
      <ToastProvider>
        <Trigger title="저장했어요" description="설명" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    expect(screen.getByText('저장했어요')).toBeTruthy();
    expect(screen.getByText('설명')).toBeTruthy();
  });

  it('duration 이 지나면 닫힌다', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger title="잠깐 보여요" duration={1000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    expect(screen.getByText('잠깐 보여요')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByText('잠깐 보여요')).toBeNull();
    vi.useRealTimers();
  });

  it('ToastProvider 밖에서 useToast 를 쓰면 에러가 난다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger title="x" />)).toThrow('ToastProvider');
  });

  it('deprecated variant 는 color 로 바뀐다 (default → neutral) — 개발 모드에서 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { unmount } = render(
      <ToastProvider>
        <Trigger title="새 이름" color="neutral" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    const expected = screen.getByText('새 이름').closest('li')!.className;
    expect(warn).not.toHaveBeenCalled();
    unmount();

    render(
      <ToastProvider>
        <Trigger title="옛 이름" variant="default" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    expect(screen.getByText('옛 이름').closest('li')!.className).toBe(expected);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('variant 는 deprecated'));
    warn.mockRestore();
  });

  it('color 와 deprecated variant 를 함께 주면 color 가 우선한다', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { unmount } = render(
      <ToastProvider>
        <Trigger title="기준" color="danger" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    const expected = screen.getByText('기준').closest('li')!.className;
    unmount();
    render(
      <ToastProvider>
        <Trigger title="둘 다" color="danger" variant="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('띄우기'));
    expect(screen.getByText('둘 다').closest('li')!.className).toBe(expected);
    vi.restoreAllMocks();
  });
});
