---
"@bestow-ui/react": major
---

`styles.css` 의 모든 스타일을 CSS 레이어 `bestow` 안에 넣어요(`@layer base, bestow;` + `@layer bestow { … }`).

- 레이어 밖에 쓴 CSS(`className`·CSS Modules·Tailwind)가 선택자 우선순위와 관계없이 컴포넌트 스타일을 이겨 덮어쓰기가 쉬워요.
- **확인할 것:** 레이어 밖의 리셋 CSS(normalize.css, `button { … }`, Tailwind v3 preflight)도 컴포넌트를 덮어요. 리셋은 `@layer base { … }` 로 감싸세요.
  Tailwind v4 는 그대로 둬도 preflight 가 BestOW 를 덮지 않고, 전역 CSS 맨 위에 `@layer theme, base, bestow, components, utilities;` 를 적으면 유틸리티가 이겨요.

자세한 내용은 `docs/MIGRATION-2.0.md` 와 Storybook Guides › Tailwind 와 함께 쓰기.
