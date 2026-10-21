---
"@bestow-ui/react": patch
---

한국 서비스 서식·검증 함수(`formatPhoneNumber`·`formatBusinessNumber`·`isValidBusinessNumber`·`formatKoreanAmount`·`formatKoreanDate`·`composeExtraAddress`)를
의존성 없는 새 패키지 [`@bestow-ui/korean-utils`](https://www.npmjs.com/package/@bestow-ui/korean-utils) 로 옮겼어요. React 없이도(Vue·Svelte·서버) 쓸 수 있어요.
`@bestow-ui/react` 는 같은 함수를 같은 이름으로 다시 내보내므로 기존 코드는 바꿀 필요가 없어요.
