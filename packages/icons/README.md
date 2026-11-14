# @bestow-ui/icons

[![npm](https://img.shields.io/npm/v/@bestow-ui/icons)](https://www.npmjs.com/package/@bestow-ui/icons)
[![license](https://img.shields.io/npm/l/@bestow-ui/icons)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE)

**BestOW UI** 의 SVG 아이콘 React 컴포넌트예요. 기본 세트는 [Lucide](https://lucide.dev) 기반이에요.

> SVG icons as React components for BestOW UI, a React design system for Korean services. Docs are in Korean.

- 아이콘마다 컴포넌트가 따로 있어서 import 한 아이콘만 번들에 들어가요.
- hook 을 쓰지 않아 서버 컴포넌트에서도 그대로 써요.
- 기본은 장식용(`aria-hidden`)이고, `title` 을 주면 스크린리더가 읽어요.

📖 **전체 아이콘 보기:** [Storybook › Foundations › Icons](https://bestow-ui.com/storybook/?path=/story/foundations-icons--gallery)

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

## 더 많은 아이콘이 필요하면

기본 세트는 Lucide 에서 서비스 화면에 자주 쓰는 148종(상거래·결제·일정·파일·차트·소통 등)을 골랐어요. 전체 목록은 [Storybook › Icons](https://bestow-ui.com/storybook/?path=/story/foundations-icons--gallery).
여기에 없는 아이콘은 같은 그림 세트인 [`lucide-react`](https://lucide.dev/guide/packages/lucide-react) 를 함께 써도 어색하지 않아요 — 크기 24px·선 두께 2·`currentColor` 가 같아요.

```tsx
import { SearchIcon } from '@bestow-ui/icons';
import { Rocket } from 'lucide-react';

<SearchIcon size={16} />
<Rocket size={16} aria-hidden />   // 장식용이면 숨기기 — 의미가 있으면 아이콘 대신 버튼에 aria-label
```

자주 쓰게 되는 아이콘이 있으면 [이슈](https://github.com/Dev-BestOW/BestOW-UI/issues)로 알려 주세요. 기본 세트에 넣을게요.

## 라이선스

[ISC](https://github.com/Dev-BestOW/BestOW-UI/blob/main/packages/icons/LICENSE) — 아이콘 그림 © Lucide Icons and Contributors
(일부는 [Feather](https://feathericons.com) 에서 파생, MIT © Cole Bemis).
