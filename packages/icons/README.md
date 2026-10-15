# @bestow-ui/icons

[![npm](https://img.shields.io/npm/v/@bestow-ui/icons)](https://www.npmjs.com/package/@bestow-ui/icons)
[![license](https://img.shields.io/npm/l/@bestow-ui/icons)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE)

SVG icons as React components for **BestOW UI**. The default set is based on [Lucide](https://lucide.dev).

- One component per icon — import only what you use, everything else is tree-shaken.
- No hooks, so icons render in React Server Components too.
- Decorative by default (`aria-hidden`); pass `title` to make an icon readable by screen readers.

📖 **Browse all icons:** [Storybook › Foundations › Icons](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-icons--gallery)

> 🇰🇷 한국어 안내는 [아래](#한국어)에 있어요.

## Install

```bash
npm install @bestow-ui/icons
```

Already included if you use [`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react). Requires React 18 or later.

## Usage

```tsx
import { SearchIcon, TrashIcon } from '@bestow-ui/icons';

<SearchIcon />                              // 24px, decorative (aria-hidden)
<TrashIcon size={16} strokeWidth={1.5} />
<SearchIcon size="1em" color="tomato" />    // any SVG prop is passed through
<SearchIcon title="Search" />               // role="img" + accessible name
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height. Numbers are px, strings are any CSS length (e.g. `"1em"`). |
| `strokeWidth` | `number \| string` | `2` | Stroke width. |
| `title` | `string` | — | Accessible name. Without it the icon is hidden from assistive technology. |
| `...rest` | `SVGProps` | — | Passed to the `<svg>` element (`className`, `color`, `onClick`, …). |

The stroke uses `currentColor`, so icons follow the surrounding text color. For icon-only buttons, prefer an `aria-label` on the button itself.

## License

[ISC](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE) — icon artwork © Lucide Icons and Contributors (some icons derived from [Feather](https://feathericons.com), MIT © Cole Bemis).

---

## 한국어

**BestOW UI** 의 SVG 아이콘 React 컴포넌트예요. 기본 세트는 [Lucide](https://lucide.dev) 기반이에요.

- 아이콘마다 컴포넌트가 따로 있어서, import 한 아이콘만 번들에 들어가요.
- hook 을 쓰지 않아 서버 컴포넌트에서도 그대로 써요.
- 기본은 장식용(`aria-hidden`)이고, `title` 을 주면 스크린리더가 읽어요.

```tsx
import { SearchIcon } from '@bestow-ui/icons';

<SearchIcon size={16} />
<SearchIcon title="검색" />
```

전체 아이콘은 [Storybook 아이콘 갤러리](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-icons--gallery) 에서 검색할 수 있어요.
아이콘 추가 방법은 [CONTRIBUTING.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md#아이콘-추가) 를 봐 주세요.
