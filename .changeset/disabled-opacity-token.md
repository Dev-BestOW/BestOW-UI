---
"@bestow-ui/react": major
"@bestow-ui/tokens": minor
---

비활성 투명도를 0.5 하나로 통일하고 `opacity.disabled` 토큰을 추가해요.

- **화면이 바뀌어요(react major):** Input 을 쓰는 모든 칸·Textarea·인증번호 칸 0.6 → 0.5, Pagination 버튼·Calendar 의 고를 수 없는 날 0.4 → 0.5.
- 새 토큰: tokens `opacity.disabled`(`'0.5'`), CSS 변수 `--bestow-opacity-disabled`, react `vars.opacity.disabled`. 모든 비활성 모양이 이 값을 써서
  `createTheme({ common: { opacity: { disabled: '0.6' } } })` 처럼 한 번에 바꿀 수 있어요.
