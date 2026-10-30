import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button asChild', () => {
  const link = () => screen.getByRole('link', { name: '시작하기' });

  it('자식 요소를 그대로 렌더링하고 모양·아이콘·속성을 입힌다', () => {
    render(
      <Button asChild startIcon={<i data-testid="icon" />} className="outer" data-x="1">
        <a href="/signup" className="inner" title="제목">
          시작하기
        </a>
      </Button>,
    );
    expect(link().getAttribute('href')).toBe('/signup');
    expect(link().getAttribute('title')).toBe('제목');
    expect(link().getAttribute('data-x')).toBe('1');
    expect(link().className).toContain('outer');
    expect(link().className).toContain('inner');
    expect(link().hasAttribute('type')).toBe(false);
    expect(link().hasAttribute('disabled')).toBe(false);
    expect(link().contains(screen.getByTestId('icon'))).toBe(true);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('바깥 ref 와 자식 ref 를 모두 채운다', () => {
    const outer = createRef<HTMLButtonElement>();
    const inner = createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={outer}>
        <a href="/" ref={inner}>
          시작하기
        </a>
      </Button>,
    );
    expect(outer.current).toBe(link());
    expect(inner.current).toBe(link());
  });

  it('바깥과 자식의 onClick 을 모두 부른다', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Button asChild onClick={outer}>
        <a href="#start" onClick={inner}>
          시작하기
        </a>
      </Button>,
    );
    fireEvent.click(link());
    expect(outer).toHaveBeenCalledTimes(1);
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['disabled', { disabled: true }, '-1'],
    ['loading', { loading: true }, null],
  ])('%s 면 이동과 클릭을 막는다', (_, props, tabIndex) => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Button asChild onClick={outer} {...props}>
        <a href="#start" onClick={inner}>
          시작하기
        </a>
      </Button>,
    );
    // 이벤트를 보낸 뒤 false 면 preventDefault 가 불렸다는 뜻이다
    expect(fireEvent.click(link())).toBe(false);
    expect(outer).not.toHaveBeenCalled();
    expect(inner).not.toHaveBeenCalled();
    expect(link().getAttribute('aria-disabled')).toBe('true');
    expect(link().getAttribute('tabindex')).toBe(tabIndex);
  });
});

describe('Button', () => {
  it('children 을 렌더링하고 기본 type 은 button 이다', () => {
    render(<Button>확인</Button>);
    const button = screen.getByRole('button', { name: '확인' });
    expect(button.getAttribute('type')).toBe('button');
  });

  it('클릭 이벤트를 전달한다', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 클릭되지 않는다', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        확인
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ref 와 className 을 전달한다', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom">
        확인
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.classList.contains('custom')).toBe(true);
  });

  it('loading 이면 aria-busy 를 붙이고 클릭·폼 제출을 막는다', () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit as never}>
        <Button type="submit" loading onClick={onClick}>
          저장
        </Button>
      </form>,
    );
    const button = screen.getByRole('button', { name: '저장' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(false);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('loading 스피너는 버튼 이름에 섞이지 않는다', () => {
    render(<Button loading>저장</Button>);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('button').textContent).toBe('저장');
  });
});
