// 한국 키트 컴포넌트 문서(/components/<slug>/) — 쪽마다 직접 쓰는 글. 계획: docs/SEO-GEO-PLAN.md.
// props·키보드·스크린리더 절은 빌드 때 소스에서 읽어 온다(source.ts) — 여기에는 소스에 없는 글만 둔다.
// korean-utils 함수 쪽(guides.ts)과 겹치지 않게 "입력 칸으로서의 문제"(커서·지우기·붙여넣기·키패드·알림)를 쓴다.
// 실제 동작은 컴포넌트 소스·스토리·테스트에서 확인하고 쓴다. 동작을 바꾸면 여기도 고친다.

export interface KitPage {
  slug: string;
  /** 컴포넌트 이름 — packages/react/src/components/<name>/<name>.tsx 와 componentA11y.ts 항목에서 찾는다 */
  name: string;
  /** 제목(h1·<title>) — 검색어에 가깝게 */
  title: string;
  /** 머리말·meta description 에 쓰는 한두 문장 */
  summary: string;
  /** 무엇이 어려운가요 — 문단 */
  problem: string[];
  code: string;
  /** 알아 둘 점 */
  notes: string[];
  /** Storybook 문서의 `?path=` 값 */
  storybookPath: string;
  /** 같은 서식·검증 함수 쪽(/korean-utils/<utilsSlug>/) */
  utilsSlug?: string;
}

/** 이 쪽들의 JSON-LD 날짜 — 글을 고치면 modified 를 그날로 */
export const kitDates = { published: '2026-11-15', modified: '2026-11-17' };

export const kitPages: KitPage[] = [
  {
    slug: 'phone-number-input',
    name: 'PhoneNumberInput',
    title: 'React 전화번호 입력 컴포넌트 — 하이픈 자동·커서 유지',
    summary:
      '입력하는 대로 010-1234-5678 처럼 하이픈을 넣고, 값은 숫자만 넘기는 React 입력 칸이에요. 중간을 고쳐도 커서가 제자리에 있고, 하이픈 뒤 Backspace·붙여넣기·휴대폰 전화 키패드까지 챙겼어요.',
    problem: [
      '입력값에 하이픈을 끼워 넣어 value 를 바꾸면, 가운데 숫자를 고칠 때 커서가 맨 끝으로 튀어요. 하이픈이 생기거나 빠지면서 글자 위치가 바뀌기 때문이에요.',
      '하이픈 바로 뒤에서 Backspace 를 누르면 하이픈만 지워졌다가 서식이 곧바로 다시 넣어요. 사용자에게는 아무리 눌러도 지워지지 않는 칸처럼 보여요.',
      '붙여 넣은 값(+82 10-1234-5678, 공백·괄호가 섞인 번호)과 브라우저 자동 완성 값도 같은 서식으로 맞춰야 하고, 서버에는 숫자만 보내야 해요. 휴대폰에서는 글자 자판이 아니라 전화 키패드가 떠야 하고요.',
    ],
    code: `import { PhoneNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function SignupPhone() {
  const [phone, setPhone] = useState(''); // '01012345678' — 숫자만

  return (
    <PhoneNumberInput
      label="휴대폰 번호"
      required
      value={phone}
      onValueChange={setPhone}
      helperText="인증번호를 받을 번호예요"
    />
  );
}`,
    notes: [
      'value·onValueChange 는 숫자만 든 문자열이에요. 하이픈은 화면에만 있어요.',
      'name 을 주고 form 을 그대로 제출하면 화면 글자(010-1234-5678)가 가요. 서버에서는 korean-utils 의 phoneNumberDigits 로 숫자만 남기세요.',
      '자릿수가 모자란 번호를 오류로 막지는 않아요. 제출할 때 확인해서 error·helperText 로 알려 주세요.',
      '기본 레이블은 "휴대폰 번호", placeholder 는 "010-0000-0000" 이에요. 유선 번호도 받으면 label 을 바꾸세요. LocaleProvider 로 영어 문구를 쓸 수 있어요.',
      '앱에 styles.css 를 한 번 불러오고 ThemeProvider 로 감싸야 모양이 들어가요(시작 방법은 첫 화면).',
    ],
    storybookPath: '/docs/korean-kit-phonenumberinput--docs',
    utilsSlug: 'phone-number',
  },
  {
    slug: 'business-number-input',
    name: 'BusinessNumberInput',
    title: 'React 사업자등록번호 입력 컴포넌트 — 하이픈 자동·검증 공식',
    summary:
      '입력하는 대로 123-45-67890 형태로 하이픈을 넣고, 10자리를 채우는 순간 검증 공식으로 오타를 알려 주는 React 입력 칸이에요. 값은 숫자만, 검증 결과는 onValueChange 의 두 번째 인자로 받아요.',
    problem: [
      '검증 결과를 언제 보여 줄지가 어려워요. 한 글자 칠 때마다 "올바르지 않아요" 가 뜨면 입력하는 내내 빨간 글자를 보게 되고, 제출할 때만 보여 주면 오타를 너무 늦게 알아요.',
      '10자리를 채운 순간 생긴 오류는 스크린리더가 놓치기 쉬워요. 칸의 설명(aria-describedby)은 칸에 다시 들어가야 읽히고, 입력과 같은 순간에 바꾼 알림은 VoiceOver 가 버려요.',
      '하이픈을 넣는 입력이라 전화번호와 같은 문제(가운데를 고치면 커서가 끝으로 튐, 하이픈 뒤 Backspace 가 먹지 않음)도 그대로 생겨요.',
    ],
    code: `import { BusinessNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function CompanyForm() {
  const [bizNo, setBizNo] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  return (
    <BusinessNumberInput
      required
      value={bizNo}
      onValueChange={(digits, isValid) => {
        setBizNo(digits); // '1248100998' — 숫자만
        setValid(isValid); // 10자리를 채우기 전에는 null
      }}
    />
  );
}`,
    notes: [
      '검증 공식은 오타를 거르는 용도예요. 실제로 등록된 사업자인지, 휴업·폐업했는지는 국세청 사업자 상태 조회가 필요해요.',
      '입력하는 동안에는 오류를 띄우지 않아요. 10자리를 채우면 바로 검증하고, 덜 채운 채 칸을 벗어나면 "10자리를 모두 입력해 주세요." 를 보여 줘요.',
      '10자리를 채운 순간의 오류는 입력이 0.8초 멈춘 뒤, 처음부터 있던 숨은 status 영역으로 한 번 알려요.',
      'error·helperText 를 직접 주면 자동 검증보다 우선해요. 서버 조회 결과를 보여 줄 때 쓰세요. 자동 검증을 끄려면 validate={false} 예요.',
      'name 을 주고 form 을 그대로 제출하면 하이픈이 든 화면 글자가 가요. 서버에서는 숫자만 남기세요.',
    ],
    storybookPath: '/docs/korean-kit-businessnumberinput--docs',
    utilsSlug: 'business-number',
  },
  {
    slug: 'verification-code-input',
    name: 'VerificationCodeInput',
    title: 'React 인증번호 입력 컴포넌트 — 문자 자동 채우기·남은 시간·재전송',
    summary:
      '문자로 받은 6자리 인증번호를 받는 React 입력 칸이에요. 실제 입력창은 하나라 휴대폰의 문자 자동 채우기와 붙여넣기가 그대로 되고, 남은 시간·만료 안내·재전송 버튼이 들어 있어요.',
    problem: [
      '칸 6개를 input 6개로 만드는 흔한 방식은 문제가 많아요. 문자 자동 채우기(autocomplete="one-time-code")가 첫 칸에만 들어가고, 붙여 넣은 번호가 한 칸에 몰리고, 스크린리더는 빈 입력 칸을 여섯 번 읽어요.',
      '남은 시간을 매초 바꿔 알리면 스크린리더가 매초 읽어서 입력을 방해해요. 그런데 시간이 다 됐다는 사실은 꼭 알려야 해요.',
      '탭을 잠시 떠났다 돌아오면 타이머가 늦게 돌아, 화면의 남은 시간이 실제와 어긋나기도 해요.',
    ],
    code: `import { VerificationCodeInput } from '@bestow-ui/react';

export function PhoneVerification({
  onVerify,
  onResend,
}: {
  onVerify: (code: string) => void;
  onResend: () => void;
}) {
  return (
    <VerificationCodeInput
      length={6}
      expiresIn={180} // 3분. 0 이 되면 만료 안내를 읽어 줘요
      onComplete={onVerify} // 6자리를 다 채우면 불러요 (자동 제출)
      onResend={onResend} // 재전송 버튼 — 입력값과 남은 시간을 처음으로
    />
  );
}`,
    notes: [
      '칸 모양은 화면 표시용이에요. 스크린리더는 "인증번호" 입력 하나로 읽고, "6자리 숫자를 입력하세요." 안내를 설명으로 함께 읽어요.',
      'autocomplete="one-time-code" 를 달아 두었어요. 자동 채우기 제안을 띄울지는 휴대폰 OS·브라우저가 정해요.',
      '남은 시간은 끝나는 시각을 기준으로 계산해서, 탭이 잠시 멈췄다 돌아와도 어긋나지 않아요. 남은 시간은 timer 역할이라 매초 읽지 않아요.',
      'type="alphanumeric" 이면 영문·숫자를 받고 대문자로 바꿔요.',
      '시간 제한이 있으면 연장할 방법이 필요해요(KWCAG 6.3.1). 만료 시간은 넉넉하게 두고 onResend 로 재전송 버튼을 함께 주세요.',
    ],
    storybookPath: '/docs/korean-kit-verificationcodeinput--docs',
  },
  {
    slug: 'agreement-group',
    name: 'AgreementGroup',
    title: 'React 약관 전체 동의 체크박스 — 필수·선택 표시와 약관 펼치기',
    summary:
      '"전체 동의" 와 개별 약관이 서로 맞춰지는 React 약관 동의 묶음이에요. 일부만 동의하면 전체 동의가 부분 선택 상태로 보이고, 항목마다 필수·선택 표시와 약관 내용 펼치기가 있어요.',
    problem: [
      '전체 동의 체크박스를 직접 만들면 상태를 맞추는 코드가 길어져요. 전체를 누르면 모두 켜고, 하나를 끄면 전체도 꺼지고, 일부만 켜졌을 때는 부분 선택으로 보여야 해요.',
      '필수·선택을 색이나 위치로만 구분하면 스크린리더 사용자는 어느 약관이 필수인지 몰라요. "필수" 라는 글자가 체크박스 이름 안에 들어가야 해요.',
      '"보기" 버튼이 여러 개 있으면 모두 "보기" 로만 읽혀서, 어떤 약관을 펼치는 버튼인지 알 수 없어요.',
    ],
    code: `import { AgreementGroup, hasAllRequiredAgreements, type AgreementItem } from '@bestow-ui/react';
import { useState } from 'react';

const items: AgreementItem[] = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true, content: '제1조 (목적) …' },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true, content: '수집 항목: …' },
  { value: 'marketing', label: '마케팅 정보 수신 동의' },
];

export function SignupAgreements({ submitted }: { submitted: boolean }) {
  const [agreed, setAgreed] = useState<string[]>([]);
  const missing = submitted && !hasAllRequiredAgreements(items, agreed);

  return (
    <AgreementGroup
      label="약관 동의"
      items={items}
      value={agreed}
      onValueChange={setAgreed}
      error={missing}
      helperText={missing ? '필수 약관에 동의해 주세요.' : undefined}
    />
  );
}`,
    notes: [
      '필수 동의를 확인하는 것은 쓰는 쪽 몫이에요. hasAllRequiredAgreements(items, value) 로 확인하고, 빠졌으면 error·helperText 를 주세요. error 일 때는 동의하지 않은 필수 항목만 빨갛게 표시돼요.',
      '"보기" 버튼의 이름은 "필수 서비스 이용약관 동의 보기" 처럼 어떤 약관인지 담아요. 펼친 약관은 이름 있는 영역이에요.',
      '선택 항목을 처음부터 동의한 상태(defaultValue)로 두지 마세요. 선택 동의는 사용자가 직접 골라야 해요.',
      'name 을 주면 동의한 value 마다 hidden input 이 생겨 form 으로 제출돼요.',
      '"전체 동의"·"필수"·"선택"·"보기"·"접기" 문구는 prop 이나 LocaleProvider 로 바꿀 수 있어요.',
    ],
    storybookPath: '/docs/korean-kit-agreementgroup--docs',
  },
  {
    slug: 'amount-input',
    name: 'AmountInput',
    title: 'React 금액 입력 컴포넌트 — 천 단위 쉼표·한글 금액 읽기',
    summary:
      '입력하는 대로 1,250,000 처럼 쉼표를 넣고, 아래에 "125만원" 처럼 읽기 쉬운 금액을 보여 주는 React 입력 칸이에요. 값은 number 로 넘겨요.',
    problem: [
      '0 이 많은 금액은 눈으로 세기 어려워요. 1000000 과 10000000 은 한눈에 구분되지 않아서, 송금·결제 화면에서는 "100만원" 처럼 한글로 함께 보여 주는 편이 안전해요.',
      'input type="number" 는 쉼표를 넣을 수 없고, 마우스 휠이나 화살표 키로 값이 바뀌고, e·+·- 같은 글자를 받아들이는 방식이 브라우저마다 달라요.',
      '쉼표를 끼워 넣으면 커서가 끝으로 튀고, 쉼표 뒤에서 Backspace 가 먹지 않는 문제가 그대로 생겨요.',
    ],
    code: `import { AmountInput } from '@bestow-ui/react';
import { useState } from 'react';

export function TransferAmount() {
  const [amount, setAmount] = useState<number | null>(null); // 비우면 null

  return (
    <AmountInput
      label="보낼 금액"
      value={amount}
      onValueChange={setAmount}
      max={5_000_000}
      helperText="한 번에 500만원까지 보낼 수 있어요"
    />
  );
}`,
    notes: [
      '값은 number, 비우면 null 이에요. 음수와 소수점은 받지 않아요(원 단위 정수).',
      'max 를 넘게 입력하면 max 로 맞춰요. 왜 맞춰졌는지 알 수 있게 helperText 로 한도를 함께 알려 주세요.',
      '한글 금액은 도움말 자리에 보이고, 스크린리더도 칸 설명으로 함께 읽어요. helperText 를 주면 그 아래 줄에 붙어요. 끄려면 showKoreanAmount={false} 예요.',
      'unit 으로 단위를 바꿔요(예: "포인트"). 칸 뒤와 한글 금액에 함께 붙어요.',
      '최대 15자리(천조 원 단위)까지 받아요. name 으로 form 을 그대로 제출하면 쉼표가 든 화면 글자가 가요.',
    ],
    storybookPath: '/docs/korean-kit-amountinput--docs',
    utilsSlug: 'korean-amount',
  },
  {
    slug: 'address-input',
    name: 'AddressInput',
    title: 'React 주소 검색 입력 — 카카오 우편번호 서비스 연동',
    summary:
      '"주소 검색" 버튼으로 카카오(다음) 우편번호 검색 창을 열고, 고른 우편번호·기본 주소·참고 항목을 채운 뒤 상세 주소 칸으로 포커스를 옮기는 React 주소 입력이에요. 검색 공급자는 바꿔 끼울 수 있어요.',
    problem: [
      '카카오 우편번호 서비스를 붙이려면 스크립트를 불러오고, 검색 창을 띄우고, 고른 결과에서 도로명·지번 주소와 참고 항목(법정동·건물명)을 조합해야 해요. 회원가입·배송지·사업장 주소마다 같은 코드를 되풀이하게 돼요.',
      '주소를 고른 뒤 포커스가 페이지 맨 위나 검색 버튼에 남으면, 키보드·스크린리더 사용자는 상세 주소 칸을 다시 찾아가야 해요.',
      '외부 스크립트에 묶인 입력은 테스트와 개발 화면에서도 네트워크에 기대게 돼요.',
    ],
    code: `import { AddressInput, type AddressValue } from '@bestow-ui/react';
import { useState } from 'react';

export function ShippingAddress() {
  const [address, setAddress] = useState<AddressValue>({ zonecode: '', address: '', detail: '' });

  return <AddressInput label="배송지" required value={address} onValueChange={setAddress} />;
}`,
    notes: [
      '기본 공급자는 카카오 우편번호 서비스예요. 처음 "주소 검색" 을 누를 때 스크립트(t1.kakaocdn.net)를 불러와요. CSP 를 쓰면 이 주소를 허용하세요.',
      'provider 로 다른 주소 서비스(행정안전부 도로명주소 API 등)나 테스트용 가짜 공급자를 넣을 수 있어요. 이 쪽의 데모도 가짜 공급자예요.',
      '우편번호·기본 주소는 읽기 전용이고, 상세 주소만 직접 입력해요. 검색 화면을 불러오는 중·실패는 status 로 알려요.',
      'name 을 주면 `${name}[zonecode]`·`${name}[address]`·`${name}[detail]` 로 제출돼요.',
      '검색 화면 자체의 접근성은 공급자 몫이에요. 주소를 직접 입력해야 하는 사용자를 위한 대안도 생각해 주세요.',
    ],
    storybookPath: '/docs/korean-kit-addressinput--docs',
    utilsSlug: 'extra-address',
  },
  {
    slug: 'resident-number-input',
    name: 'ResidentNumberInput',
    title: 'React 주민등록번호 입력 컴포넌트 — 뒷자리 가림·붙여넣기 나누기',
    summary:
      '앞 6자리와 뒷자리를 두 칸으로 받고 뒷자리는 가리는 React 주민등록번호 입력이에요. 13자리를 앞칸에 통째로 붙여 넣으면 두 칸에 나눠 넣고, 나이·성별만 필요하면 7자리만 받을 수 있어요.',
    problem: [
      '주민등록번호를 두 칸으로 나누면 붙여넣기가 깨지기 쉬워요. 13자리를 앞칸에 붙여 넣으면 6자리에서 잘려 뒷자리가 사라져요.',
      '앞칸을 다 채우면 저절로 뒷칸으로 넘기는 화면이 많은데, 예고 없는 포커스 이동은 스크린리더 사용자를 헷갈리게 해요(WCAG 3.2.2). 반대로 뒷칸이 비었을 때 Backspace 로 앞칸에 돌아갈 수 없으면 불편해요.',
      '마지막 검증 숫자 공식은 2020년 10월 이후 발급된 번호에는 맞지 않아요. 옛 공식으로 검사하면 정상 번호를 오류로 막아요.',
    ],
    code: `import { ResidentNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function IdentityForm() {
  const [rrn, setRrn] = useState(''); // '9001011234567' — 숫자만

  return <ResidentNumberInput required value={rrn} onValueChange={(digits) => setRrn(digits)} />;
}

// 나이·성별만 필요하면 생년월일 + 뒷자리 첫 숫자만
<ResidentNumberInput digits={7} label="생년월일과 성별" />;`,
    notes: [
      '주민등록번호는 법령에 근거가 있을 때만 수집할 수 있어요(개인정보 보호법 제24조의2). 나이·성별만 필요하면 digits={7} 로 생년월일과 뒷자리 첫 숫자만 받으세요.',
      '검증은 생년월일과 뒷자리 첫 숫자만 봐요. 마지막 검증 숫자는 보지 않아요.',
      '앞칸을 다 채워도 포커스를 옮기지 않아요. 뒷칸이 비었을 때 Backspace 를 누르면 앞칸으로 가요.',
      '뒷칸은 password 입력이라 화면에 가려져요. name 을 주면 숫자만 든 값을 숨긴 input 으로 제출해요.',
      'id 를 주면 앞칸은 `${id}-front`, 뒷칸은 `${id}-back` 이에요. ErrorSummary 링크는 앞칸으로 가요.',
    ],
    storybookPath: '/docs/korean-kit-residentnumberinput--docs',
    utilsSlug: 'resident-number',
  },
  {
    slug: 'card-number-input',
    name: 'CardNumberInput',
    title: 'React 카드번호 입력 컴포넌트 — 4자리 하이픈·Luhn 검사·자동 완성',
    summary:
      '4자리씩 하이픈을 넣고(아메리칸 익스프레스는 4-6-5) 다 채우면 Luhn 공식으로 오타를 알려 주는 React 카드번호 입력이에요. 브라우저·비밀번호 관리자의 카드 자동 완성을 받아요.',
    problem: [
      '카드번호는 대부분 16자리지만 아메리칸 익스프레스는 15자리이고 4-6-5 로 끊어요. 길이를 16자리 하나로 정해 두면 15자리 카드를 덜 넣은 것으로 처리해요.',
      'autocomplete="cc-number" 가 없으면 브라우저에 저장한 카드를 불러올 수 없어서, 사용자가 카드를 꺼내 16자리를 직접 쳐야 해요.',
      '숫자 하나를 잘못 쳐도 결제를 요청한 뒤에야 알게 돼요. 마지막 자리는 Luhn 공식의 검사 숫자라 입력 칸에서 바로 걸러 낼 수 있어요.',
    ],
    code: `import { CardNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function CardForm() {
  const [card, setCard] = useState({ digits: '', valid: null as boolean | null });

  return (
    <CardNumberInput
      required
      value={card.digits}
      onValueChange={(digits, valid) => setCard({ digits, valid })} // 다 채우기 전에는 valid 가 null
    />
  );
}`,
    notes: [
      'Luhn 검사는 오타를 거르는 용도예요. 실제로 쓸 수 있는 카드인지는 결제사가 확인해요.',
      '입력하는 동안에는 오류를 띄우지 않아요. 다 채우면 바로 검사하고, 덜 채운 채 칸을 벗어나면 "카드번호를 끝까지 입력해 주세요." 를 보여 줘요.',
      '카드번호를 다시 화면에 보여 줄 때는 korean-utils 의 maskCardNumber 로 가리세요.',
      '카드번호를 직접 받아 저장하거나 전달하면 카드 정보 보안 기준(PCI DSS)을 지켜야 해요. PG 결제창을 쓰면 카드번호를 직접 받지 않아도 돼요.',
    ],
    storybookPath: '/docs/korean-kit-cardnumberinput--docs',
    utilsSlug: 'card-number',
  },
  {
    slug: 'account-number-input',
    name: 'AccountNumberInput',
    title: 'React 계좌번호 입력 컴포넌트 — 숫자만 받기·붙여넣기·은행 선택',
    summary:
      '은행 앱에서 복사한 "110-123-456789" 를 붙여 넣어도 숫자만 남기는 React 계좌번호 입력이에요. 10~16자리를 받고, 은행은 KOREAN_BANKS 목록으로 함께 고르게 해요.',
    problem: [
      '계좌번호는 은행·상품마다 자릿수와 하이픈 위치가 달라요. 서식 하나를 정해 하이픈을 넣으면 다른 은행 번호가 엉뚱한 곳에서 끊겨요.',
      '사용자는 은행 앱에서 하이픈이 든 번호를 복사해 와요. maxLength 로 자릿수를 막으면 하이픈까지 세어서 붙여 넣은 번호 끝이 잘려요.',
      '은행 이름을 자유롭게 입력하게 하면 "국민", "KB국민은행", "국민은행" 처럼 제각각이라 은행 코드로 바꾸기 어려워요.',
    ],
    code: `import { AccountNumberInput, KOREAN_BANKS, Select } from '@bestow-ui/react';
import { useState } from 'react';

const bankOptions = KOREAN_BANKS.map((bank) => ({ value: bank.code, label: bank.name }));

export function RefundAccount() {
  const [bank, setBank] = useState<string>(); // 금융결제원 코드 3자리 (예: '004')
  const [account, setAccount] = useState(''); // 숫자만

  return (
    <>
      <Select label="은행" placeholder="은행 선택" options={bankOptions} value={bank} onValueChange={setBank} />
      <AccountNumberInput value={account} onValueChange={(digits) => setAccount(digits)} />
    </>
  );
}`,
    notes: [
      '서식을 넣지 않고 숫자만 보여 줘요(최대 16자리). 10자리보다 짧은 채 칸을 벗어나면 "계좌번호를 10자리 이상 입력해 주세요." 를 보여 줘요.',
      '자릿수만 확인해요. 실제 계좌와 예금주는 은행·결제사의 예금주 조회로 확인하세요.',
      'KOREAN_BANKS 는 금융결제원 은행 코드 3자리와 은행 이름 목록이에요. 은행이 많으니 찾아 고르게 하려면 Select 대신 Combobox 를 써도 돼요.',
    ],
    storybookPath: '/docs/korean-kit-accountnumberinput--docs',
    utilsSlug: 'bank-account',
  },
  {
    slug: 'corporate-number-input',
    name: 'CorporateNumberInput',
    title: 'React 법인등록번호 입력 컴포넌트 — 하이픈 자동·검증 공식',
    summary:
      '입력하는 대로 000000-0000000 형태로 하이픈을 넣고, 13자리를 채우면 검증 공식으로 오타를 알려 주는 React 법인등록번호 입력이에요. 사업자등록번호 입력과 같은 방식으로 동작해요.',
    problem: [
      '법인 회원가입이나 거래처 등록 화면은 사업자등록번호(10자리)와 법인등록번호(13자리)를 함께 받는 경우가 많아요. 두 번호는 자릿수·하이픈 위치·검증 공식이 모두 달라서, 입력 칸도 따로 맞춰야 해요.',
      '검증 결과를 보여 주는 시점, 13자리를 채운 순간의 오류를 스크린리더에 알리는 방법은 사업자등록번호 입력과 같은 문제예요.',
    ],
    code: `import { BusinessNumberInput, CorporateNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function CorporationForm() {
  const [bizNo, setBizNo] = useState('');
  const [corpNo, setCorpNo] = useState(''); // '1301110006246' — 숫자만

  return (
    <>
      <BusinessNumberInput required value={bizNo} onValueChange={(digits) => setBizNo(digits)} />
      <CorporateNumberInput required value={corpNo} onValueChange={(digits) => setCorpNo(digits)} />
    </>
  );
}`,
    notes: [
      '검증 공식을 통과해도 실제로 등기된 법인이라는 뜻은 아니에요. 등기 여부는 인터넷등기소에서 확인해요.',
      '입력하는 동안에는 오류를 띄우지 않아요. 13자리를 채우면 바로 검증하고, 덜 채운 채 칸을 벗어나면 "13자리를 모두 입력해 주세요." 를 보여 줘요.',
      'error·helperText 를 직접 주면 자동 검증보다 우선해요. 자동 검증을 끄려면 validate={false} 예요.',
    ],
    storybookPath: '/docs/korean-kit-corporatenumberinput--docs',
    utilsSlug: 'corporate-number',
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    title: 'React 날짜 입력 컴포넌트 — 직접 입력과 한국어 달력',
    summary:
      'YYYY-MM-DD 로 직접 입력하거나(숫자만 쳐도 하이픈이 들어가요) 달력 버튼으로 고르는 React 날짜 입력이에요. 달력은 일요일부터 시작하고, 값은 시간대 문제가 없는 문자열이에요.',
    problem: [
      'input type="date" 는 브라우저마다 모양과 입력 방식이 다르고, 달력 디자인을 바꿀 수 없고, 공휴일을 표시할 수 없어요.',
      '날짜를 Date 객체로 주고받으면 시간대 때문에 하루가 밀리는 일이 생겨요. 서버(UTC)에서 만든 날짜가 한국 브라우저에서 전날로 보이는 식이에요.',
      '달력으로만 고르게 하면 생년월일처럼 먼 날짜를 고를 때 수십 번 넘겨야 해요. 키보드 사용자는 직접 치는 편이 훨씬 빨라요.',
    ],
    code: `import { DatePicker } from '@bestow-ui/react';
import { useState } from 'react';

export function VisitDate() {
  const [date, setDate] = useState(''); // '2026-11-20' — 지우거나 잘못되면 ''

  return (
    <DatePicker
      label="방문 예정일"
      value={date}
      onValueChange={setDate}
      min="2026-11-01"
      isDateDisabled={(d) => d.getDay() === 0} // 일요일은 쉬어요
    />
  );
}`,
    notes: [
      "값은 'YYYY-MM-DD' 문자열이에요. 올바른 날짜를 다 입력하거나 달력에서 고르면 그 값으로, 지우거나 잘못되면 '' 로 onValueChange 를 불러요.",
      '없는 날짜·고를 수 없는 날짜·덜 입력한 날짜는 helperText 로 이유를 알려 줘요.',
      '공휴일은 라이브러리에 들어 있지 않아요. 대체·임시공휴일이 해마다 바뀌어서 isHoliday 로 받아요.',
      '"오늘" 은 브라우저의 날짜예요. 테스트·스크린샷에서는 today 로 고정하세요. 이 쪽의 데모도 2026-11-14 로 고정했어요.',
      '달력의 키보드 조작은 Calendar 와 같아요.',
    ],
    storybookPath: '/docs/korean-kit-datepicker--docs',
    utilsSlug: 'korean-date',
  },
  {
    slug: 'date-range-picker',
    name: 'DateRangePicker',
    title: 'React 기간 선택 컴포넌트 — 시작일·종료일과 빠른 선택(1주일·1개월)',
    summary:
      '조회 기간·예약 기간처럼 시작일과 종료일을 받는 React 기간 선택이에요. 두 날짜가 서로를 제한하고, 오늘·1주일·1개월·3개월 빠른 선택 버튼으로 한 번에 채워요.',
    problem: [
      '시작일과 종료일을 DatePicker 두 개로 따로 두면, 시작일이 종료일보다 늦은 기간을 막는 코드를 화면마다 써야 해요.',
      '조회 화면에는 "1주일", "1개월" 버튼이 거의 늘 있어요. 1개월 전이 며칠인지 계산하고, 지금 기간이 어느 버튼과 같은지 표시하는 코드도 매번 되풀이돼요.',
      '눌린 버튼을 색으로만 표시하면 스크린리더 사용자는 어느 기간이 선택됐는지 알 수 없어요.',
    ],
    code: `import { DateRangePicker, dateRangePresets, type DateRange } from '@bestow-ui/react';
import { useState } from 'react';

export function OrderSearch() {
  const [range, setRange] = useState<DateRange>({ start: '', end: '' });

  return (
    <DateRangePicker
      label="조회 기간"
      value={range}
      onValueChange={setRange}
      presets={dateRangePresets} // 오늘 · 1주일 · 1개월 · 3개월
    />
  );
}`,
    notes: [
      '빠른 선택은 오늘에서 거슬러 올라간 기간이에요. dateRangePresets 를 그대로 넘기거나 { label, days }·{ label, months } 로 직접 만들어요.',
      '지금 기간과 같은 빠른 선택 버튼은 aria-pressed 로 눌린 상태가 돼요.',
      '조회 결과가 바뀌면 결과 개수를 role="status" 로 알려 주세요.',
      'startName·endName 을 주면 두 날짜가 각각 제출돼요.',
      '빠른 선택의 기준인 "오늘" 은 today 로 고정할 수 있어요. 이 쪽의 데모는 2026-11-14 예요.',
    ],
    storybookPath: '/docs/korean-kit-daterangepicker--docs',
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    title: 'React 한국어 달력 컴포넌트 — 일요일 시작·공휴일 표시·키보드 이동',
    summary:
      '일요일부터 시작하고 일요일·공휴일은 빨강, 토요일은 파랑으로 표시하는 React 달력이에요. WAI-ARIA grid 패턴이라 화살표·PageUp/PageDown 으로 날짜를 옮기고, 날짜를 "15, 2026년 10월 목요일" 처럼 읽어요.',
    problem: [
      '해외 달력 라이브러리는 월요일 시작·영어 요일이 기본이라, 한국 달력처럼 보이게 하려면 설정이 많아요. 공휴일을 빨갛게 표시하는 것도 직접 해야 해요.',
      '날짜 칸 42개를 모두 버튼으로 두면 Tab 을 수십 번 눌러야 달력을 지나갈 수 있어요. 날짜 하나만 Tab 으로 들어가고 화살표로 옮기는 grid 패턴이 필요해요.',
      '서버 렌더링에서 "오늘" 을 그리면 서버와 브라우저의 날짜(시간대)가 달라 hydration 오류가 나요.',
    ],
    code: `import { Calendar } from '@bestow-ui/react';
import { useState } from 'react';

export function ReservationCalendar() {
  const [date, setDate] = useState('');

  return (
    <Calendar
      value={date}
      onValueChange={setDate}
      isHoliday={(d) => d.getMonth() === 11 && d.getDate() === 25} // 공휴일은 직접 넘겨요 (예: 성탄절)
      isDateDisabled={(d) => d.getDay() === 1} // 월요일 휴무
    />
  );
}`,
    notes: [
      '공휴일은 isHoliday 로 넘겨요. 일요일처럼 빨갛게 표시하고, 스크린리더에는 "공휴일" 을 덧붙여 읽어요.',
      'today 가 없으면 hydration 이 끝난 뒤에 오늘을 정해요. 그래서 서버와 브라우저의 날짜가 달라도 오류가 나지 않아요(선택된 날짜도 없으면 그 전까지 날짜 칸을 비워 둬요).',
      '달이 바뀌면 달 제목을 aria-live 로 알려요.',
      '입력 칸과 함께 쓰려면 DatePicker, 기간은 DateRangePicker 를 쓰세요.',
    ],
    storybookPath: '/docs/korean-kit-calendar--docs',
  },
];

export function findKitPage(slug: string): KitPage | undefined {
  return kitPages.find((page) => page.slug === slug);
}
