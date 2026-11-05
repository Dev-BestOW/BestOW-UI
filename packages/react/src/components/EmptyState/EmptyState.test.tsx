import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('제목(기본 h3)·설명·행동을 그리고 아이콘은 숨긴다', () => {
    const { container } = render(
      <EmptyState
        icon={<svg data-testid="icon" />}
        title="검색 결과가 없어요"
        description="다른 검색어로 찾아보세요."
        action={<button type="button">조건 초기화</button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: '검색 결과가 없어요' })).toBeTruthy();
    expect(screen.getByText('다른 검색어로 찾아보세요.')).toBeTruthy();
    expect(screen.getByRole('button', { name: '조건 초기화' })).toBeTruthy();
    expect(screen.getByTestId('icon').parentElement!.getAttribute('aria-hidden')).toBe('true');
    expect(container.firstElementChild!.tagName).toBe('DIV');
  });

  it('titleAs 로 제목 수준을 바꾸고, "p" 면 제목이 아니다', () => {
    const { rerender } = render(<EmptyState title="없음" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: '없음' })).toBeTruthy();
    rerender(<EmptyState title="없음" titleAs="p" />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('없음').tagName).toBe('P');
  });

  it('없는 부분은 그리지 않는다', () => {
    const { container } = render(<EmptyState title="없음" />);
    expect(container.firstElementChild!.children).toHaveLength(1);
  });
});
