# @bestow-ui/tokens

[![npm](https://img.shields.io/npm/v/@bestow-ui/tokens)](https://www.npmjs.com/package/@bestow-ui/tokens)
[![license](https://img.shields.io/npm/l/@bestow-ui/tokens)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

Design tokens for **BestOW UI** — colors, spacing, radius, typography, shadow, duration and z-index as plain JavaScript values.
No dependencies, framework-agnostic.

📖 **See every token:** [Storybook › Foundations › Design Tokens](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-design-tokens--colors)

> 🇰🇷 한국어 안내는 [아래](#한국어)에 있어요.

## Install

```bash
npm install @bestow-ui/tokens
```

## Usage

```ts
import { palette, space, radius, fontSize, lightColors, darkColors } from '@bestow-ui/tokens';

space[4]; // '16px'
radius.md; // '8px'
lightColors.primary.solid; // '#2554eb'
darkColors.fg.default; // '#f8f9fa'
```

| Export | Contents |
|---|---|
| `palette` | Raw color scales (`gray`, `blue`, `red`, `green`, `amber`, `white`, `black`) |
| `lightColors`, `darkColors` | Semantic colors (`bg`, `fg`, `border`, `primary`, `neutral`, `danger`, `success`, `warning`) — same keys in both modes |
| `space` | `0`–`16` (4px grid) |
| `radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` | Typography |
| `shadow`, `darkShadow` | Elevation for light / dark mode (same keys) |
| `duration`, `zIndex` | Motion and stacking order |

### Using with React

If you use [`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react), reference tokens through its theme instead of raw values,
so dark mode and brand themes apply automatically:

```ts
import { vars } from '@bestow-ui/react'; // vars.color.primary.solid → var(--bestow-color-primary-solid)
```

## License

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW

---

## 한국어

**BestOW UI** 의 디자인 토큰이에요. 색상·간격·모서리·타이포그래피·그림자·시간·z-index 를 순수 JavaScript 값으로 제공해요. 의존성이 없어서 어떤 프레임워크에서도 쓸 수 있어요.

```ts
import { space, lightColors } from '@bestow-ui/tokens';

space[4]; // '16px'
lightColors.primary.solid; // '#2554eb'
```

`@bestow-ui/react` 를 쓴다면 원시 값 대신 `vars`(CSS 변수)로 참조해야 다크 모드·브랜드 테마가 적용돼요.
전체 토큰은 [Storybook 디자인 토큰 페이지](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-design-tokens--colors) 에서 볼 수 있어요.
