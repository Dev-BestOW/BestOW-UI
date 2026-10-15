import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('기본은 div 로 렌더링하고 섹션을 순서대로 담는다', () => {
    const { container } = render(
      <Card>
        <CardHeader>머리</CardHeader>
        <CardBody>본문</CardBody>
        <CardFooter>바닥</CardFooter>
      </Card>,
    );
    const card = container.firstElementChild!;
    expect(card.tagName).toBe('DIV');
    expect(Array.from(card.children).map((el) => el.textContent)).toEqual(['머리', '본문', '바닥']);
  });

  it('as 로 요소를 바꾸고 HTML 속성을 전달한다', () => {
    render(<Card as="article" aria-label="공지" />);
    expect(screen.getByRole('article', { name: '공지' })).toBeTruthy();
  });

  it('variant·padding 에 따라 다른 클래스를 쓴다', () => {
    const { container } = render(
      <>
        <Card />
        <Card variant="elevated" padding="none" />
      </>,
    );
    const [a, b] = Array.from(container.children);
    expect(a?.className).not.toBe(b?.className);
  });

  it('ref 와 className 을 전달한다', () => {
    const cardRef = createRef<HTMLElement>();
    const bodyRef = createRef<HTMLDivElement>();
    render(
      <Card ref={cardRef} className="custom">
        <CardBody ref={bodyRef} className="body" />
      </Card>,
    );
    expect(cardRef.current?.classList.contains('custom')).toBe(true);
    expect(bodyRef.current?.classList.contains('body')).toBe(true);
  });
});
