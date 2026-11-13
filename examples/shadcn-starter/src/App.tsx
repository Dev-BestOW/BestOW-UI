import {
  AgreementGroup,
  BusinessNumberInput,
  formatBusinessNumber,
  formatPhoneNumber,
  hasAllRequiredAgreements,
  PhoneNumberInput,
  ThemeProvider,
  VerificationCodeInput,
} from '@bestow-ui/react';
import { useEffect, useState, type FormEvent } from 'react';
import { shadcnBridge } from './bestow-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const agreements = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true, content: '서비스 이용약관 내용(예제)' },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true, content: '개인정보 수집·이용 내용(예제)' },
  { value: 'ads', label: '광고성 정보 수신 동의' },
];

export function App() {
  const [dark, setDark] = useState(false);

  // shadcn/ui 는 <html class="dark"> 로 다크 모드를 켠다 — BestOW 는 ThemeProvider 의 theme 으로 같은 값을 받는다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <ThemeProvider theme={dark ? 'dark' : 'light'} overrides={shadcnBridge} className="min-h-screen px-4 py-10">
      <main className="mx-auto flex max-w-md flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">사업자 회원가입</h1>
          <Button variant="outline" size="sm" aria-pressed={dark} onClick={() => setDark((value) => !value)}>
            다크 모드
          </Button>
        </header>
        <SignupCard />
      </main>
    </ThemeProvider>
  );
}

function SignupCard() {
  const [businessNumber, setBusinessNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');

  const agreementError = submitted && !hasAllRequiredAgreements(agreements, agreed);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!hasAllRequiredAgreements(agreements, agreed)) {
      setResult('');
      return;
    }
    setResult(`${formatBusinessNumber(businessNumber)} · ${formatPhoneNumber(phone)} 로 가입 요청을 보냈어요(예제).`);
  };

  return (
    // 바깥 Card·Button 은 shadcn/ui, 안쪽 입력은 BestOW 한국 키트
    <Card>
      <CardHeader>
        <CardTitle>정산 받을 사업자 정보</CardTitle>
        <CardDescription>shadcn/ui 화면에 BestOW 한국 키트 입력만 얹은 예제예요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-5">
          <BusinessNumberInput value={businessNumber} onValueChange={setBusinessNumber} required fullWidth />
          <PhoneNumberInput value={phone} onValueChange={setPhone} required fullWidth />
          <VerificationCodeInput
            value={code}
            onValueChange={setCode}
            expiresIn={180}
            onResend={() => setCode('')}
            helperText="예제라서 아무 숫자 6자리나 넣으면 돼요."
          />
          <AgreementGroup
            label="약관 동의"
            items={agreements}
            value={agreed}
            onValueChange={setAgreed}
            error={agreementError}
            helperText={agreementError ? '필수 약관에 동의해 주세요.' : undefined}
          />
        </CardContent>
        <CardFooter className="mt-6 flex-col items-stretch gap-3">
          <Button type="submit">가입하기</Button>
          <p role="status" className="text-sm">
            {result}
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
