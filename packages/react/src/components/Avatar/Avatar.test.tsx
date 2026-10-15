import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, getInitials } from './Avatar';

describe('getInitials', () => {
  it('두 단어면 앞 글자 두 개, 한 단어면 첫 글자를 쓴다', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
    expect(getInitials('  jane   doe smith ')).toBe('JD');
    expect(getInitials('홍길동')).toBe('홍');
    expect(getInitials('bestow')).toBe('B');
    expect(getInitials('')).toBe('');
  });
});

describe('Avatar', () => {
  it('name 이 있으면 img 역할 + 이름, fallback 으로 이니셜을 보여 준다', () => {
    render(<Avatar name="Jane Doe" />);
    const avatar = screen.getByRole('img', { name: 'Jane Doe' });
    expect(avatar.textContent).toBe('JD');
  });

  it('alt 가 name 보다 우선한다', () => {
    render(<Avatar name="Jane Doe" alt="Jane 의 프로필 사진" />);
    expect(screen.getByRole('img', { name: 'Jane 의 프로필 사진' })).toBeTruthy();
  });

  it('이미지가 아직 로드되지 않았으면 fallback 을 보여 준다', () => {
    render(<Avatar src="/missing.png" name="홍길동" />);
    expect(screen.getByRole('img', { name: '홍길동' }).textContent).toBe('홍');
  });

  it('이름이 없으면 사용자 아이콘을 보여 주고 장식용으로 숨긴다', () => {
    const { container } = render(<Avatar />);
    expect(screen.queryByRole('img')).toBeNull();
    const root = container.firstElementChild;
    expect(root?.getAttribute('aria-hidden')).toBe('true');
    expect(root?.querySelector('svg[data-icon="User"]')).toBeTruthy();
  });

  it('fallback 을 직접 지정할 수 있다', () => {
    render(<Avatar name="팀" fallback="★" />);
    expect(screen.getByRole('img', { name: '팀' }).textContent).toBe('★');
  });

  it('ref 와 className 을 전달한다', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} className="custom" name="A" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });
});
