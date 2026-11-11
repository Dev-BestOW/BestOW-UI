'use client';

import {
  AgreementGroup,
  AmountInput,
  Button,
  BusinessNumberInput,
  contrastRatio,
  createIntentColors,
  createTheme,
  hasAllRequiredAgreements,
  PhoneNumberInput,
  SegmentedControl,
  Stack,
  ThemeProvider,
  Typography,
  useToast,
  type AgreementItem,
} from '@bestow-ui/react';
import { useId, useMemo, useState } from 'react';

/** 대표색 후보 — 첫 값은 기본 테마의 primary(palette.blue[600]). 휴대폰 폭(360px)에서도 한 줄에 들어가게 4개, 그 밖의 색은 "직접 고르기" */
const BRANDS = [
  { value: '#2554eb', label: '파랑' },
  { value: '#7c3aed', label: '보라' },
  { value: '#0f766e', label: '청록' },
  { value: '#ea580c', label: '주황' },
];
const DEFAULT_BRAND = BRANDS[0].value;

const agreements: AgreementItem[] = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { value: 'ads', label: '광고성 정보 수신 동의' },
];

type IntentPair = { solid: string; contrast: string };
type IntentInput = { light: { color: { primary: IntentPair } }; dark: { color: { primary: IntentPair } } };

/** 버튼(solid 배경 위 글자) 대비 — createIntentColors 가 라이트·다크 모두 4.5:1 이상으로 만든다 */
function buttonContrast(hex: string) {
  const colors = createIntentColors('primary', hex) as unknown as IntentInput;
  const ratio = ({ solid, contrast }: IntentPair) => Math.floor(contrastRatio(contrast, solid) * 10) / 10;
  return { light: ratio(colors.light.color.primary), dark: ratio(colors.dark.color.primary) };
}

/**
 * 첫 화면 데모 — 한국 서비스 키트를 직접 입력해 보고, 대표색을 바꾸면 이 영역의 테마가 바로 바뀐다.
 * 바깥 ThemeProvider 의 라이트·다크 모드는 그대로 이어받고(theme 생략), overrides 로 브랜드만 얹는다.
 */
export function KitDemo() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [agreed, setAgreed] = useState<string[]>([]);
  const [agreementError, setAgreementError] = useState(false);
  const { toast } = useToast();
  const colorInputId = useId();

  const overrides = useMemo(
    () => (brand === DEFAULT_BRAND ? undefined : createTheme(createIntentColors('primary', brand))),
    [brand],
  );
  const contrast = useMemo(() => buttonContrast(brand), [brand]);

  const submit = () => {
    if (!hasAllRequiredAgreements(agreements, agreed)) {
      setAgreementError(true);
      return;
    }
    toast({
      title: '가입 버튼을 눌렀어요',
      description: '이 데모는 입력한 값을 어디에도 보내지 않아요.',
      color: 'success',
    });
  };

  return (
    <section aria-labelledby="demo-title" className="demo">
      <Stack gap={1}>
        <Typography id="demo-title" as="h2" variant="h4">
          직접 입력해 보세요
        </Typography>
        <Typography variant="body-sm" color="muted">
          하이픈·쉼표는 입력하는 동안 붙고, 사업자등록번호는 10자리를 채우면 검증 공식으로 확인해요.
        </Typography>
      </Stack>

      <div className="demo-brand">
        <SegmentedControl
          label="대표색"
          size="sm"
          options={BRANDS.map(({ value, label }) => ({
            value,
            label,
            icon: <span className="demo-swatch" style={{ background: value }} />,
          }))}
          value={BRANDS.some((b) => b.value === brand) ? brand : ''}
          onValueChange={setBrand}
        />
        <label className="demo-custom-color" htmlFor={colorInputId}>
          <input id={colorInputId} type="color" value={brand} onChange={(event) => setBrand(event.target.value)} />
          <Typography as="span" variant="body-sm">
            직접 고르기
          </Typography>
        </label>
      </div>

      <ThemeProvider overrides={overrides} className="demo-panel">
        <Stack gap={4}>
          <PhoneNumberInput label="휴대폰 번호" fullWidth />
          <BusinessNumberInput label="사업자등록번호" fullWidth />
          <AmountInput label="결제 금액" showKoreanAmount fullWidth />
          <AgreementGroup
            label="약관 동의"
            items={agreements}
            value={agreed}
            onValueChange={(value) => {
              setAgreed(value);
              if (hasAllRequiredAgreements(agreements, value)) setAgreementError(false);
            }}
            error={agreementError}
            helperText={agreementError ? '필수 약관에 모두 동의해 주세요.' : undefined}
          />
          <Button fullWidth onClick={submit}>
            가입하기
          </Button>
        </Stack>
      </ThemeProvider>

      <Typography variant="caption" color="muted" className="demo-contrast">
        이 색의 버튼 글자 대비는 라이트 {contrast.light}:1, 다크 {contrast.dark}:1 이에요(기준 4.5:1). 색을 어떻게
        고르든 기준을 넘도록 밝기를 조정해요.
      </Typography>
    </section>
  );
}
