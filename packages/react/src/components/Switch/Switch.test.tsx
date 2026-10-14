import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('label 과 연결된 switch 역할로 렌더링한다', () => {
    render(<Switch label="알림 받기" />);
    const sw = screen.getByRole('switch', { name: '알림 받기' });
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('label 을 클릭하면 켜지고 onCheckedChange 가 호출된다', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="알림 받기" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText('알림 받기'));
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('disabled 이면 바뀌지 않는다', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="알림" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('ref 는 switch 버튼을 가리킨다', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="알림" />);
    expect(ref.current).toBe(screen.getByRole('switch', { name: '알림' }));
  });
});
