import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('기본으로 div 를 렌더링하고 as 로 바꿀 수 있다', () => {
    render(
      <>
        <Stack data-testid="div" gap={4} />
        <Stack data-testid="ul" as="ul" />
      </>,
    );
    expect(screen.getByTestId('div').tagName).toBe('DIV');
    expect(screen.getByTestId('ul').tagName).toBe('UL');
  });
});
