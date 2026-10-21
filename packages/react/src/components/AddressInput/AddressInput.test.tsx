import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressInput } from './AddressInput';
import type { AddressProvider } from './addressProviders';

/** 네트워크 없이 검색 화면 대신 버튼 하나를 그리는 가짜 공급자 */
const fakeProvider: AddressProvider = (container, onSelect) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '테헤란로 152 선택';
  button.onclick = () =>
    onSelect({ zonecode: '06236', address: '서울 강남구 테헤란로 152', extraAddress: ' (역삼동)' });
  container.appendChild(button);
  return () => button.remove();
};

describe('AddressInput', () => {
  it('"주소" 그룹 안에 우편번호·기본 주소·상세 주소 입력창이 있다', () => {
    render(<AddressInput provider={fakeProvider} />);
    const group = screen.getByRole('group', { name: '주소' });
    expect(group).toBeTruthy();
    expect((screen.getByRole('textbox', { name: '우편번호' }) as HTMLInputElement).readOnly).toBe(true);
    expect((screen.getByRole('textbox', { name: '기본 주소' }) as HTMLInputElement).readOnly).toBe(true);
    expect((screen.getByRole('textbox', { name: '상세 주소' }) as HTMLInputElement).readOnly).toBe(false);
  });

  it('주소 검색 → 고르면 값이 채워지고 검색 창이 닫히며, 포커스가 상세 주소로 간다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AddressInput provider={fakeProvider} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: '주소 검색' }));
    expect(screen.getByRole('dialog', { name: '주소 검색' })).toBeTruthy();

    await user.click(await screen.findByRole('button', { name: '테헤란로 152 선택' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect((screen.getByRole('textbox', { name: '우편번호' }) as HTMLInputElement).value).toBe('06236');
    expect((screen.getByRole('textbox', { name: '기본 주소' }) as HTMLInputElement).value).toBe(
      '서울 강남구 테헤란로 152 (역삼동)',
    );
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '상세 주소' })));
    expect(onValueChange).toHaveBeenLastCalledWith({
      zonecode: '06236',
      address: '서울 강남구 테헤란로 152',
      extraAddress: ' (역삼동)',
      detail: '',
    });

    await user.keyboard('5층');
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: '5층' }));
  });

  it('고르지 않고 닫으면 포커스가 검색 버튼으로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<AddressInput provider={fakeProvider} />);
    const button = screen.getByRole('button', { name: '주소 검색' });
    await user.click(button);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(button));
  });

  it('공급자가 실패하면 안내 문구를 알림 영역에 보여 준다', async () => {
    const user = userEvent.setup();
    const failing: AddressProvider = () => Promise.reject(new Error('network'));
    render(<AddressInput provider={failing} />);
    await user.click(screen.getByRole('button', { name: '주소 검색' }));
    expect(await screen.findByText(/주소 검색을 불러오지 못했어요/)).toBeTruthy();
  });

  it('name 이 있으면 우편번호·주소·상세 주소를 form 에 제출한다', () => {
    const { container } = render(
      <AddressInput
        provider={fakeProvider}
        name="shipping"
        defaultValue={{ zonecode: '06236', address: '서울 강남구 테헤란로 152', extraAddress: '', detail: '5층' }}
      />,
    );
    const hidden = (key: string) =>
      container.querySelector<HTMLInputElement>(`input[type=hidden][name="shipping[${key}]"]`)?.value;
    expect(hidden('zonecode')).toBe('06236');
    expect(hidden('address')).toBe('서울 강남구 테헤란로 152');
    expect(hidden('detail')).toBe('5층');
  });
});
