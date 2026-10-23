import { render, screen } from '@testing-library/react';
import { Grid } from './Grid';
import * as styles from './Grid.css';

describe('Grid', () => {
  it('columns 를 구간별 grid-template-columns 변수로 넣는다', () => {
    render(<Grid data-testid="grid" as="ul" columns={{ base: 1, md: 2, lg: 3 }} gap={4} />);
    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('UL');
    expect(grid.classList.contains(styles.grid)).toBe(true);
    expect(grid.classList.contains(styles.responsiveGap)).toBe(true);
    expect(grid.style.getPropertyValue('--bestow-grid-columns-sm')).toBe('repeat(1, minmax(0, 1fr))');
    expect(grid.style.getPropertyValue('--bestow-grid-columns-md')).toBe('repeat(2, minmax(0, 1fr))');
    expect(grid.style.getPropertyValue('--bestow-grid-columns-xl')).toBe('repeat(3, minmax(0, 1fr))');
    expect(grid.style.getPropertyValue('--bestow-gap-base')).toBe('var(--bestow-space-4)');
  });

  it('minItemWidth 는 화면보다 넓어지지 않는 auto-fill 열로, columns 보다 우선한다', () => {
    render(<Grid data-testid="grid" minItemWidth="220px" columns={3} />);
    const grid = screen.getByTestId('grid');
    expect(grid.style.getPropertyValue('--bestow-grid-columns-base')).toBe(
      'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
    );
    expect(grid.style.getPropertyValue('--bestow-grid-columns-md')).toBe('');
    expect(grid.classList.contains(styles.responsiveGap)).toBe(false);
  });

  it('className·style·ref 를 전달한다', () => {
    const ref = { current: null as HTMLElement | null };
    render(<Grid ref={ref} data-testid="grid" className="extra" style={{ color: 'red' }} columns={2} />);
    const grid = screen.getByTestId('grid');
    expect(ref.current).toBe(grid);
    expect(grid.classList.contains('extra')).toBe(true);
    expect(grid.style.color).toBe('red');
  });
});
