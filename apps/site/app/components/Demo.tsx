'use client';

import {
  AccountNumberInput,
  AddressInput,
  AgreementGroup,
  AmountInput,
  BusinessNumberInput,
  Calendar,
  CardNumberInput,
  CorporateNumberInput,
  DatePicker,
  DateRangePicker,
  dateRangePresets,
  hasAllRequiredAgreements,
  KOREAN_BANKS,
  PhoneNumberInput,
  ResidentNumberInput,
  Select,
  VerificationCodeInput,
  vars,
  type AddressProvider,
  type AddressValue,
  type AgreementItem,
  type DateRange,
} from '@bestow-ui/react';
import { useState, type ReactNode } from 'react';

// 날짜 데모는 "오늘" 을 고정한다 — 정적 HTML 이 빌드 날짜에 따라 달라지지 않고, E2E 가 같은 날짜를 고른다
const TODAY = '2026-11-14';
const todayNote = '예시라서 오늘을 2026년 11월 14일로 고정했어요';

/** 결과를 코드와 같은 모양(문자열은 작은따옴표)으로 — korean-utils 쪽 Try 와 같다 */
function show(value: unknown): string {
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) return `[${value.map(show).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value)
      .map(([key, v]) => `${key}: ${show(v)}`)
      .join(', ')} }`;
  }
  return String(value);
}

/** 컴포넌트가 넘긴 값 */
function Received({ rows }: { rows: Array<[label: string, value: unknown]> }) {
  return (
    <dl className="try-results">
      {rows.map(([label, value]) => (
        <div key={label} className="try-result">
          <dt>
            <code>{label}</code>
          </dt>
          <dd>
            <code>{show(value)}</code>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function PhoneNumber() {
  const [value, setValue] = useState('');
  return (
    <>
      <PhoneNumberInput
        value={value}
        onValueChange={setValue}
        helperText="가운데 숫자를 고치거나, 하이픈 뒤에서 지우거나, +82 10-1234-5678 을 붙여 넣어 보세요"
        fullWidth
      />
      <Received rows={[['onValueChange 로 받은 값', value]]} />
    </>
  );
}

/** 번호 입력(사업자·카드·법인·계좌)이 함께 쓰는 onValueChange(digits, valid) 결과 */
function useCheckedNumber() {
  const [state, setState] = useState<{ digits: string; valid: boolean | null }>({ digits: '', valid: null });
  return {
    onValueChange: (digits: string, valid: boolean | null) => setState({ digits, valid }),
    value: state.digits,
    rows: [
      ['digits', state.digits],
      ['valid', state.valid],
    ] as Array<[string, unknown]>,
  };
}

function BusinessNumber() {
  const field = useCheckedNumber();
  return (
    <>
      <BusinessNumberInput
        value={field.value}
        onValueChange={field.onValueChange}
        helperText="124-81-00998 을 넣은 뒤 마지막 숫자를 바꿔 보세요"
        fullWidth
      />
      <Received rows={field.rows} />
    </>
  );
}

function CardNumber() {
  const field = useCheckedNumber();
  return (
    <>
      <CardNumberInput
        value={field.value}
        onValueChange={field.onValueChange}
        helperText="시험용 번호 4111-1111-1111-1111 을 넣어 보세요"
        fullWidth
      />
      <Received rows={field.rows} />
    </>
  );
}

function CorporateNumber() {
  const field = useCheckedNumber();
  return (
    <>
      <CorporateNumberInput
        value={field.value}
        onValueChange={field.onValueChange}
        helperText="130111-0006246 을 넣은 뒤 마지막 숫자를 바꿔 보세요"
        fullWidth
      />
      <Received rows={field.rows} />
    </>
  );
}

const bankOptions = KOREAN_BANKS.map((bank) => ({ value: bank.code, label: bank.name }));

function AccountNumber() {
  const field = useCheckedNumber();
  const [bank, setBank] = useState<string>();
  return (
    <>
      <Select
        label="은행"
        placeholder="은행 선택"
        options={bankOptions}
        value={bank}
        onValueChange={setBank}
        fullWidth
      />
      <AccountNumberInput
        value={field.value}
        onValueChange={field.onValueChange}
        helperText="110-123-456789 처럼 하이픈이 든 번호를 붙여 넣어 보세요"
        fullWidth
      />
      <Received rows={[['bank', bank ?? ''], ...field.rows]} />
    </>
  );
}

function ResidentNumber() {
  const [state, setState] = useState<{ digits: string; valid: boolean | null }>({ digits: '', valid: null });
  return (
    <>
      <ResidentNumberInput
        onValueChange={(digits, valid) => setState({ digits, valid })}
        helperText="예시 번호 900101-1234567 을 앞칸에 통째로 붙여 넣어 보세요. 입력한 값은 이 브라우저 밖으로 보내지 않아요"
      />
      <Received
        rows={[
          ['digits.length', state.digits.length],
          ['valid', state.valid],
        ]}
      />
    </>
  );
}

function VerificationCode() {
  const [value, setValue] = useState('');
  const [completed, setCompleted] = useState('');
  return (
    <>
      <VerificationCodeInput
        value={value}
        onValueChange={setValue}
        onComplete={setCompleted}
        expiresIn={180}
        onResend={() => setCompleted('')}
      />
      <Received
        rows={[
          ['onValueChange 로 받은 값', value],
          ['onComplete 로 받은 값', completed],
        ]}
      />
    </>
  );
}

const agreementItems: AgreementItem[] = [
  {
    value: 'terms',
    label: '서비스 이용약관 동의',
    required: true,
    content: '제1조 (목적) 이 약관은 예시 서비스의 이용 조건과 절차를 정해요. (예시 문구)',
  },
  {
    value: 'privacy',
    label: '개인정보 수집·이용 동의',
    required: true,
    content: '수집 항목: 이름, 휴대폰 번호 · 이용 목적: 회원 관리 · 보관 기간: 탈퇴할 때까지. (예시 문구)',
  },
  { value: 'marketing', label: '마케팅 정보 수신 동의' },
];

function Agreement() {
  const [agreed, setAgreed] = useState<string[]>([]);
  return (
    <>
      <AgreementGroup label="약관 동의" items={agreementItems} value={agreed} onValueChange={setAgreed} />
      <Received
        rows={[
          ['onValueChange 로 받은 값', agreed],
          ['hasAllRequiredAgreements(items, 값)', hasAllRequiredAgreements(agreementItems, agreed)],
        ]}
      />
    </>
  );
}

function Amount() {
  const [amount, setAmount] = useState<number | null>(null);
  return (
    <>
      <AmountInput
        label="보낼 금액"
        value={amount}
        onValueChange={setAmount}
        max={5_000_000}
        helperText="한 번에 500만원까지 보낼 수 있어요"
        fullWidth
      />
      <Received rows={[['onValueChange 로 받은 값', amount]]} />
    </>
  );
}

const sampleAddresses = [
  { zonecode: '06236', address: '서울 강남구 테헤란로 152', extraAddress: ' (역삼동, 강남파이낸스센터)' },
  { zonecode: '04524', address: '서울 중구 세종대로 110', extraAddress: ' (태평로1가)' },
  { zonecode: '48058', address: '부산 해운대구 해운대해변로 264', extraAddress: ' (우동)' },
];

/** 데모용 가짜 공급자 — 카카오 스크립트를 부르지 않고 예시 주소 목록을 그린다(Storybook 스토리와 같은 방식) */
const sampleProvider: AddressProvider = (container, onSelect) => {
  const list = document.createElement('ul');
  Object.assign(list.style, { listStyle: 'none', margin: '0', padding: '8px', display: 'grid', gap: '4px' });
  for (const sample of sampleAddresses) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `[${sample.zonecode}] ${sample.address}${sample.extraAddress}`;
    Object.assign(button.style, {
      width: '100%',
      padding: '10px 12px',
      textAlign: 'left',
      border: `1px solid ${vars.color.border.default}`,
      borderRadius: vars.radius.md,
      background: vars.color.bg.default,
      color: vars.color.fg.default,
      font: 'inherit',
      cursor: 'pointer',
    });
    button.onclick = () => onSelect(sample);
    item.appendChild(button);
    list.appendChild(item);
  }
  container.appendChild(list);
  return () => list.remove();
};

function Address() {
  const [address, setAddress] = useState<AddressValue>({ zonecode: '', address: '', detail: '' });
  return (
    <>
      <AddressInput
        label="배송지"
        value={address}
        onValueChange={setAddress}
        provider={sampleProvider}
        helperText="이 데모는 카카오 대신 예시 주소 세 곳을 보여 주는 가짜 공급자를 써요"
      />
      <Received rows={[['onValueChange 로 받은 값', address]]} />
    </>
  );
}

function DateDemo() {
  const [date, setDate] = useState('');
  return (
    <>
      <DatePicker
        label="방문 예정일"
        value={date}
        onValueChange={setDate}
        today={TODAY}
        min={TODAY}
        helperText={`오늘부터 고를 수 있어요. ${todayNote}`}
        fullWidth
      />
      <Received rows={[['onValueChange 로 받은 값', date]]} />
    </>
  );
}

function DateRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: '', end: '' });
  return (
    <>
      <DateRangePicker
        label="조회 기간"
        value={range}
        onValueChange={setRange}
        presets={dateRangePresets}
        today={TODAY}
        max={TODAY}
        helperText={todayNote}
      />
      <Received rows={[['onValueChange 로 받은 값', range]]} />
    </>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState('');
  return (
    <>
      <Calendar value={date} onValueChange={setDate} today={TODAY} />
      <Received rows={[['onValueChange 로 받은 값', date]]} />
    </>
  );
}

const demos: Record<string, () => ReactNode> = {
  'phone-number-input': PhoneNumber,
  'business-number-input': BusinessNumber,
  'verification-code-input': VerificationCode,
  'agreement-group': Agreement,
  'amount-input': Amount,
  'address-input': Address,
  'resident-number-input': ResidentNumber,
  'card-number-input': CardNumber,
  'account-number-input': AccountNumber,
  'corporate-number-input': CorporateNumber,
  'date-picker': DateDemo,
  'date-range-picker': DateRangeDemo,
  calendar: CalendarDemo,
};

/** 컴포넌트 문서 쪽의 "직접 입력해 보세요" — slug 로 고른다(korean-utils Try 와 같은 방식) */
export function Demo({ slug }: { slug: string }) {
  const Component = demos[slug];
  if (!Component) return null;
  return (
    <div className="try">
      <Component />
    </div>
  );
}
