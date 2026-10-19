import { render, screen } from '@testing-library/react';
import { FileUpload } from '../components/FileUpload';
import { TextField } from '../components/Input';
import { RadioGroup } from '../components/RadioGroup';
import { focusField } from './focusField';

const options = [
  { value: 'a', label: '가' },
  { value: 'b', label: '나' },
];

describe('focusField', () => {
  it('id 로 입력창에 포커스한다', () => {
    render(<TextField id="email" label="이메일" />);
    expect(focusField('email')).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '이메일' }));
  });

  it('묶음(RadioGroup)이면 선택된 항목, 없으면 첫 항목으로 간다', () => {
    const { rerender } = render(
      <RadioGroup id="plan" label="플랜" options={options} value="b" onValueChange={() => {}} />,
    );
    focusField('plan');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: '나' }));
    rerender(<RadioGroup id="plan" label="플랜" options={options} value={undefined} onValueChange={() => {}} />);
    focusField('plan');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: '가' }));
  });

  it('숨긴 input(FileUpload)을 가리키면 같은 묶음의 "파일 선택" 버튼으로 간다', () => {
    render(<FileUpload id="docs" label="서류" />);
    expect(focusField('docs')).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '파일 선택' }));
  });

  it('없는 id 면 false', () => {
    expect(focusField('nothing')).toBe(false);
    expect(focusField(null)).toBe(false);
  });
});
