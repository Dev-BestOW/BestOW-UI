import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('variant 에 맞는 기본 요소로 렌더링한다', () => {
    render(
      <>
        <Typography variant="h2">제목</Typography>
        <Typography>본문</Typography>
        <Typography variant="caption">캡션</Typography>
      </>,
    );
    expect(screen.getByRole('heading', { level: 2, name: '제목' })).toBeTruthy();
    expect(screen.getByText('본문').tagName).toBe('P');
    expect(screen.getByText('캡션').tagName).toBe('SPAN');
  });

  it('as 로 요소를 바꿀 수 있다', () => {
    render(<Typography variant="h1" as="div">제목</Typography>);
    expect(screen.getByText('제목').tagName).toBe('DIV');
  });
});
