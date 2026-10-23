---
"@bestow-ui/react": minor
"@bestow-ui/tokens": minor
---

반응형 레이아웃 기반 추가

- tokens: `breakpoint`(반응형 구간 시작 폭 — `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280px, 모바일 우선 min-width).
- react: `media` — 같은 구간을 em 으로 바꾼 미디어쿼리 문자열이에요(브라우저 기본 글꼴 크기를 따라요). vanilla-extract 의 `@media` 에 넣어 써요. 타입 `Responsive<T>`·`Breakpoint`.
- `Stack` 의 `direction`·`gap`·`align`·`justify` 에 구간별 값을 줄 수 있어요(`direction={{ base: 'column', md: 'row' }}`). 주지 않은 구간은 앞 구간 값을 이어받아요. 한 값만 주던 기존 코드는 그대로예요.
- 새 컴포넌트 `Grid` — 같은 폭 칸을 여러 열로(`columns={{ base: 1, md: 2, lg: 3 }}` 또는 칸 최소 폭 `minItemWidth`), `gap` 도 구간별로 줄 수 있어요.
- 새 컴포넌트 `Container` — 페이지 본문의 최대 폭(`size` sm~xl·full)과 좌우 여백(좁은 화면 16px · md 이상 24px).
- 세 컴포넌트 모두 hook 이 없어 서버 컴포넌트에서 그대로 렌더링돼요(구간별 값은 CSS 변수 + 미디어쿼리, JS 없음).
