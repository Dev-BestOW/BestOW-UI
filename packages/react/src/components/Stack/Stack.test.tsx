import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';
import * as styles from './Stack.css';

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

  it('한 값만 주면 인라인 CSS 변수 없이 클래스로만 그린다', () => {
    render(<Stack data-testid="stack" direction="row" gap={4} align="center" style={{ color: 'red' }} />);
    const stack = screen.getByTestId('stack');
    expect(stack.className).toBe([styles.stack({ direction: 'row', gap: 4, align: 'center' })].join(' '));
    expect(stack.getAttribute('style')).toBe('color: red;');
  });

  it('구간별 값은 반응형 클래스 + 구간별 CSS 변수로 그린다 (기본 방향 column 을 이어받음)', () => {
    render(
      <Stack
        data-testid="stack"
        direction={{ md: 'row' }}
        gap={{ base: 2, lg: 6 }}
        align={{ base: 'start', md: 'center' }}
        justify={{ md: 'between' }}
        style={{ color: 'red' }}
      />,
    );
    const stack = screen.getByTestId('stack');
    for (const name of ['responsiveDirection', 'responsiveGap', 'responsiveAlign', 'responsiveJustify'] as const) {
      expect(stack.classList.contains(styles[name])).toBe(true);
    }
    const css = (name: string) => stack.style.getPropertyValue(name);
    expect(css('--bestow-stack-direction-base')).toBe('column');
    expect(css('--bestow-stack-direction-sm')).toBe('column');
    expect(css('--bestow-stack-direction-md')).toBe('row');
    expect(css('--bestow-stack-direction-xl')).toBe('row');
    expect(css('--bestow-gap-md')).toBe('var(--bestow-space-2)');
    expect(css('--bestow-gap-lg')).toBe('var(--bestow-space-6)');
    expect(css('--bestow-stack-align-base')).toBe('flex-start');
    expect(css('--bestow-stack-align-md')).toBe('center');
    expect(css('--bestow-stack-justify-sm')).toBe('');
    expect(css('--bestow-stack-justify-md')).toBe('space-between');
    expect(stack.style.color).toBe('red');
  });

  it('반응형으로 준 속성은 recipe 클래스를 함께 붙이지 않는다 (같은 속성을 두 클래스가 다투지 않게)', () => {
    render(<Stack data-testid="stack" direction={{ base: 'row', md: 'column' }} gap={3} />);
    expect(screen.getByTestId('stack').className.split(' ')).toEqual([
      ...styles.stack({ gap: 3 }).split(' '),
      styles.responsiveDirection,
    ]);
  });
});
