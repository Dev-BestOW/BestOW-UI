import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('기본은 가로 separator 다', () => {
    render(<Divider />);
    const separator = screen.getByRole('separator');
    expect(separator.hasAttribute('aria-orientation')).toBe(false);
  });

  it('vertical 이면 aria-orientation="vertical" 을 붙인다', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });

  it('decorative 이면 separator 로 노출하지 않는다', () => {
    render(<Divider decorative />);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('텍스트가 있으면 텍스트를 읽히게 하고 선은 숨긴다', () => {
    const { container } = render(<Divider>또는</Divider>);
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByText('또는')).toBeTruthy();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('ref 와 className 을 전달한다', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Divider ref={ref} className="custom" />);
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });
});
