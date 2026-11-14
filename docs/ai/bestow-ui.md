# BestOW UI (@bestow-ui/react) 사용 규칙

이 프로젝트의 화면은 `@bestow-ui/react`(한국 서비스용 React 디자인 시스템)로 만든다. 컴포넌트를 새로 만들기 전에 아래 목록에 있는지 먼저 본다.
props 를 모르면 추측하지 말고 전체 문서를 읽는다: https://bestow-ui.com/llms-full.txt (모든 컴포넌트의 props 정의·선택 기준·키보드 동작).

## 설치·설정

- 앱 진입점에서 스타일을 한 번 불러온다: `import '@bestow-ui/react/styles.css'`. 다른 경로(`dist/…`)에서 import 하지 않는다.
- 최상위를 `<ThemeProvider theme="system">` 으로 감싼다(OS 라이트·다크를 따름). 토스트를 쓰면 그 안에 `<ToastProvider>`.
- Next.js App Router: Provider 는 `'use client'` 파일(`app/providers.tsx`)로 분리해 `app/layout.tsx` 에서 감싼다.
- 스타일은 CSS 레이어 `bestow` 안에 있다. 리셋 CSS 는 `@layer base { … }` 에 넣는다(레이어 밖 리셋은 버튼 배경·여백을 지운다).
  Tailwind v4 는 전역 CSS 맨 위에 `@layer theme, base, bestow, components, utilities;` — 그러면 Tailwind 클래스로 컴포넌트를 덮어쓸 수 있다.

## 서버 컴포넌트

- 그대로 쓸 수 있다: `Typography` `Stack` `Grid` `Container` `Card` `Badge` `Divider` `EmptyState` `Progress` `Skeleton` `DescriptionList` `VisuallyHidden` `FormField`,
  그리고 함수 `createTheme` `createIntentColors` `formatPhoneNumber` `formatBusinessNumber` `formatKoreanAmount` `formatKoreanDate` `maskPhoneNumber` `maskName` `maskDigits` 등.
- 나머지 컴포넌트(입력·버튼·오버레이)는 클라이언트 컴포넌트다. 서버 컴포넌트에서 렌더링은 되지만 이벤트 핸들러는 `'use client'` 파일에서 넘긴다.
- 라우터 링크: 클라이언트에서는 `<Link as={NextLink} href="/a">`, 서버 컴포넌트에서는 `<Link asChild><NextLink href="/a">…</NextLink></Link>`(함수를 props 로 넘길 수 없다). 링크 모양 버튼은 어디서나 `<Button asChild><NextLink href="/a">…</NextLink></Button>`.

## 한국 서비스 입력 — 직접 만들지 말고 이것을 쓴다

| 필요한 것 | 컴포넌트 | 값 |
| --- | --- | --- |
| 휴대폰·전화번호 | `PhoneNumberInput` | 숫자만 문자열 `'01012345678'` (화면에는 하이픈) |
| 문자 인증번호 | `VerificationCodeInput` (`expiresIn` 타이머, `onResend`) | 숫자 문자열 |
| 사업자등록번호 | `BusinessNumberInput` | 숫자 10자리 문자열, `onValueChange(digits, valid)` |
| 법인등록번호·카드번호·계좌번호 | `CorporateNumberInput` `CardNumberInput` `AccountNumberInput` | 숫자 문자열 |
| 은행 목록 | `KOREAN_BANKS`(`{ code, name }`) → `NativeSelect`·`Select` 의 options | 은행 코드 `'004'` |
| 주민등록번호 | `ResidentNumberInput` (뒷자리 가림) | 숫자 13자리 문자열 |
| 금액 | `AmountInput` ("12만 5,000원" 읽기 표시) | `number \| null` |
| 주소 | `AddressInput` (기본 카카오 우편번호 검색) | `{ zonecode, address, extraAddress, detail }` |
| 날짜·기간 | `DatePicker` `DateRangePicker` | `'YYYY-MM-DD'` 문자열(Date 객체 아님) |
| 약관 동의 | `AgreementGroup` (`items` 에 `required`·`content`) + `hasAllRequiredAgreements(items, value)` | 동의한 value 배열 |

- 하이픈·쉼표를 직접 넣는 `onChange` 서식 코드나 `<input type="number">` 를 만들지 않는다. 값은 항상 **서식 없는 원본**(숫자 문자열·number)으로 저장한다.
- 서식·검증만 필요하면 `formatPhoneNumber` `isValidBusinessNumber` `isValidAccountNumber` `isValidCardNumber` `formatKoreanAmount` 를 쓴다(서버에서도 된다).

## 컴포넌트 고르기

- 하나 고르기: 2~5개는 `RadioGroup`(폼)·`SegmentedControl`(바로 반영되는 보기 전환), 많으면 `NativeSelect`(가볍다, 모바일은 OS 선택 창) 또는 `Select`, 아주 많아 검색해야 하면 `Combobox`.
- 여러 개 고르기: `CheckboxGroup`. 켜고 끄기: `Switch`(바로 반영), 폼 제출 값이면 `Checkbox`.
- 알림: 화면 안 안내 `Alert`, 잠깐 뜨는 결과는 토스트(`useToast` — `ToastProvider` 안에서), 확인이 필요하면 `Modal`. 옆에서 열리는 패널 `Drawer`.
- 입력: `TextField` `Textarea` `PasswordInput` `SearchInput` `NumberInput`. 단계 표시 `Stepper`(표시용 — 이동은 이전·다음 버튼).

## props 규칙

- 값은 `value` + `onValueChange`(제어) 또는 `defaultValue`(비제어). 이름이 통일돼 있다 — `onChange(event)` 로 값을 꺼내지 않는다.
- 공통: `size`(`'sm' | 'md' | 'lg'`), `variant`, `color`, `fullWidth`. 폼 컴포넌트: `label`, `helperText`, `error`, `required`, `id`.
- `label` 에는 짧은 이름만 넣고 설명은 `helperText` 로. `label` 이 있으면 `aria-label` 을 따로 주지 않는다.
- 기본 문구(닫기·결과 없음 등)는 한국어다. 바꾸려면 `LocaleProvider`, 영어는 `en` 묶음.

## 폼 (react-hook-form + zod)

- 입력창(`TextField` `PasswordInput` `NativeSelect`)은 `{...register('name')}` 를 펼친다. 값을 고르거나 서식이 붙는 컴포넌트는 `Controller` 로 `value`·`onValueChange` 를 잇는다.
- `useForm({ resolver: zodResolver(schema), shouldFocusError: false })` + 폼 맨 위 `<ErrorSummary errors={…} focusKey={submitCount} />` — 제출에 실패하면 오류 요약으로 포커스가 간다.
  ErrorSummary 의 `id` 는 칸의 `id` 와 같아야 링크로 이동한다(예: 칸 `id="join-email"` ↔ 오류 `{ id: 'join-email', message }`).
- zod 로 검증하는 칸은 컴포넌트 자동 검증을 끈다: `<BusinessNumberInput validate={false} …>` (같은 오류가 두 번 나오지 않게).
- 서버 오류(이미 가입한 이메일 등)는 `setError('email', { type: 'server', message })`.
- `<form noValidate>` 로 브라우저 기본 말풍선을 끈다.
- 예: https://github.com/Dev-BestOW/BestOW-UI/tree/main/examples/next-starter

## 스타일·테마

- 색·간격을 직접 적지 않는다. CSS 에서는 변수 `var(--bestow-color-primary-solid)` `var(--bestow-space-4)`, vanilla-extract 에서는 `vars`.
- 브랜드색은 `createTheme(createIntentColors('primary', '#7c3aed'))` 를 `ThemeProvider` 의 `overrides` 로(어떤 색이든 글자 대비 4.5:1 을 맞춘다). CSS 로 `--bestow-*` 를 덮어써도 된다.
- 조금 고칠 때는 `className`(Tailwind 포함) — 레이어 덕분에 선택자 우선순위 싸움이 없다. `!important` 를 쓰지 않는다.
- 아이콘은 `@bestow-ui/icons`(`<SearchIcon />` 등, Lucide 기반). 아이콘만 있는 버튼은 `IconButton` + `aria-label`.

## 접근성 (지키는 것)

- 직접 만든 팝업을 `body` 로 portal 할 때는 `usePortalProps()` 의 `className`·`style` 을 붙인다(안 붙이면 다크·브랜드 색이 빠진다).
- 상태를 색으로만 보이지 않는다(글자·아이콘을 함께). 글자 대비 4.5:1, 테두리·아이콘 3:1.
- 페이지 맨 앞에 `<SkipLink />`, 본문에 `id="main"`. 페이지마다 `h1` 하나.
- 클릭되는 `div` 를 만들지 않는다 — `Button`·`Link` 를 쓴다.
