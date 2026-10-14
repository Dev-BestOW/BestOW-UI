---
"@bestow-ui/react": minor
---

브랜드 테마 커스터마이징

- `createTheme(...)` 과 `<ThemeProvider overrides={brand}>`: 라이트/다크 모드와 별개로 색·radius·글꼴 등을 바꿀 수 있어요. 모드별(`light`/`dark`)·공통(`common`) 값을 지원해요.
- `createIntentColors(intent, hex)`: 대표색 하나로 라이트·다크 색 세트를 만들어요 (글자 대비 4.5:1 보장).
- CSS 변수 이름을 `--bestow-*` 로 고정했어요 (예: `--bestow-color-primary-solid`). CSS 로 직접 덮어쓸 수 있어요.
- 중첩한 ThemeProvider 는 `theme` 을 생략하면 바깥 모드를, `overrides` 는 바깥 값을 이어받아요.
- `usePortalProps()` 추가 (portal 요소에 테마·브랜드 적용). `usePortalClassName()` 은 deprecated.
