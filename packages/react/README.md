# @bestow-ui/react

[![npm](https://img.shields.io/npm/v/@bestow-ui/react)](https://www.npmjs.com/package/@bestow-ui/react)
[![license](https://img.shields.io/npm/l/@bestow-ui/react)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

**A React design system for building Korean services — with accessibility you can verify.**
Built on [vanilla-extract](https://vanilla-extract.style) and [Radix UI](https://www.radix-ui.com).

- **Korean service kit** — terms agreement (agree-to-all), SMS verification code (one-time-code autofill, countdown), phone / business registration
  number (checksum) / amount (Korean reading like “12만 5,000원”), address (Kakao postcode), and a date picker (Sunday-first, holidays).
- **Accessibility, tested** — every story is rendered in a real browser and checked with axe in both light and dark themes on CI.
  Item-by-item notes for KWCAG 2.2 (the Korean web accessibility standard), plus a log of real issues the checks caught.
- **One brand color → accessible theme** — brand colors keep 4.5:1 text contrast (including hover) and a 3:1 focus ring, light and dark.
  Try the [Theme Builder](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-theme-builder--builder).
- **Zero-runtime CSS & RSC-friendly** — works with the Next.js App Router; tree-shakable (a single `Button` is about 1.5 kB, and the CSS for every component is about 9 kB — minified + brotli).
- **Korean by default, any language** — default UI strings are Korean; switch them all with `LocaleProvider` (English included).

📖 **Docs & live examples:** [Storybook](https://dev-bestow.github.io/BestOW-UI/) · [Next.js example app](https://dev-bestow.github.io/BestOW-UI/playground/)

> 🇰🇷 한국어 안내는 [아래](#한국어)에 있어요.

## Install

```bash
npm install @bestow-ui/react
# pnpm add @bestow-ui/react / yarn add @bestow-ui/react
```

Requires React 18 or later. [`@bestow-ui/icons`](https://www.npmjs.com/package/@bestow-ui/icons) and [`@bestow-ui/tokens`](https://www.npmjs.com/package/@bestow-ui/tokens) are installed as dependencies.

## Quick start

```tsx
import '@bestow-ui/react/styles.css'; // once, at your app entry
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
  return <Button onClick={() => toast({ title: 'Saved', color: 'success' })}>Save</Button>;
}
```

With the Next.js App Router, put the providers in a `'use client'` file and wrap them in `app/layout.tsx`. Components can be rendered from Server Components — display components without state (`Typography`, `Stack`, `Card`, `Badge`, `Divider`, `Progress`, `Skeleton`) render as Server Components themselves (no client JS) — and plain functions and values (`createTheme`, `createIntentColors`, `vars`, `formatKoreanAmount`, …) can be called there directly. See the [Introduction](https://dev-bestow.github.io/BestOW-UI/) page for the full setup.

Upgrading from 0.x? See the [migration guide](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md).

## Dark mode

```tsx
const [mode, setMode] = useState<ThemeName>('light');

<ThemeProvider theme={mode}>…</ThemeProvider>;
```

Portal content (Modal, Tooltip, Select, Toast, …) follows the theme automatically.

## Brand themes

```tsx
import { ThemeProvider, createTheme, createIntentColors } from '@bestow-ui/react';

const brand = createTheme(
  createIntentColors('primary', '#7c3aed'), // light + dark color sets, WCAG 4.5:1 contrast guaranteed
  { common: { radius: { md: '6px' } } },
);

<ThemeProvider theme={mode} overrides={brand}>…</ThemeProvider>;
```

All tokens are plain CSS variables with stable names, so you can also override them in CSS:

```css
:root {
  --bestow-color-primary-solid: #7c3aed;
}
```

## Locale

Default UI strings (close buttons, "no results", calendar labels, …) are Korean. Switch them all with `LocaleProvider`:

```tsx
import { LocaleProvider, en } from '@bestow-ui/react';

<LocaleProvider messages={en}>…</LocaleProvider>
```

## Components

| Category | Components |
|---|---|
| Layout | `Stack`, `Divider`, `Card`, `VisuallyHidden` |
| Typography | `Typography` |
| Actions | `Button`, `IconButton`, `Link` |
| Forms | `Input`, `TextField`, `Textarea`, `Select`, `Combobox`, `NumberInput`, `FileUpload`, `Checkbox`, `RadioGroup`, `Switch`, `Slider` |
| Feedback | `Alert`, `ErrorSummary`, `Progress`, `ToastProvider` + `useToast`, `Spinner`, `Skeleton`, `Badge` |
| Overlays | `Modal`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` |
| Navigation | `Tabs`, `SegmentedControl`, `Accordion`, `Pagination`, `Breadcrumb`, `SkipLink`, `Stepper` |
| Display | `Avatar`, `Table` |
| Korean kit | `AgreementGroup` (약관 동의), `VerificationCodeInput` (인증번호), `PhoneNumberInput`, `BusinessNumberInput`, `AmountInput`, `AddressInput`, `DatePicker`, `Calendar` (+ `formatPhoneNumber`, `formatBusinessNumber`, `isValidBusinessNumber`, `formatKoreanAmount`, `formatKoreanDate`, `parseISODate`, `toISODate`) |
| Locale | `LocaleProvider`, `en` (English messages) |
| Theming | `ThemeProvider`, `createTheme`, `createIntentColors`, `vars`, `useTheme`, `usePortalProps` |

## Links

- [Storybook](https://dev-bestow.github.io/BestOW-UI/) — docs, design tokens, all components
- [GitHub](https://github.com/Dev-BestOW/BestOW-UI) — source, [issues](https://github.com/Dev-BestOW/BestOW-UI/issues), [contributing guide](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md)
- Support: the latest 2 major versions of Chrome, Edge, Firefox and Safari (incl. mobile), React 18 and 19, Next.js App Router — all checked in CI.
  [Support & versioning policy (Korean)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SUPPORT.md) · [Security](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SECURITY.md)
- [Changelog](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/react/CHANGELOG.md) · [Upgrading from 0.x (MIGRATION-1.0, Korean)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md)

## License

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW

---

## 한국어

**한국 서비스를 만들 때 바로 쓰는, 접근성이 검증된 React 디자인 시스템**이에요.

- **한국 서비스 키트** — 약관 동의, 인증번호(문자 자동 채우기·남은 시간), 전화번호·사업자등록번호·금액·주소·날짜 입력.
- **검사로 증명하는 접근성** — 모든 스토리를 라이트·다크에서 axe 로 검사(CI), [KWCAG 2.2 항목별 대응 근거](https://dev-bestow.github.io/BestOW-UI/?path=/docs/accessibility-kwcag-2-2-%EB%8C%80%EC%9D%91--docs).
- **대표색 하나로 테마** — 브랜드 색을 넣어도 대비 기준을 자동으로 지켜요. [테마 빌더](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-theme-builder--builder)
- **가벼움** — 런타임 CSS 0, 서버 컴포넌트 지원, 쓰는 컴포넌트만 번들에.
- **다국어** — 기본 문구는 한국어, `LocaleProvider` 로 한 번에 바꿔요.
- **지원 범위** — Chrome·Edge·Firefox·Safari 최근 2개 메이저 버전(모바일 포함), React 18·19, Next.js App Router 를 CI 로 확인해요.
  [지원·버전 정책](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SUPPORT.md) · [보안 문제 신고](https://github.com/Dev-BestOW/BestOW-UI/blob/main/SECURITY.md)

```bash
npm install @bestow-ui/react
```

```tsx
import '@bestow-ui/react/styles.css';
import { ThemeProvider, Button } from '@bestow-ui/react';

<ThemeProvider theme="light">
  <Button>확인</Button>
</ThemeProvider>;
```

설치·설정·다크 모드·브랜드 테마·아이콘 사용법은 [Storybook 시작하기](https://dev-bestow.github.io/BestOW-UI/) 에 자세히 정리돼 있어요.
버그 제보·제안은 [GitHub Issues](https://github.com/Dev-BestOW/BestOW-UI/issues), 기여 방법은 [CONTRIBUTING.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md) 를 봐 주세요.
