---
"@bestow-ui/react": patch
---

- `createIntentColors('primary', …)` 가 포커스 링 색(`border.focus`)도 브랜드 색으로 맞춰요. 이전에는 브랜드 테마에서도 포커스 링이 기본 파랑으로 남았어요.
- `Select` 에 `value` 를 넘기면 `undefined` 여도 제어 모드로 동작해요. `useState<string>()` 처럼 초기값이 없을 때 나던 "uncontrolled → controlled" 경고가 없어지고, `undefined` 는 placeholder 로 표시돼요.
