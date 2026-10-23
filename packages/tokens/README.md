# @bestow-ui/tokens

[![npm](https://img.shields.io/npm/v/@bestow-ui/tokens)](https://www.npmjs.com/package/@bestow-ui/tokens)
[![license](https://img.shields.io/npm/l/@bestow-ui/tokens)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

**BestOW UI** 의 디자인 토큰이에요. 색상·간격·모서리·글자·그림자·시간·쌓임 순서를 순수 JavaScript 값으로 제공해요.
의존성이 없어서 어떤 프레임워크에서도 쓸 수 있어요.

> Design tokens for BestOW UI, a React design system for Korean services. Docs are in Korean.

📖 **전체 토큰 보기:** [Storybook › Foundations › Design Tokens](https://dev-bestow.github.io/BestOW-UI/?path=/story/foundations-design-tokens--colors)

## 설치

```bash
npm install @bestow-ui/tokens
```

## 사용하기

```ts
import { palette, space, radius, fontSize, lightColors, darkColors } from '@bestow-ui/tokens';

space[4]; // '16px'
radius.md; // '8px'
lightColors.primary.solid; // '#2554eb'
darkColors.fg.default; // '#f8f9fa'
```

| export | 내용 |
|---|---|
| `palette` | 원시 색 단계 (`gray`, `blue`, `red`, `green`, `amber`, `white`, `black`) |
| `lightColors`, `darkColors` | 의미 색 (`bg`, `fg`, `border`, `primary`, `neutral`, `danger`, `success`, `warning`, `info`) — 두 모드의 키가 같아요. `info` 는 일반 안내용 파랑(브랜드 색과 따로) |
| `space` | `0`–`16` (4px 단위) |
| `radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` | 글자 |
| `shadow`, `darkShadow` | 라이트·다크 그림자 (키가 같아요) |
| `breakpoint` | 반응형 구간 시작 폭 `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 (px, min-width) |
| `duration`, `zIndex` | 움직임 시간과 쌓임 순서 (배경막 < 대화상자 < 목록 < 토스트 < 툴팁) |

### React 와 함께

[`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react) 를 쓴다면 원시 값 대신 테마의 `vars`(CSS 변수)로 참조하세요.
그래야 다크 모드와 브랜드 테마가 자동으로 적용돼요. 글자 크기는 react 테마에서 rem 으로 바뀌어 사용자의 기본 글꼴 크기 설정을 따라요.

```ts
import { vars } from '@bestow-ui/react'; // vars.color.primary.solid → var(--bestow-color-primary-solid)
```

## 라이선스

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW
