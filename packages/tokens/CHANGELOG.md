# @bestow-ui/tokens

## 0.8.3

### Patch Changes

- b511f80: npm 패키지 페이지 정리 — 각 패키지에 README(영어 + 한국어)와 LICENSE 파일을 넣고, `keywords`·`author`·`bugs`·설명을 보강했다.
  코드 변경은 없다.

## 0.8.1

### Patch Changes

- 159c13e: 접근성 대비 수정 — 라이트 테마 `fg.subtle`(= `palette.gray[600]`)을 `#868e96` → `#666e76` 으로 바꿔 흰색·gray50·gray100 배경에서 4.5:1 이상을 맞춘다
  (helperText, placeholder, caption 등). RadioGroup 의 비활성 옵션은 컨트롤과 레이블만 흐리게 하고 설명 텍스트는 그대로 읽히게 한다.

## 0.2.0

### Minor Changes

- 77dc33e: 복합 컴포넌트 추가: Modal, Select, Tooltip, Toast (Radix UI 기반)
  
  - portal 로 렌더링되는 요소에도 현재 테마(다크 모드 포함)가 적용되도록 `usePortalClassName` 추가
  - tokens: `zIndex`, `bg.overlay` 색상 추가

## 0.1.0

### Minor Changes

- 6c0806b: 첫 릴리스: 디자인 토큰, ThemeProvider(라이트/다크), Button, Typography, Stack, Input, TextField, Checkbox
