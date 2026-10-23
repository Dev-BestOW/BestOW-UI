import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { focusField } from '../../utils/focusField';
import { ResidentNumberInput } from './ResidentNumberInput';

const front = () => screen.getByRole('textbox', { name: '앞 6자리' }) as HTMLInputElement;
// password 입력은 textbox 역할이 없다
const back = () => screen.getByLabelText('뒤 7자리') as HTMLInputElement;

describe('ResidentNumberInput', () => {
  it('묶음 이름은 레이블, 두 칸은 각자 이름을 갖고 뒷칸은 가린다(password)', () => {
    render(<ResidentNumberInput required />);
    expect(screen.getByRole('group', { name: '주민등록번호' })).toBeTruthy();
    expect(front().required).toBe(true);
    expect(back().type).toBe('password');
    expect(front().autocomplete).toBe('off');
    expect(back().maxLength).toBe(7);
    expect(front().maxLength).toBe(6);
  });

  it('두 칸에 입력하면 숫자만 합친 값과 유효 여부를 알리고, 앞칸을 채워도 포커스는 옮기지 않는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ResidentNumberInput onValueChange={onValueChange} />);
    await user.type(front(), '900101');
    expect(document.activeElement).toBe(front());
    expect(onValueChange).toHaveBeenLastCalledWith('900101', null);
    await user.type(back(), '1234567');
    expect(onValueChange).toHaveBeenLastCalledWith('9001011234567', true);
  });

  it('13자리를 앞칸에 붙여 넣으면 두 칸에 나눈다 (하이픈이 있어도)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ResidentNumberInput onValueChange={onValueChange} />);
    await user.click(front());
    await user.paste('900101-1234567');
    expect(front().value).toBe('900101');
    expect(back().value).toBe('1234567');
    expect(onValueChange).toHaveBeenLastCalledWith('9001011234567', true);
  });

  it('앞칸을 덜 채운 채 뒷칸을 써도 두 칸 값이 섞이지 않는다 (제어 모드)', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return <ResidentNumberInput value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await user.type(front(), '9001');
    await user.type(back(), '12');
    expect(front().value).toBe('9001');
    expect(back().value).toBe('12');
    await user.type(front(), '01');
    expect(front().value).toBe('900101');
    expect(back().value).toBe('12');
  });

  it('뒷칸이 비었을 때 Backspace 는 앞칸으로 간다', async () => {
    const user = userEvent.setup();
    render(<ResidentNumberInput defaultValue="900101" />);
    await user.click(back());
    await user.keyboard('{Backspace}');
    expect(document.activeElement).toBe(front());
    expect(front().value).toBe('900101');
  });

  it('다 채웠는데 생년월일이 없는 날이면 오류를 보여 주고 늦춰서 알린다', async () => {
    const user = userEvent.setup();
    render(<ResidentNumberInput defaultValue="900230123456" />);
    await user.type(back(), '7');
    expect(front().getAttribute('aria-invalid')).toBe('true');
    const helper = document.getElementById(back().getAttribute('aria-describedby')!);
    expect(helper?.textContent).toContain('올바른 주민등록번호가 아니에요');
    const status = screen.getByRole('status');
    expect(status.textContent).toBe(''); // 입력과 같은 순간에는 비워 두고
    await waitFor(() => expect(status.textContent).toContain('올바른 주민등록번호가 아니에요'));
  });

  it('덜 채운 채 묶음을 벗어나면 "13자리를 모두 입력해 주세요", 앞칸 → 뒷칸 이동은 벗어난 것이 아니다', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ResidentNumberInput />
        <button>다음</button>
      </>,
    );
    await user.type(front(), '9001');
    await user.click(back());
    expect(front().getAttribute('aria-invalid')).toBeNull();
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(front().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('13자리를 모두 입력해 주세요.')).toBeTruthy();
  });

  it('digits={7} 은 생년월일 + 뒷자리 첫 숫자만 받는다 (뒷칸은 가리지 않음)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ResidentNumberInput digits={7} onValueChange={onValueChange} />);
    const first = screen.getByRole('textbox', { name: '뒷자리 첫 숫자' }) as HTMLInputElement;
    expect(first.maxLength).toBe(1);
    await user.type(front(), '0502284'); // 앞칸은 6자리까지 — 7번째는 들어가지 않는다
    expect(front().value).toBe('050228');
    expect(first.value).toBe('');
    await user.type(first, '4');
    expect(onValueChange).toHaveBeenLastCalledWith('0502284', true);
  });

  it('name 이 있으면 숫자만 있는 값을 숨긴 input 으로 제출하고, focusField(id) 는 앞칸으로 간다', () => {
    render(
      <form data-testid="form">
        <ResidentNumberInput id="rrn" name="rrn" defaultValue="9001011234567" />
      </form>,
    );
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('rrn')).toBe('9001011234567');
    focusField('rrn');
    expect(document.activeElement).toBe(front());
  });
});
