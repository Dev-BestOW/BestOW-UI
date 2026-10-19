import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { DescriptionList } from './DescriptionList';

const items = [
  { term: '고객', description: '최별' },
  { term: '연락처', description: '010-1234-1027' },
];

describe('DescriptionList', () => {
  it('dl 안에 항목마다 dt·dd 쌍으로 그린다 (term·definition 역할)', () => {
    const { container } = render(<DescriptionList items={items} aria-label="주문 정보" />);
    const dl = container.querySelector('dl')!;
    expect(dl.getAttribute('aria-label')).toBe('주문 정보');
    expect(screen.getAllByRole('term').map((el) => el.textContent)).toEqual(['고객', '연락처']);
    expect(screen.getAllByRole('definition').map((el) => el.textContent)).toEqual(['최별', '010-1234-1027']);
    // dl 의 자식은 div 묶음(허용된 구조), 각 묶음에 dt 다음 dd
    expect(Array.from(dl.children).map((el) => el.tagName)).toEqual(['DIV', 'DIV']);
    expect(Array.from(dl.children[0]!.children).map((el) => el.tagName)).toEqual(['DT', 'DD']);
  });

  it('layout·divided 에 따라 다른 클래스, termWidth 는 CSS 변수로', () => {
    const ref = createRef<HTMLDListElement>();
    const { rerender } = render(<DescriptionList ref={ref} items={items} />);
    const horizontal = ref.current!.firstElementChild!.className;
    rerender(<DescriptionList ref={ref} items={items} layout="vertical" divided termWidth="8rem" />);
    expect(ref.current!.firstElementChild!.className).not.toBe(horizontal);
    expect(ref.current!.getAttribute('style')).toContain('8rem');
  });
});
