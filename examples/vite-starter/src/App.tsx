import {
  AgreementGroup,
  AmountInput,
  Button,
  Card,
  CardBody,
  createIntentColors,
  createTheme,
  formatKoreanAmount,
  formatPhoneNumber,
  hasAllRequiredAgreements,
  NativeSelect,
  PhoneNumberInput,
  SegmentedControl,
  Stack,
  ThemeProvider,
  ToastProvider,
  Typography,
  useToast,
  VerificationCodeInput,
  type ThemeName,
} from '@bestow-ui/react';
import { useMemo, useState } from 'react';

const carriers = [
  { value: 'skt', label: 'SKT' },
  { value: 'kt', label: 'KT' },
  { value: 'lgu', label: 'LG U+' },
  { value: 'mvno', label: '알뜰폰' },
];

const agreements = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { value: 'ads', label: '광고성 정보 수신 동의' },
];

export function App() {
  const [mode, setMode] = useState<ThemeName>('light');
  const [brand, setBrand] = useState('#2563eb');
  // 대표색 하나로 라이트·다크 색 세트를 만든다 — 어떤 색을 골라도 글자 대비 4.5:1 을 지킨다
  const theme = useMemo(() => createTheme(createIntentColors('primary', brand)), [brand]);

  return (
    <ThemeProvider theme={mode} overrides={theme} style={{ minHeight: '100vh', padding: 24 }}>
      <ToastProvider>
        <Stack gap={6} style={{ maxWidth: 480, marginInline: 'auto' }}>
          <Stack gap={2}>
            <Typography variant="h1">BestOW UI 시작하기</Typography>
            <Typography color="muted">
              한국 서비스 키트·다크 모드·브랜드 테마를 바로 바꿔 보세요. 코드는 src/App.tsx 에 있어요.
            </Typography>
          </Stack>
          <Stack direction="row" gap={4} align="center" wrap>
            <SegmentedControl
              aria-label="화면 모드"
              value={mode}
              onValueChange={(value) => setMode(value as ThemeName)}
              options={[
                { value: 'light', label: '라이트' },
                { value: 'dark', label: '다크' },
              ]}
            />
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              대표색
              <input type="color" value={brand} onChange={(event) => setBrand(event.target.value)} />
            </label>
          </Stack>
          <Card>
            <CardBody>
              <SignupForm />
            </CardBody>
          </Card>
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}

function SignupForm() {
  const [carrier, setCarrier] = useState('');
  const [phone, setPhone] = useState(''); // 하이픈 없는 숫자만 ('01012345678')
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [agreed, setAgreed] = useState<string[]>([]);
  const { toast } = useToast();
  const canSubmit =
    carrier !== '' && phone.length >= 10 && code.length === 6 && hasAllRequiredAgreements(agreements, agreed);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        // 서식 함수 — 저장한 숫자를 '010-1234-5678', '12만 5,000원' 처럼 보여 준다
        toast({
          title: '가입했어요',
          description: `${carriers.find((c) => c.value === carrier)?.label} ${formatPhoneNumber(phone)} · 충전 ${formatKoreanAmount(amount ?? 0)}`,
          color: 'success',
        });
      }}
    >
      <Stack gap={5}>
        {/* NativeSelect — 브라우저 기본 select 라 가볍고(Radix Select 대비 폼 번들 약 1/8), 모바일에서는 운영체제 선택 창이 열린다 */}
        <NativeSelect
          label="통신사"
          placeholder="선택하세요"
          options={carriers}
          value={carrier}
          onValueChange={setCarrier}
          required
          fullWidth
        />
        <PhoneNumberInput value={phone} onValueChange={setPhone} required fullWidth />
        <VerificationCodeInput
          value={code}
          onValueChange={setCode}
          expiresIn={180}
          onResend={() => toast({ title: '인증번호를 다시 보냈어요' })}
          helperText="예제라서 아무 숫자 6자리나 넣으면 돼요."
        />
        <AmountInput label="충전 금액" value={amount} onValueChange={setAmount} fullWidth />
        <AgreementGroup label="약관 동의" items={agreements} value={agreed} onValueChange={setAgreed} />
        <Button type="submit" disabled={!canSubmit}>
          가입
        </Button>
      </Stack>
    </form>
  );
}
