# @bestow-ui/icons

[![npm](https://img.shields.io/npm/v/@bestow-ui/icons)](https://www.npmjs.com/package/@bestow-ui/icons)
[![license](https://img.shields.io/npm/l/@bestow-ui/icons)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE)

**BestOW UI** 의 SVG 아이콘 React 컴포넌트예요. 기본 세트는 [Lucide](https://lucide.dev) 기반이에요.

> SVG icons as React components for BestOW UI, a React design system for Korean services. Docs are in Korean.

- 아이콘마다 컴포넌트가 따로 있어서 import 한 아이콘만 번들에 들어가요.
- hook 을 쓰지 않아 서버 컴포넌트에서도 그대로 써요.
- 기본은 장식용(`aria-hidden`)이고, `title` 을 주면 스크린리더가 읽어요.

📖 **전체 아이콘 보기:** [Storybook › Foundations › Icons](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-icons--gallery)

## 설치

```bash
npm install @bestow-ui/icons
```

[`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react) 를 쓰면 함께 설치돼요. React 18 이상이 필요해요.

## 사용하기

```tsx
import { SearchIcon, TrashIcon } from '@bestow-ui/icons';

<SearchIcon />                              // 24px, 장식용 (aria-hidden)
<TrashIcon size={16} strokeWidth={1.5} />
<SearchIcon size="1em" color="tomato" />    // SVG 속성은 그대로 전달돼요
<SearchIcon title="검색" />                  // role="img" + 접근 가능한 이름
```

| prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `size` | `number \| string` | `24` | 너비와 높이. 숫자는 px, 문자열은 CSS 길이(예: `"1em"`) |
| `strokeWidth` | `number \| string` | `2` | 선 두께 |
| `title` | `string` | — | 접근 가능한 이름. 없으면 보조기술에서 숨겨요 |
| `...rest` | `SVGProps` | — | `<svg>` 에 전달 (`className`, `color`, `onClick` 등) |

선 색은 `currentColor` 라 주변 글자색을 따라가요. 아이콘만 있는 버튼은 아이콘의 `title` 보다 버튼의 `aria-label` 을 권해요.
아이콘 추가 방법은 [CONTRIBUTING.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md#아이콘-추가) 에 있어요.

## 라이선스

[ISC](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE) — 아이콘 그림 © Lucide Icons and Contributors
(일부는 [Feather](https://feathericons.com) 에서 파생, MIT © Cole Bemis).
