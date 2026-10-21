---
"@bestow-ui/react": patch
---

Switch 를 Radix 없이 네이티브 `<button role="switch">` 로 다시 구현 — `@radix-ui/react-switch` 의존성을 없애 번들을 줄였어요.
API·키보드(Space·Enter)·스크린리더 동작은 같고, form 안에서는 전처럼 숨긴 checkbox 로 값 제출·`required` 검증·form reset 을 처리해요.
