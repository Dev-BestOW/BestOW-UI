import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { TextField } from '../Input';
import { RadioGroup } from '../RadioGroup';
import { ErrorSummary } from './ErrorSummary';

const errors = [
  { id: 'name', message: '이름을 입력해 주세요.' },
  { id: 'plan', message: '플랜을 골라 주세요.' },
];

function Form({ items = errors, focusKey }: { items?: typeof errors; focusKey?: number }) {
  return (
    <>
      <ErrorSummary errors={items} focusKey={focusKey} />
      <TextField id="name" label="이름" />
      <RadioGroup
        id="plan"
        label="플랜"
        options={[
          { value: 'free', label: '무료' },
          { value: 'pro', label: '프로' },
        ]}
      />
    </>
  );
}

describe('ErrorSummary', () => {
  it('오류가 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('나타나면 포커스가 오고, 제목이 이름이며, 고칠 곳마다 링크가 있다', () => {
    render(<Form />);
    const summary = screen.getByRole('link', { name: '이름을 입력해 주세요.' }).closest('[tabindex="-1"]')!;
    expect(document.activeElement).toBe(summary);
    expect(summary.getAttribute('aria-labelledby')).toBe(screen.getByText('입력한 내용에 고칠 곳이 2개 있어요').id);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('링크를 누르면 해당 칸으로 — 묶음이면 첫 항목으로 간다', async () => {
    const user = userEvent.setup();
    render(<Form />);
    await user.click(screen.getByRole('link', { name: '이름을 입력해 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '이름' }));
    await user.click(screen.getByRole('link', { name: '플랜을 골라 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: '무료' }));
  });

  it('focusKey 가 바뀌면(다시 제출) 오류가 남아 있을 때 다시 포커스한다', () => {
    const { rerender } = render(<Form focusKey={1} />);
    screen.getByRole('textbox', { name: '이름' }).focus();
    rerender(<Form focusKey={1} />);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '이름' }));
    rerender(<Form focusKey={2} />);
    expect(document.activeElement?.getAttribute('tabindex')).toBe('-1');
  });

  it('제목은 LocaleProvider 로 바꿀 수 있다', () => {
    render(
      <LocaleProvider messages={en}>
        <ErrorSummary errors={errors.slice(0, 1)} />
      </LocaleProvider>,
    );
    expect(screen.getByText('There is 1 problem with your answers')).toBeTruthy();
  });
});
