import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrashIcon } from '@bestow-ui/icons';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('aria-label 이 버튼 이름이 되고, 아이콘은 이름에 섞이지 않는다', () => {
    render(
      <IconButton aria-label="삭제">
        <TrashIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: '삭제' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('aria-label 이 없으면 타입 오류다', () => {
    // @ts-expect-error 아이콘만으로는 이름이 없으므로 aria-label 은 필수
    const element = <IconButton>{<TrashIcon />}</IconButton>;
    expect(element).toBeTruthy();
  });

  it('클릭하면 onClick 을 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton aria-label="삭제" onClick={onClick}>
        <TrashIcon />
      </IconButton>,
    );
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('loading 이면 아이콘 대신 스피너를 보여 주고, 이름은 유지한 채 클릭을 막는다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton aria-label="삭제" loading onClick={onClick}>
        <TrashIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: '삭제' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('[data-icon="Trash"]')).toBeNull();
    expect(button.querySelectorAll('svg')).toHaveLength(1); // 스피너만
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('size 마다 다른 클래스를 쓰고, 기본은 ghost·neutral 이라 Button 기본(solid·primary)과 다르다', () => {
    render(
      <>
        <IconButton aria-label="sm" size="sm">
          <TrashIcon />
        </IconButton>
        <IconButton aria-label="lg" size="lg">
          <TrashIcon />
        </IconButton>
        <IconButton aria-label="solid" variant="solid" color="primary" size="lg">
          <TrashIcon />
        </IconButton>
      </>,
    );
    const cls = (name: string) => screen.getByRole('button', { name }).className;
    expect(cls('sm')).not.toBe(cls('lg'));
    expect(cls('lg')).not.toBe(cls('solid'));
  });

  it('ref, className, disabled 를 전달한다', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="삭제" className="custom" disabled>
        <TrashIcon />
      </IconButton>,
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: '삭제' }));
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.disabled).toBe(true);
  });
});
