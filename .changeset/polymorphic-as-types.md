---
"@bestow-ui/react": minor
---

Stack·Card·Grid·Typography·Container·VisuallyHidden 의 `as` 가 고른 요소·컴포넌트의 props 와 ref 타입을 따라요.

`<Typography as="time" dateTime="2026-11-04">`, `<Card as="a" href="/orders">`, `<Card as={Link} href="/" prefetch>` 가 타입 오류 없이 되고,
잘못된 값(`dateTime={20261104}`)은 잡아요. 맞지 않으면 기존 타입으로 한 번 더 확인해서, 지금 통과하는 코드는 그대로 통과해요.
