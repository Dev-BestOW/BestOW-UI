import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { focusField } from '../../utils/focusField';
import { CheckboxGroup } from './CheckboxGroup';

const options = [
  { value: 'design', label: '디자인' },
  { value: 'dev', label: '개발', description: '프론트엔드·백엔드' },
  { value: 'pm', label: '기획', disabled: true },
];

describe('CheckboxGroup', () => {
  it('묶음 이름·도움말을 group 에 연결하고, 필수는 이름에 "필수" 로 들어간다', () => {
    render(<CheckboxGroup label="관심 분야" helperText="여러 개 고를 수 있어요" required options={options} />);
    const group = screen.getByRole('group', { name: '관심 분야 (필수)' });
    expect(document.getElementById(group.getAttribute('aria-describedby')!)?.textContent).toBe(
      '여러 개 고를 수 있어요',
    );
    // 보조 설명은 이름이 아니라 설명으로
    const dev = screen.getByRole('checkbox', { name: '개발' });
    expect(document.getElementById(dev.getAttribute('aria-describedby')!)?.textContent).toBe('프론트엔드·백엔드');
    expect((screen.getByRole('checkbox', { name: '기획' }) as HTMLInputElement).disabled).toBe(true);
  });

  it('비제어: 누르면 options 순서대로 정렬한 배열을 알린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CheckboxGroup label="관심 분야" options={options} defaultValue={['dev']} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('checkbox', { name: '디자인' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['design', 'dev']);
    expect((screen.getByRole('checkbox', { name: '디자인' }) as HTMLInputElement).checked).toBe(true);
    await user.click(screen.getByRole('checkbox', { name: '개발' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['design']);
  });

  it('제어: value 가 undefined 여도 경고 없이 제어 모드 (아무것도 선택 안 됨)', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string[]>();
      return <CheckboxGroup label="관심 분야" options={options} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect((screen.getByRole('checkbox', { name: '디자인' }) as HTMLInputElement).checked).toBe(false);
    await user.click(screen.getByRole('checkbox', { name: '디자인' }));
    expect((screen.getByRole('checkbox', { name: '디자인' }) as HTMLInputElement).checked).toBe(true);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('오류면 체크박스마다 aria-invalid, 고른 값은 같은 name 으로 폼에 제출된다', () => {
    render(
      <form data-testid="form">
        <CheckboxGroup label="관심 분야" name="interests" options={options} defaultValue={['design', 'dev']} error />
      </form>,
    );
    for (const box of screen.getAllByRole('checkbox')) expect(box.getAttribute('aria-invalid')).toBe('true');
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.getAll('interests')).toEqual(['design', 'dev']);
  });

  it('focusField(묶음 id) 는 선택된 항목, 없으면 첫 항목으로 간다 (ErrorSummary 링크)', () => {
    const { rerender } = render(<CheckboxGroup id="interests" label="관심 분야" options={options} value={[]} />);
    focusField('interests');
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: '디자인' }));
    rerender(<CheckboxGroup id="interests" label="관심 분야" options={options} value={['dev']} />);
    focusField('interests');
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: '개발' }));
  });
});
