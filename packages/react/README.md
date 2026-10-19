# @bestow-ui/react

[![npm](https://img.shields.io/npm/v/@bestow-ui/react)](https://www.npmjs.com/package/@bestow-ui/react)
[![license](https://img.shields.io/npm/l/@bestow-ui/react)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

**한국 서비스를 만들 때 바로 쓰는, 접근성이 검증된 React 디자인 시스템이에요.**
[vanilla-extract](https://vanilla-extract.style) 와 [Radix UI](https://www.radix-ui.com) 위에 만들었어요.

> A React design system for Korean services, with accessibility verified in CI. Docs are in Korean.

- **한국 서비스 키트** — 약관 동의(전체 동의), 인증번호(문자 자동 채우기·남은 시간), 전화번호·사업자등록번호(검증)·
  금액("12만 5,000원" 읽기)·주소(카카오 우편번호)·날짜(일요일 시작·공휴일)·기간(빠른 선택) 입력.
- **검사로 증명하는 접근성** — 모든 스토리를 실제 브라우저(Chromium·WebKit·Firefox)에서 라이트·다크 두 테마로 axe 검사해요.
  고대비 모드·320px 리플로·기본 글꼴 2배도 CI 로 확인하고, [KWCAG 2.2 항목별 대응 근거](https://dev-bestow.github.io/BestOW-UI/?path=/docs/accessibility-kwcag-2-2-%EB%8C%80%EC%9D%91--docs)를 문서로 정리했어요.
- **대표색 하나로 테마** — 브랜드 색을 넣어도 글자 대비 4.5:1(hover 포함)과 포커스 링 3:1 을 라이트·다크 모두 지켜요.
  [테마 빌더](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-theme-builder--builder)에서 바로 해 볼 수 있어요.
- **가볍고 서버 컴포넌트 친화적** — 런타임 CSS 0, Next.js App Router 지원, 쓰는 컴포넌트만 번들에 들어가요
  (Button 하나 약 1.5 kB, 모든 컴포넌트 CSS 를 합쳐도 약 9 kB — minify + brotli).
- **기본 문구는 한국어** — 닫기·결과 없음·달력 등 기본 문구가 한국어이고, `LocaleProvider` 로 한 번에 바꿀 수 있어요(영어 묶음 포함).

📖 **문서와 실제 예제:** [Storybook](https://dev-bestow.github.io/BestOW-UI/) · [Next.js 예제 앱](https://dev-bestow.github.io/BestOW-UI/playground/)

## 설치

```bash
npm install @bestow-ui/react
# pnpm add @bestow-ui/react / yarn add @bestow-ui/react
```

React 18 이상이 필요해요. [`@bestow-ui/icons`](https://www.npmjs.com/package/@bestow-ui/icons) 와 [`@bestow-ui/tokens`](https://www.npmjs.com/package/@bestow-ui/tokens) 는 함께 설치돼요.

## 시작하기

```tsx
import '@bestow-ui/react/styles.css'; // 앱 진입점에서 한 번
import { ThemeProvider, ToastProvider, Button, useToast } from '@bestow-ui/react';

export function App() {
  return (
    <ThemeProvider theme="light">
      <ToastProvider>
        <SaveButton />
      </ToastProvider>
    </ThemeProvider>
  );
}

function SaveButton() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: '저장했어요', color: 'success' })}>저장</Button>;
}
```

Next.js App Router 에서는 Provider 를 `'use client'` 파일로 분리해 `app/layout.tsx` 에서 감싸면 돼요. 컴포넌트는 서버 컴포넌트에서도 바로 쓸 수 있어요.
상태가 없는 표시용 컴포넌트(`Typography`, `Stack`, `Card`, `Badge`, `Divider`, `Progress`, `Skeleton`, `DescriptionList`, `VisuallyHidden`)는
서버 컴포넌트로 렌더링되고(클라이언트 JS 없음), `createTheme`·`createIntentColors`·`vars`·`formatKoreanAmount` 같은 함수·값도 서버에서 그대로 불러요.
자세한 설정은 [Storybook 시작하기](https://dev-bestow.github.io/BestOW-UI/)에 있어요.

0.x 에서 올리시나요? [마이그레이션 가이드](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md)를 보세요.

## 다크 모드

```tsx
const [mode, setMode] = useState<ThemeName>('light');

<ThemeProvider theme={mode}>…</ThemeProvider>;
```

Modal·Tooltip·Select·Toast 처럼 portal 로 띄우는 요소도 테마를 자동으로 따라가요.

## 브랜드 테마

```tsx
import { ThemeProvider, createTheme, createIntentColors } from '@bestow-ui/react';

const brand = createTheme(
  createIntentColors('primary', '#7c3aed'), // 라이트·다크 색 세트, 글자 대비 4.5:1 보장
  { common: { radius: { md: '6px' } } },
);

<ThemeProvider theme={mode} overrides={brand}>…</ThemeProvider>;
```

모든 토큰은 이름이 고정된 CSS 변수라 CSS 로도 덮어쓸 수 있어요.

```css
:root {
  --bestow-color-primary-solid: #7c3aed;
}
```

## 문구 바꾸기

기본 문구(닫기 버튼, "결과가 없어요", 달력 이름 등)는 한국어예요. `LocaleProvider` 로 한 번에 바꿔요.

```tsx
import { LocaleProvider, en } from '@bestow-ui/react';

<LocaleProvider messages={en}>…</LocaleProvider>
```

## 폼 라이브러리

react-hook-form 과 함께 쓸 수 있어요. 입력창은 `register` 를 그대로 펼치고, 값을 고르는 컴포넌트는 `Controller` 로 연결해요.
제출에 실패하면 `ErrorSummary` 가 포커스를 받아 고칠 곳을 알려요. 자세한 방법은 [화면 패턴](https://dev-bestow.github.io/BestOW-UI/?path=/docs/guides-%ED%99%94%EB%A9%B4-%ED%8C%A8%ED%84%B4--docs) 가이드에 있어요.

## 컴포넌트

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃 | `Stack`, `Divider`, `Card`, `VisuallyHidden` |
| 글자 | `Typography` |
| 동작 | `Button`, `IconButton`, `Link` |
| 폼 | `Input`, `TextField`, `Textarea`, `Select`, `Combobox`, `NumberInput`, `FileUpload`, `Checkbox`, `RadioGroup`, `Switch`, `Slider` |
| 피드백 | `Alert`, `ErrorSummary`, `Progress`, `ToastProvider` + `useToast`, `Spinner`, `Skeleton`, `Badge` |
| 오버레이 | `Modal`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` |
| 탐색 | `Tabs`, `SegmentedControl`, `Accordion`, `Pagination`, `Breadcrumb`, `SkipLink`, `Stepper` |
| 표시 | `Avatar`, `Table`(+ `TableEmpty`, `TableSkeleton`, `useTableSelection`), `DescriptionList` |
| 한국 서비스 키트 | `AgreementGroup`(약관 동의), `VerificationCodeInput`(인증번호), `PhoneNumberInput`, `BusinessNumberInput`, `AmountInput`, `AddressInput`, `DatePicker`, `DateRangePicker`(+ `dateRangePresets`), `Calendar` (+ `formatPhoneNumber`, `formatBusinessNumber`, `isValidBusinessNumber`, `formatKoreanAmount`, `formatKoreanDate`, `parseISODate`, `toISODate`) |
| 문구 | `LocaleProvider`, `en`(영어 문구 묶음) |
| 테마 | `ThemeProvider`, `createTheme`, `createIntentColors`, `vars`, `useTheme`, `usePortalProps` |
| 도움 함수 | `focusField` |

어떤 컴포넌트를 골라야 할지는 [언제 무엇을 쓰나](https://dev-bestow.github.io/BestOW-UI/?path=/docs/guides-%EC%96%B8%EC%A0%9C-%EB%AC%B4%EC%97%87%EC%9D%84-%EC%93%B0%EB%82%98--docs) 가이드를 보세요.

## 지원 범위

Chrome·Edge·Firefox·Safari 최근 2개 메이저 버전(모바일 포함), React 18·19, Next.js App Router 를 CI 로 확인해요.
버전 정책(semver·deprecated 절차)과 배포 주기는 [SUPPORT.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SUPPORT.md),
보안 문제는 공개 이슈 대신 [SECURITY.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SECURITY.md) 의 방법으로 알려 주세요.

## 링크

- [Storybook](https://dev-bestow.github.io/BestOW-UI/) — 문서, 디자인 토큰, 모든 컴포넌트
- [GitHub](https://github.com/Dev-BestOW/BestOW-UI) — 소스, [이슈](https://github.com/Dev-BestOW/BestOW-UI/issues), [기여 방법](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md)
- [변경 내역](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/react/CHANGELOG.md) · [0.x 에서 올리기 (MIGRATION-1.0)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md)

## 라이선스

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW
