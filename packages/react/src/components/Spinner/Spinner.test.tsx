import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('기본으로 "로딩 중" 이름을 가진 status 역할이다', () => {
    render(<Spinner />);
    expect(screen.getByRole('status').textContent).toBe('로딩 중');
  });

  it('label 을 바꿀 수 있다', () => {
    render(<Spinner label="불러오는 중" />);
    expect(screen.getByRole('status').textContent).toBe('불러오는 중');
  });

  it('label 이 빈 문자열이면 장식용으로 숨긴다', () => {
    const { container } = render(<Spinner label="" />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('ref 와 className 을 전달한다', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });

  it('1.0 에서 제거한 color="current" 는 타입 오류다 (inherit 를 쓴다)', () => {
    // @ts-expect-error -- 0.x 의 옛 이름. 1.0 에서 제거됨 (docs/MIGRATION-1.0.md)
    const removed = <Spinner color="current" />;
    expect(removed).toBeTruthy();
  });
});
