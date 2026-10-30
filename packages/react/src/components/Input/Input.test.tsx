import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('ref 와 className·나머지 속성은 input 에, rootClassName 은 바깥 요소에 전달한다', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="칸" className="inner" rootClassName="outer" placeholder="입력" />);
    const input = screen.getByRole('textbox', { name: '칸' });
    expect(ref.current).toBe(input);
    expect(input.classList.contains('inner')).toBe(true);
    expect(input.getAttribute('placeholder')).toBe('입력');
    expect(input.parentElement?.classList.contains('outer')).toBe(true);
  });

  it('invalid·disabled 를 접근성 속성과 바깥 요소 상태로 나타낸다', () => {
    render(<Input aria-label="칸" invalid disabled />);
    const input = screen.getByRole('textbox', { name: '칸' }) as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.disabled).toBe(true);
    expect(input.parentElement?.hasAttribute('data-invalid')).toBe(true);
    expect(input.parentElement?.hasAttribute('data-disabled')).toBe(true);
  });

  it('앞뒤 장식을 입력창 양옆에 그리고, 없으면 자리를 만들지 않는다', () => {
    const { rerender } = render(<Input aria-label="칸" startAdornment="앞" endAdornment="뒤" />);
    const root = screen.getByRole('textbox', { name: '칸' }).parentElement!;
    expect(root.textContent).toBe('앞뒤');
    expect(root.firstElementChild?.textContent).toBe('앞');
    expect(root.lastElementChild?.textContent).toBe('뒤');

    rerender(<Input aria-label="칸" />);
    expect(root.children).toHaveLength(1);
  });
});
