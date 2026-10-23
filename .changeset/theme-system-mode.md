---
"@bestow-ui/react": minor
---

`ThemeProvider` 에 `theme="system"` 추가 — OS 의 라이트·다크 설정을 따르고, 쓰는 도중 설정을 바꾸면 바로 반영해요.
서버 렌더링에서는 CSS 미디어쿼리(`prefers-color-scheme`)로 그려서 JS 가 실행되기 전 첫 화면부터 맞는 모드로 보여요(브랜드 테마 `overrides` 포함, 깜빡임 없음).
`useTheme()` 은 실제 적용 중인 `'light' | 'dark'` 를 돌려줘요(서버·hydration 첫 렌더에서는 `'light'`). 새 타입 `ThemeMode`(`'light' | 'dark' | 'system'`) — 기존 `ThemeName` 은 그대로예요.
테마 영역에 `color-scheme` 을 지정해 다크 모드에서 스크롤바·네이티브 컨트롤도 어둡게 그려요.
