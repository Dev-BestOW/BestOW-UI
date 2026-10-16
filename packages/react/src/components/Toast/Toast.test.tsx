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

  it('1.0 에서 제거한 variant 는 타입 오류다 (color 를 쓴다)', () => {
    // @ts-expect-error -- 0.x 의 옛 이름. 1.0 에서 제거됨 (docs/MIGRATION-1.0.md)
    const removed: ToastOptions = { title: 'x', variant: 'success' };
    expect(removed).toBeTruthy();
  });
});
