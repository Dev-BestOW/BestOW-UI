import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('label 과 helperText 를 연결한다', () => {
    render(<Textarea label="메모" helperText="200자 이내" />);
    const textarea = screen.getByLabelText('메모');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.getAttribute('aria-describedby')).toBe(screen.getByText('200자 이내').id);
  });

  it('error 이면 aria-invalid 를 설정한다', () => {
    render(<Textarea label="메모" error />);
    expect(screen.getByLabelText('메모').getAttribute('aria-invalid')).toBe('true');
  });

  it('showCount 는 비제어 모드에서 입력에 따라 글자 수를 갱신한다', () => {
    render(<Textarea label="메모" showCount maxLength={10} defaultValue="안녕" />);
    expect(screen.getByText('2/10')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('메모'), { target: { value: '안녕하세요' } });
    expect(screen.getByText('5/10')).toBeTruthy();
  });

  it('showCount 는 제어 모드의 value 를 따른다', () => {
    function Controlled() {
      const [value, setValue] = useState('abc');
      return <Textarea label="메모" showCount value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    expect(screen.getByText('3')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('메모'), { target: { value: 'abcdef' } });
    expect(screen.getByText('6')).toBeTruthy();
  });

  it('ref 와 onChange 를 전달한다', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onChange = vi.fn();
    render(<Textarea ref={ref} label="메모" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('메모'), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
