import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('children 을 렌더링하고 기본 type 은 button 이다', () => {
    render(<Button>확인</Button>);
    const button = screen.getByRole('button', { name: '확인' });
    expect(button.getAttribute('type')).toBe('button');
  });

  it('클릭 이벤트를 전달한다', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 클릭되지 않는다', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>확인</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ref 와 className 을 전달한다', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="custom">확인</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });
});
