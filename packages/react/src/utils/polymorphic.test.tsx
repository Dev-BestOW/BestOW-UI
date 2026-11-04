import { createRef, forwardRef, useRef, type ComponentProps, type ComponentRef } from 'react';
import { render } from '@testing-library/react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Grid } from '../components/Grid';
import { Stack } from '../components/Stack';
import { Typography } from '../components/Typography';
import { VisuallyHidden } from '../components/VisuallyHidden';

// 타입 검사는 `pnpm typecheck`(tsc)가 한다 — @ts-expect-error 가 붙은 줄에 오류가 없으면 tsc 가 실패한다.
// 아래 렌더링은 같은 코드가 실제로 속성을 전달하는지 확인한다.

const FakeLink = forwardRef<HTMLAnchorElement, { href: string; prefetch?: boolean; children?: React.ReactNode }>(
  function FakeLink({ prefetch: _prefetch, children, ...rest }, ref) {
    return (
      <a ref={ref} {...rest}>
        {children}
      </a>
    );
  },
);

describe('as 다형성 타입 (2.0)', () => {
  it('as 로 고른 요소의 속성을 받는다 — time 의 dateTime, a 의 href, label 의 htmlFor', () => {
    const { container } = render(
      <>
        <Typography as="time" dateTime="2026-11-04">
          11월 4일
        </Typography>
        <Card as="a" href="/orders">
          주문
        </Card>
        <Stack as="label" htmlFor="name">
          이름
        </Stack>
        <Grid as="ol" start={3} reversed>
          <li>셋</li>
        </Grid>
        <Container as="form" action="/search" noValidate />
        <VisuallyHidden as="output" htmlFor="name">
          결과
        </VisuallyHidden>
      </>,
    );
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-04');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/orders');
    expect(container.querySelector('label')?.getAttribute('for')).toBe('name');
    expect(container.querySelector('ol')?.getAttribute('start')).toBe('3');
    expect(container.querySelector('form')?.hasAttribute('novalidate')).toBe(true);
    expect(container.querySelector('output')?.getAttribute('for')).toBe('name');
  });

  it('as 컴포넌트의 props 와 ref 를 따른다', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Card as={FakeLink} href="/a" prefetch ref={ref} variant="outline">
        링크
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.getAttribute('href')).toBe('/a');
  });

  it('고유 prop 이 as 요소의 같은 이름 속성보다 우선한다 — Typography color', () => {
    // HTML 의 color 속성은 string 이지만 Typography 의 color 는 정해진 값만
    // @ts-expect-error 'red' 는 Typography color 가 아니다
    void (<Typography as="span" color="red" />);
    void (<Typography as="span" color="danger" />);
  });

  it('잘못된 속성은 막는다', () => {
    // @ts-expect-error dateTime 은 문자열
    void (<Typography as="time" dateTime={20261104} />);
    // @ts-expect-error div 에는 href 가 없다
    void (<Card href="/a" />);
    // @ts-expect-error 없는 prop
    void (<Card as={FakeLink} href="/a" unknownProp />);
  });

  it('1.x 에서 통과하던 코드는 그대로 통과한다', () => {
    function Legacy() {
      const ref = useRef<HTMLElement>(null);
      return (
        <>
          <Stack as="ul" ref={ref} />
          <Card as={FakeLink} />
          <Typography variant="h2" ref={ref} />
        </>
      );
    }
    render(<Legacy />);
    const props: ComponentProps<typeof Stack> = { gap: 4, as: 'section' };
    const element: ComponentRef<typeof Card> | null = null as HTMLElement | null;
    expect(props.gap).toBe(4);
    expect(element).toBeNull();
  });
});
