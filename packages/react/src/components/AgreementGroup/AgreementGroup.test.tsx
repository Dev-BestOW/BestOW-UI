import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
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

describe('AgreementGroup 하위 항목', () => {
  const nested: AgreementItem[] = [
    { value: 'terms', label: '서비스 이용약관 동의', required: true },
    {
      value: 'marketing',
      label: '마케팅 정보 수신 동의',
      children: [
        { value: 'sms', label: '문자' },
        { value: 'email', label: '이메일' },
        { value: 'push', label: '앱 푸시' },
      ],
    },
  ];
  const parent = () => box('선택 마케팅 정보 수신 동의');

  it('부모를 누르면 하위 항목이 모두 켜지고, 다시 누르면 모두 꺼진다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AgreementGroup items={nested} onValueChange={onValueChange} />);
    await user.click(parent());
    const [on] = onValueChange.mock.lastCall!;
    expect(on).toHaveLength(3);
    expect(on).toEqual(expect.arrayContaining(['sms', 'email', 'push']));
    expect(parent().checked).toBe(true);
    await user.click(parent());
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('하위 항목 일부만 켜면 부모와 전체 동의가 부분 선택', async () => {
    const user = userEvent.setup();
    render(<AgreementGroup items={nested} />);
    await user.click(box('문자'));
    expect(parent().checked).toBe(false);
    expect(parent().indeterminate).toBe(true);
    expect(all().indeterminate).toBe(true);
    await user.click(box('이메일'));
    await user.click(box('앱 푸시'));
    expect(parent().checked).toBe(true);
    expect(parent().indeterminate).toBe(false);
  });

  it('전체 동의는 말단 value 만 낸다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AgreementGroup items={nested} onValueChange={onValueChange} />);
    await user.click(all());
    expect(onValueChange).toHaveBeenLastCalledWith(['terms', 'sms', 'email', 'push']);
    expect(all().checked).toBe(true);
  });

  it('옛 값에 부모 value 가 있어도 무시하고 제출하지 않는다', () => {
    const { container } = render(<AgreementGroup items={nested} defaultValue={['marketing']} name="agree" />);
    expect(parent().checked).toBe(false);
    expect(parent().indeterminate).toBe(false);
    expect(all().indeterminate).toBe(false);
    expect(container.querySelectorAll('input[type="hidden"][name="agree"]')).toHaveLength(0);
  });

  it('하위 항목 목록은 부모 이름을 갖고, 하위 항목 이름에는 필수·선택이 붙지 않는다', () => {
    render(<AgreementGroup items={nested} />);
    const list = screen.getByRole('list', { name: '선택 마케팅 정보 수신 동의' });
    expect(within(list).getAllByRole('checkbox')).toHaveLength(3);
    for (const name of ['문자', '이메일', '앱 푸시']) expect(within(list).getByRole('checkbox', { name })).toBeTruthy();
  });

  it('필수 부모의 동의하지 않은 하위 항목은 error 일 때 invalid', () => {
    const requiredNested: AgreementItem[] = [
      {
        value: 'age',
        label: '연령 확인',
        required: true,
        children: [
          { value: 'over14', label: '만 14세 이상' },
          { value: 'adult', label: '성인' },
        ],
      },
    ];
    render(<AgreementGroup items={requiredNested} defaultValue={['over14']} error />);
    expect(box('만 14세 이상').getAttribute('aria-invalid')).not.toBe('true');
    expect(box('성인').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('hasAllRequiredAgreements 하위 항목', () => {
  const requiredParent: AgreementItem[] = [
    {
      value: 'p',
      label: '필수 묶음',
      required: true,
      children: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    },
    { value: 'opt', label: '선택', children: [{ value: 'c', label: 'C' }] },
  ];
  it('필수 부모는 하위 항목이 모두 동의해야 충족된다', () => {
    expect(hasAllRequiredAgreements(requiredParent, ['a'])).toBe(false);
    expect(hasAllRequiredAgreements(requiredParent, ['a', 'b'])).toBe(true);
    expect(hasAllRequiredAgreements(requiredParent, ['p'])).toBe(false);
  });
});
