'use client';

import {
  accountNumberDigits,
  cardNumberLength,
  composeExtraAddress,
  formatBusinessNumber,
  formatCardNumber,
  formatCorporateNumber,
  formatKoreanAmount,
  formatKoreanDate,
  formatPhoneNumber,
  formatResidentNumber,
  isValidAccountNumber,
  isValidBusinessNumber,
  isValidCardNumber,
  isValidCorporateNumber,
  isValidResidentNumber,
  maskCardNumber,
  maskDigits,
  maskName,
  maskPhoneNumber,
  maskResidentNumber,
  parseResidentNumber,
  phoneNumberDigits,
  phoneNumberMaxDigits,
} from '@bestow-ui/korean-utils';
import { Checkbox, Stack, TextField } from '@bestow-ui/react';
import { useState, type ReactNode } from 'react';

/** 결과를 코드 예시와 같은 모양(문자열은 작은따옴표)으로 보여 준다 */
function show(value: unknown): string {
  if (typeof value === 'string') return `'${value}'`;
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value)
      .map(([key, v]) => `${key}: ${show(v)}`)
      .join(', ')} }`;
  }
  return String(value);
}

type Row = [call: string, value: unknown];

function Results({ rows }: { rows: Row[] }) {
  return (
    <dl className="try-results">
      {rows.map(([call, value]) => (
        <div key={call} className="try-result">
          <dt>
            <code>{call}</code>
          </dt>
          <dd>
            <code>{show(value)}</code>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode = 'numeric',
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: 'numeric' | 'text';
  helperText?: ReactNode;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode={inputMode}
      autoComplete="off"
      helperText={helperText}
      fullWidth
    />
  );
}

function PhoneNumber() {
  const [value, setValue] = useState('0212345678');
  const digits = phoneNumberDigits(value);
  return (
    <>
      <Field label="전화번호" value={value} onChange={setValue} helperText="010·02·031·070·1588·+82 로 바꿔 보세요" />
      <Results
        rows={[
          ['formatPhoneNumber(입력)', formatPhoneNumber(value)],
          ['phoneNumberDigits(입력)', digits],
          ['phoneNumberMaxDigits(숫자)', phoneNumberMaxDigits(digits)],
        ]}
      />
    </>
  );
}

function BusinessNumber() {
  const [value, setValue] = useState('1248100998');
  return (
    <>
      <Field label="사업자등록번호" value={value} onChange={setValue} helperText="마지막 숫자를 바꿔 보세요" />
      <Results
        rows={[
          ['formatBusinessNumber(입력)', formatBusinessNumber(value)],
          ['isValidBusinessNumber(입력)', isValidBusinessNumber(value)],
        ]}
      />
    </>
  );
}

function KoreanAmount() {
  const [value, setValue] = useState('1234567890');
  const amount = Number(value.replace(/[^\d-]/g, '')) || 0;
  return (
    <>
      <Field label="금액(숫자)" value={value} onChange={setValue} />
      <Results rows={[['formatKoreanAmount(입력)', formatKoreanAmount(amount)]]} />
    </>
  );
}

function ResidentNumber() {
  const [value, setValue] = useState('900101-1234567');
  return (
    <>
      <Field
        label="주민등록번호(예시 번호)"
        value={value}
        onChange={setValue}
        helperText="입력한 값은 이 브라우저 안에서만 계산하고 어디에도 보내지 않아요"
      />
      <Results
        rows={[
          ['parseResidentNumber(입력)', parseResidentNumber(value)],
          ['isValidResidentNumber(입력)', isValidResidentNumber(value)],
          ['formatResidentNumber(입력)', formatResidentNumber(value)],
          ['maskResidentNumber(입력)', maskResidentNumber(value)],
        ]}
      />
    </>
  );
}

function Masking() {
  const [name, setName] = useState('남궁민수');
  const [phone, setPhone] = useState('01012345678');
  const [account, setAccount] = useState('110-123-456789');
  return (
    <>
      <Field label="이름" value={name} onChange={setName} inputMode="text" />
      <Field label="전화번호" value={phone} onChange={setPhone} />
      <Field label="계좌번호" value={account} onChange={setAccount} />
      <Results
        rows={[
          ['maskName(이름)', maskName(name)],
          ['maskPhoneNumber(전화번호)', maskPhoneNumber(phone)],
          ['maskDigits(계좌번호, { end: 4 })', maskDigits(account, { end: 4 })],
        ]}
      />
    </>
  );
}

function CardNumber() {
  const [value, setValue] = useState('378282246310005');
  return (
    <>
      <Field
        label="카드번호(시험용 번호)"
        value={value}
        onChange={setValue}
        helperText="결제사들이 공개한 시험용 번호예요. 실제 카드번호는 넣지 마세요"
      />
      <Results
        rows={[
          ['formatCardNumber(입력)', formatCardNumber(value)],
          ['isValidCardNumber(입력)', isValidCardNumber(value)],
          ['cardNumberLength(입력)', cardNumberLength(value)],
          ['maskCardNumber(formatCardNumber(입력))', maskCardNumber(formatCardNumber(value))],
        ]}
      />
    </>
  );
}

function CorporateNumber() {
  const [value, setValue] = useState('1301110006246');
  return (
    <>
      <Field label="법인등록번호" value={value} onChange={setValue} helperText="마지막 숫자를 바꿔 보세요" />
      <Results
        rows={[
          ['formatCorporateNumber(입력)', formatCorporateNumber(value)],
          ['isValidCorporateNumber(입력)', isValidCorporateNumber(value)],
        ]}
      />
    </>
  );
}

function BankAccount() {
  const [value, setValue] = useState('110-123-456789');
  return (
    <>
      <Field label="계좌번호" value={value} onChange={setValue} />
      <Results
        rows={[
          ['accountNumberDigits(입력)', accountNumberDigits(value)],
          ['isValidAccountNumber(입력)', isValidAccountNumber(value)],
        ]}
      />
    </>
  );
}

function KoreanDate() {
  // 오늘 날짜로 시작하면 서버(빌드 때)와 브라우저가 달라 hydration 오류가 난다 — 고정 날짜로 시작
  const [value, setValue] = useState('2026-10-15');
  const [y, m, d] = value.split('-').map(Number);
  const date = y && m && d ? new Date(y, m - 1, d) : null;
  return (
    <>
      <TextField label="날짜" type="date" value={value} onChange={(event) => setValue(event.target.value)} />
      <Results
        rows={
          date
            ? [
                ['formatKoreanDate(날짜)', formatKoreanDate(date)],
                ['formatKoreanDate(날짜, false)', formatKoreanDate(date, false)],
              ]
            : []
        }
      />
    </>
  );
}

function ExtraAddress() {
  const [bname, setBname] = useState('역삼동');
  const [buildingName, setBuildingName] = useState('래미안');
  const [apartment, setApartment] = useState(true);
  const [road, setRoad] = useState(true);
  return (
    <>
      <Field label="법정동·법정리 이름(bname)" value={bname} onChange={setBname} inputMode="text" />
      <Field label="건물 이름(buildingName)" value={buildingName} onChange={setBuildingName} inputMode="text" />
      <Stack gap={2}>
        <Checkbox label="공동주택(apartment: 'Y')" checked={apartment} onCheckedChange={setApartment} />
        <Checkbox label="도로명 주소를 고름(userSelectedType: 'R')" checked={road} onCheckedChange={setRoad} />
      </Stack>
      <Results
        rows={[
          [
            'composeExtraAddress(data)',
            composeExtraAddress({
              userSelectedType: road ? 'R' : 'J',
              bname,
              buildingName,
              apartment: apartment ? 'Y' : 'N',
            }),
          ],
        ]}
      />
    </>
  );
}

const demos: Record<string, () => ReactNode> = {
  'phone-number': PhoneNumber,
  'business-number': BusinessNumber,
  'korean-amount': KoreanAmount,
  'resident-number': ResidentNumber,
  masking: Masking,
  'card-number': CardNumber,
  'corporate-number': CorporateNumber,
  'bank-account': BankAccount,
  'korean-date': KoreanDate,
  'extra-address': ExtraAddress,
};

/** 함수 문서의 "직접 입력해 보세요" — 입력하는 동안 함수 결과를 바로 보여 준다 */
export function Try({ slug }: { slug: string }) {
  const Demo = demos[slug];
  if (!Demo) return null;
  return (
    <div className="try">
      <Demo />
    </div>
  );
}
