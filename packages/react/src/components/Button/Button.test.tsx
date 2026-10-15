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

  it('loading 이면 aria-busy 를 붙이고 클릭·폼 제출을 막는다', () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit as never}>
        <Button type="submit" loading onClick={onClick}>
          저장
        </Button>
      </form>,
    );
    const button = screen.getByRole('button', { name: '저장' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(false);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('loading 스피너는 버튼 이름에 섞이지 않는다', () => {
    render(<Button loading>저장</Button>);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('button').textContent).toBe('저장');
  });
});
