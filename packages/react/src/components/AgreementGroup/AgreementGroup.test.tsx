import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgreementGroup } from './AgreementGroup';
import { hasAllRequiredAgreements, type AgreementItem } from './agreements';

const items: AgreementItem[] = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true, content: '제1조 목적 …' },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true, content: '수집 항목: 이름, 휴대폰 번호' },
  { value: 'marketing', label: '마케팅 정보 수신 동의', content: '이벤트 소식을 보내 드려요.' },
];

const all = () => screen.getByRole('checkbox', { name: '전체 동의' }) as HTMLInputElement;
const box = (name: string) => screen.getByRole('checkbox', { name }) as HTMLInputElement;

describe('AgreementGroup', () => {
  it('legend 가 그룹 이름이 되고, 항목 이름 앞에 필수·선택이 띄어쓰기와 함께 붙는다', () => {
    render(<AgreementGroup label="약관 동의" items={items} />);
    expect(screen.getByRole('group', { name: '약관 동의' })).toBeTruthy();
    expect(box('필수 서비스 이용약관 동의')).toBeTruthy();
    expect(box('선택 마케팅 정보 수신 동의')).toBeTruthy();
  });

  it('전체 동의를 누르면 모두 선택·해제되고, 일부만 선택하면 전체 동의가 부분 선택 상태가 된다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AgreementGroup items={items} onValueChange={onValueChange} />);

    await user.click(all());
    expect(onValueChange).toHaveBeenLastCalledWith(['terms', 'privacy', 'marketing']);
    expect(all().checked).toBe(true);

    await user.click(box('선택 마케팅 정보 수신 동의'));
    expect(all().checked).toBe(false);
    expect(all().indeterminate).toBe(true);

    await user.click(box('선택 마케팅 정보 수신 동의'));
    expect(all().checked).toBe(true);
    expect(all().indeterminate).toBe(false);

    await user.click(all());
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(all().indeterminate).toBe(false);
  });

  it('보기 버튼은 어떤 약관인지 이름에 담고, aria-expanded 로 내용을 펼치고 접는다', async () => {
    const user = userEvent.setup();
    render(<AgreementGroup items={items} />);
    const toggle = screen.getByRole('button', { name: '필수 서비스 이용약관 동의 보기' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('제1조 목적 …')).toBeNull();

    await user.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const region = screen.getByRole('region', { name: '필수 서비스 이용약관 동의' });
    expect(region.textContent).toBe('제1조 목적 …');
    expect(toggle.getAttribute('aria-controls')).toBe(region.id);
    expect(screen.getByRole('button', { name: '필수 서비스 이용약관 동의 접기' })).toBe(toggle);
  });

  it('hasAllRequiredAgreements 로 필수 동의 여부를 알 수 있고, 오류는 describedby·invalid 로 연결한다', async () => {
    const user = userEvent.setup();
    function Form() {
      const [agreed, setAgreed] = useState<string[]>([]);
      const ok = hasAllRequiredAgreements(items, agreed);
      return (
        <AgreementGroup
          label="약관 동의"
          items={items}
          value={agreed}
          onValueChange={setAgreed}
          error={!ok}
          helperText={ok ? '모두 확인했어요' : '필수 약관에 동의해 주세요'}
        />
      );
    }
    render(<Form />);
    const group = screen.getByRole('group', { name: '약관 동의' });
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('필수 약관에 동의해 주세요').id);
    expect(box('필수 서비스 이용약관 동의').getAttribute('aria-invalid')).toBe('true');
    expect(box('선택 마케팅 정보 수신 동의').hasAttribute('aria-invalid')).toBe(false);

    await user.click(box('필수 서비스 이용약관 동의'));
    await user.click(box('필수 개인정보 수집·이용 동의'));
    expect(screen.getByText('모두 확인했어요')).toBeTruthy();
  });

  it('name 이 있으면 동의한 항목을 form 에 제출한다', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgreementGroup name="agree" items={items} defaultValue={['terms']} />);
    await user.click(box('선택 마케팅 정보 수신 동의'));
    const values = [...container.querySelectorAll<HTMLInputElement>('input[type=hidden][name=agree]')].map(
      (i) => i.value,
    );
    expect(values).toEqual(['terms', 'marketing']);
  });
});
