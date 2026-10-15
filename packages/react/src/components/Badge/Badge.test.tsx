import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('children 을 렌더링한다', () => {
    render(<Badge>새 글</Badge>);
    expect(screen.getByText('새 글').tagName).toBe('SPAN');
  });

  it('variant·color 에 따라 다른 클래스를 쓴다', () => {
    render(
      <>
        <Badge>기본</Badge>
        <Badge variant="solid" color="danger">
          위험
        </Badge>
      </>,
    );
    expect(screen.getByText('기본').className).not.toBe(screen.getByText('위험').className);
  });

  it('startIcon 을 텍스트 앞에 표시한다', () => {
    render(<Badge startIcon={<svg data-testid="icon" aria-hidden />}>완료</Badge>);
    const badge = screen.getByText('완료');
    expect(badge.firstElementChild?.contains(screen.getByTestId('icon'))).toBe(true);
  });

  it('ref, className, HTML 속성을 전달한다', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="custom" title="상태">
        상태
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.getAttribute('title')).toBe('상태');
  });
});
