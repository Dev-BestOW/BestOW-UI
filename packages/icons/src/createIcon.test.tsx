import { createRef } from 'react';
import { render } from '@testing-library/react';
import { createIcon } from './createIcon';
import { SearchIcon } from './generated/icons';

describe('Icon', () => {
  it('기본은 장식용이라 aria-hidden 이고 24px 이다', () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('data-icon')).toBe('Search');
  });

  it('title 을 주면 스크린리더가 읽을 수 있는 이미지가 된다', () => {
    const { getByRole } = render(<SearchIcon title="검색" />);
    const svg = getByRole('img', { name: '검색' });
    expect(svg.getAttribute('aria-hidden')).toBeNull();
  });

  it('size, strokeWidth, className, ref 를 전달한다', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<SearchIcon ref={ref} size={16} strokeWidth={1.5} className="icon" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
    expect(svg.classList.contains('icon')).toBe(true);
    expect(ref.current).toBe(svg);
  });

  it('아이콘별 루트 속성(fill 아이콘 등)을 적용하고 strokeWidth prop 이 우선한다', () => {
    const FilledIcon = createIcon('Filled', [['circle', { cx: '12', cy: '12', r: '10' }]], {
      fill: 'currentColor',
      stroke: 'none',
    });
    const { container } = render(<FilledIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('stroke')).toBe('none');
    expect(FilledIcon.displayName).toBe('FilledIcon');
  });
});
