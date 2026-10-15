import { createRef } from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

const vars = (el: Element | null) => (el as HTMLElement | null)?.getAttribute('style') ?? '';

describe('Skeleton', () => {
  it('장식용이라 aria-hidden 이다', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('숫자 width/height 는 px 로 바꾼다', () => {
    const { container } = render(<Skeleton variant="rect" width={120} height="2rem" />);
    const style = vars(container.firstElementChild);
    expect(style).toContain('120px');
    expect(style).toContain('2rem');
  });

  it('circle 은 height 가 없으면 width 를 지름으로 쓴다', () => {
    const { container } = render(<Skeleton variant="circle" width={48} />);
    expect(vars(container.firstElementChild).match(/48px/g)).toHaveLength(2);
  });

  it('lines 만큼 줄을 그리고 마지막 줄은 60% 너비다', () => {
    const { container } = render(<Skeleton lines={3} />);
    const rows = container.firstElementChild?.children;
    expect(rows).toHaveLength(3);
    expect(vars(rows?.[2] ?? null)).toContain('60%');
    expect(vars(rows?.[0] ?? null)).not.toContain('60%');
  });

  it('ref, className, style 을 전달한다', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} className="custom" style={{ marginTop: 4 }} />);
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.style.marginTop).toBe('4px');
  });
});
