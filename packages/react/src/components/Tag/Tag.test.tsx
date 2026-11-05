import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { Tag } from './Tag';
import { TagGroup } from './TagGroup';

describe('Tag', () => {
  it('표시용은 버튼이 없는 글자다', () => {
    const { container } = render(<Tag>디자인</Tag>);
    expect(screen.getByText('디자인')).toBeTruthy();
    expect(container.querySelector('button')).toBeNull();
  });

  it('onRemove 를 주면 "<글자> 삭제" 버튼이 생기고 누르면 부른다', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>서울</Tag>);
    await user.click(screen.getByRole('button', { name: '서울 삭제' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it.each(['{Delete}', '{Backspace}'])('삭제 버튼 위에서 %s 로도 지운다', async (key) => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>서울</Tag>);
    screen.getByRole('button', { name: '서울 삭제' }).focus();
    await user.keyboard(key);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('비활성이면 삭제 버튼도 비활성이고 부르지 않는다', () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} disabled>
        서울
      </Tag>,
    );
    const button = screen.getByRole('button', { name: '서울 삭제' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.keyDown(button, { key: 'Delete' });
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('글자가 문자열이 아니면 removeLabel 을 쓴다', () => {
    render(
      <Tag onRemove={() => {}} removeLabel="굵은 서울 삭제">
        <b>서울</b>
      </Tag>,
    );
    expect(screen.getByRole('button', { name: '굵은 서울 삭제' })).toBeTruthy();
  });

  it('고르는 칩: aria-pressed 로 켜짐을 알리고 켜지면 체크 아이콘을 보인다 (비제어)', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Tag onSelectedChange={onSelectedChange}>무료 배송</Tag>);
    const chip = screen.getByRole('button', { name: '무료 배송' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(chip.querySelector('svg')).toBeNull();
    await user.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(chip.querySelector('svg')).not.toBeNull();
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);
    await user.keyboard(' ');
    expect(chip.getAttribute('aria-pressed')).toBe('false');
  });

  it('고르는 칩 제어 모드는 selected 를 따른다', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <Tag selected onSelectedChange={onSelectedChange}>
        무료 배송
      </Tag>,
    );
    const chip = screen.getByRole('button', { name: '무료 배송' });
    await user.click(chip);
    expect(onSelectedChange).toHaveBeenCalledWith(false);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
  });

  it('LocaleProvider 문구를 쓴다', () => {
    render(
      <LocaleProvider messages={en}>
        <Tag onRemove={() => {}}>Seoul</Tag>
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Remove Seoul' })).toBeTruthy();
  });
});

function Filters({ initial = ['서울', '부산', '대구'] }: { initial?: string[] }) {
  const [tags, setTags] = useState(initial);
  return (
    <>
      <button type="button">앞 버튼</button>
      <TagGroup aria-label="고른 지역">
        {tags.map((tag) => (
          <Tag key={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
            {tag}
          </Tag>
        ))}
      </TagGroup>
    </>
  );
}

describe('TagGroup', () => {
  afterEach(() => vi.useRealTimers());

  it('이름 있는 목록이고 태그마다 목록 항목이다', () => {
    render(<Filters />);
    const list = screen.getByRole('list', { name: '고른 지역' });
    expect(list.querySelectorAll('li')).toHaveLength(3);
  });

  it('지우면 그 자리의 다음 태그 → 끝이면 앞 태그 → 다 지우면 목록으로 포커스', async () => {
    const user = userEvent.setup();
    render(<Filters />);
    await user.click(screen.getByRole('button', { name: '부산 삭제' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '대구 삭제' }));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '서울 삭제' }));
    await user.keyboard('{Delete}');
    expect(document.activeElement).toBe(screen.getByRole('list', { name: '고른 지역' }));
  });

  it('지운 태그를 0.5초 뒤 처음부터 있는 status 영역에 알린다', async () => {
    vi.useFakeTimers();
    render(<Filters />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('');
    fireEvent.click(screen.getByRole('button', { name: '부산 삭제' }));
    expect(status.textContent).toBe('');
    act(() => vi.advanceTimersByTime(500));
    expect(status.textContent).toBe('부산 삭제됨');
  });

  it('부르는 쪽이 지우지 않으면 포커스를 옮기지 않고, 나중에 다른 이유로 줄어도 옮기지 않는다', async () => {
    const user = userEvent.setup();
    function Keep() {
      const [tags, setTags] = useState(['서울', '부산']);
      return (
        <>
          <button type="button" onClick={() => setTags(['서울'])}>
            부산 빼기
          </button>
          <TagGroup aria-label="지역">
            {tags.map((tag) => (
              <Tag key={tag} onRemove={() => {}}>
                {tag}
              </Tag>
            ))}
          </TagGroup>
        </>
      );
    }
    render(<Keep />);
    const now = Date.now();
    const spy = vi.spyOn(Date, 'now').mockReturnValue(now);
    await user.click(screen.getByRole('button', { name: '서울 삭제' }));
    spy.mockReturnValue(now + 2000);
    const other = screen.getByRole('button', { name: '부산 빼기' });
    await user.click(other);
    expect(document.activeElement).toBe(other);
    spy.mockRestore();
  });
});
