import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('label 과 input 을 연결한다', () => {
    render(<TextField label="이메일" />);
    expect(screen.getByLabelText('이메일').tagName).toBe('INPUT');
  });

  it('helperText 를 aria-describedby 로 연결한다', () => {
    render(<TextField label="이메일" helperText="도움말" />);
    const input = screen.getByLabelText('이메일');
    const helper = screen.getByText('도움말');
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('error 이면 aria-invalid 를 설정한다', () => {
    render(<TextField label="이메일" error />);
    expect(screen.getByLabelText('이메일').getAttribute('aria-invalid')).toBe('true');
  });

  it('ref 는 input 요소를 가리킨다', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="이메일" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
