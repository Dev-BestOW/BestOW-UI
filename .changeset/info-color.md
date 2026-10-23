---
"@bestow-ui/react": minor
"@bestow-ui/tokens": minor
---

의미 색 `info`(일반 안내) 추가

- tokens: `lightColors`·`darkColors` 에 `info`(기본 파랑 — 기본 primary 와 같은 값). `SemanticColors.info` 는 선택 키라 직접 만든 `SemanticColors` 객체는 그대로 동작해요. 모든 키가 있는 타입 `DefaultSemanticColors` 추가.
- react: CSS 변수 `--bestow-color-info-*`, `Alert`·`Badge`·`Toast` 의 `color="info"`, `createIntentColors('info', 색)`.
- 브랜드 색(primary)을 바꿔도 `info` 는 파랑으로 남아요. 주황·빨강 계열 브랜드에서도 공지·도움말이 경고처럼 보이지 않아요. Alert 의 기본 `color` 는 그대로 `primary` 예요(2.0 에서 `info` 로 바꾸는 것을 검토).
