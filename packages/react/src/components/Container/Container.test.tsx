import { render, screen } from '@testing-library/react';
import { Container } from './Container';
import * as styles from './Container.css';

describe('Container', () => {
  it('기본은 div·lg 이고 as·size·flush·className 을 받는다', () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <>
        <Container data-testid="default" />
        <Container ref={ref} data-testid="main" as="main" size="sm" flush className="extra" />
      </>,
    );
    expect(screen.getByTestId('default').className).toBe(styles.container({ size: 'lg' }));
    const main = screen.getByTestId('main');
    expect(main.tagName).toBe('MAIN');
    expect(ref.current).toBe(main);
    expect(main.className).toBe(`${styles.container({ size: 'sm', flush: true })} extra`);
  });
});
