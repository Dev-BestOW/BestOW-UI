import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('기본은 span 이고, 글자는 접근성 트리에 남는다', () => {
    render(<VisuallyHidden>숨긴 글자</VisuallyHidden>);
    expect(screen.getByText('숨긴 글자').tagName).toBe('SPAN');
  });

  it('as·ref·className·나머지 속성을 전달한다', () => {
    const ref = createRef<HTMLElement>();
    render(
      <VisuallyHidden as="h2" ref={ref} className="custom" id="title">
        제목
      </VisuallyHidden>,
    );
    const heading = screen.getByRole('heading', { name: '제목', level: 2 });
    expect(ref.current).toBe(heading);
    expect(heading.classList.contains('custom')).toBe(true);
    expect(heading.className.split(' ').length).toBeGreaterThan(1);
    expect(heading.id).toBe('title');
  });
});
