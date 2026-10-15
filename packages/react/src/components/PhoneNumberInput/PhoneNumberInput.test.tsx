import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneNumberInput } from './PhoneNumberInput';

const input = () => screen.getByRole('textbox', { name: '휴대폰 번호' }) as HTMLInputElement;

describe('PhoneNumberInput', () => {
  it('입력하는 대로 하이픈을 넣고, 값은 숫자만 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneNumberInput onValueChange={onValueChange} />);
    await user.type(input(), '01012345678');
    expect(input().value).toBe('010-1234-5678');
    expect(onValueChange).toHaveBeenLastCalledWith('01012345678');
    expect(input().getAttribute('type')).toBe('tel');
    expect(input().getAttribute('autocomplete')).toBe('tel-national');
  });

  // 중간 입력 시 커서 유지는 jsdom 이 실제 브라우저와 다르게 커서를 되살려 검증되지 않는다 →
  // 실제 Chromium 에서 도는 스토리 play 테스트(PhoneNumberInput.stories.tsx "CaretStays")로 확인한다.

  it('하이픈 바로 뒤에서 Backspace 를 누르면 하이픈 앞 숫자를 지운다', async () => {
    const user = userEvent.setup();
    render(<PhoneNumberInput defaultValue="01012345678" />); // 010-1234-5678
    const field = input();
    field.focus();
    field.setSelectionRange(4, 4); // "010-|1234-5678"
    await user.keyboard('{Backspace}');
    expect(field.value).toBe('011-234-5678'); // 0 이 지워짐 → 0112345678 (10자리라 3-3-4)
    expect(field.selectionStart).toBe(2); // "01|1-…"
  });

  it('붙여넣기는 숫자만 남기고, 제어 모드에서도 동작한다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [phone, setPhone] = useState<string>();
      return (
        <>
          <PhoneNumberInput value={phone} onValueChange={setPhone} />
          <output>{phone}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(input());
    await user.paste('+82 (0)2 123 4567'.replace('+82 (0)', '0'));
    expect(input().value).toBe('02-123-4567');
    expect(screen.getByRole('status').textContent).toBe('021234567');
  });
});
