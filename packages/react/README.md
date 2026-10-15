# @bestow-ui/react

[![npm](https://img.shields.io/npm/v/@bestow-ui/react)](https://www.npmjs.com/package/@bestow-ui/react)
[![license](https://img.shields.io/npm/l/@bestow-ui/react)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

React components and theming for **BestOW UI**, a design system built on [vanilla-extract](https://vanilla-extract.style) and [Radix UI](https://www.radix-ui.com).

- **Zero-runtime styles** — CSS is extracted at build time into a single stylesheet. Works with Next.js App Router and React Server Components.
- **Light / dark mode and brand themes** — switch modes with one prop, generate an accessible color set from a single brand color.
- **Accessible by default** — keyboard and screen reader support via Radix primitives. Every story is checked with axe in both light and dark themes.
- **Tree-shakable** — import only what you use (a single `Button` is about 2.4 kB, minified + brotli).

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
  return <Button onClick={() => toast({ title: 'Saved', variant: 'success' })}>Save</Button>;
}
```

With the Next.js App Router, put the providers in a `'use client'` file and wrap them in `app/layout.tsx`. See the [Introduction](https://dev-bestow.github.io/BestOW-UI/) page for the full setup.

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

## Components

| Category | Components |
|---|---|
| Layout | `Stack`, `Divider`, `Card` |
| Typography | `Typography` |
| Actions | `Button`, `IconButton`, `Link` |
| Forms | `Input`, `TextField`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch` |
| Feedback | `Alert`, `Progress`, `ToastProvider` + `useToast`, `Spinner`, `Skeleton`, `Badge` |
| Overlays | `Modal`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` |
| Navigation | `Tabs`, `Accordion`, `Pagination`, `Breadcrumb` |
| Display | `Avatar` |
| Theming | `ThemeProvider`, `createTheme`, `createIntentColors`, `vars`, `useTheme`, `usePortalProps` |

## Links

- [Storybook](https://dev-bestow.github.io/BestOW-UI/) — docs, design tokens, all components
- [GitHub](https://github.com/Dev-BestOW/BestOW-UI) — source, [issues](https://github.com/Dev-BestOW/BestOW-UI/issues), [contributing guide](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/react/CHANGELOG.md)

## License

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW

---

## 한국어

**BestOW UI** 의 React 컴포넌트와 테마 패키지예요. [vanilla-extract](https://vanilla-extract.style) 와 [Radix UI](https://www.radix-ui.com) 위에 만들었어요.

- **런타임 비용 없는 스타일** — 빌드 때 CSS 파일 하나로 뽑혀서, Next.js App Router·서버 컴포넌트에서도 그대로 써요.
- **라이트·다크 모드와 브랜드 테마** — prop 하나로 모드를 바꾸고, 대표색 하나로 대비 4.5:1 을 지키는 색 세트를 만들어요.
- **기본으로 접근성 지원** — Radix 기반 키보드·스크린리더 지원. 모든 스토리를 라이트·다크 두 테마에서 axe 로 검사해요.
- **tree-shaking** — 쓰는 것만 번들에 들어가요 (`Button` 하나 약 2.4 kB).

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
