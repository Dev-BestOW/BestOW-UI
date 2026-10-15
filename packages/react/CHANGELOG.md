# @bestow-ui/react

## 0.5.0

### Minor Changes

- c17083c: Spinner 컴포넌트와 Button `loading` prop 추가
  
  - `Spinner`: `size`(sm/md/lg), `color`(current/primary/neutral/danger), `label`(스크린리더용, 빈 문자열이면 장식용). 움직임 줄이기 설정에서는 느리게 회전한다.
  - `Button` `loading`: 스피너 표시 + `aria-busy`, 클릭과 폼 제출을 막는다. `disabled` 와 달리 포커스를 유지한다.

## 0.4.0

### Minor Changes

- 78d6803: 폼 컴포넌트 추가: Switch, RadioGroup, Textarea
  
  - `Switch`: Checkbox 와 같은 사용법(`label`, `size`, `checked`/`onCheckedChange`, `disabled`). Radix Switch 기반.
  - `RadioGroup`: `options` 배열(`label`, `description`, `disabled`), `orientation`(vertical/horizontal), 그룹 `label`/`helperText`/`error`. 보조 설명은 스크린리더에 설명(aria-describedby)으로 읽혀요.
  - `Textarea`: TextField 와 같은 `label`/`helperText`/`error`, `size`, `resize`, 내용에 맞춰 늘어나는 `autoResize`, 글자 수 `showCount`(`maxLength` 와 함께 "12/200").

## 0.3.1

### Patch Changes

- 800ec75: - `createIntentColors('primary', …)` 가 포커스 링 색(`border.focus`)도 브랜드 색으로 맞춰요. 이전에는 브랜드 테마에서도 포커스 링이 기본 파랑으로 남았어요.
  - `Select` 에 `value` 를 넘기면 `undefined` 여도 제어 모드로 동작해요. `useState<string>()` 처럼 초기값이 없을 때 나던 "uncontrolled → controlled" 경고가 없어지고, `undefined` 는 placeholder 로 표시돼요.

## 0.3.0

### Minor Changes

- 2f274f5: 브랜드 테마 커스터마이징
  
  - `createTheme(...)` 과 `<ThemeProvider overrides={brand}>`: 라이트/다크 모드와 별개로 색·radius·글꼴 등을 바꿀 수 있어요. 모드별(`light`/`dark`)·공통(`common`) 값을 지원해요.
  - `createIntentColors(intent, hex)`: 대표색 하나로 라이트·다크 색 세트를 만들어요 (글자 대비 4.5:1 보장).
  - CSS 변수 이름을 `--bestow-*` 로 고정했어요 (예: `--bestow-color-primary-solid`). CSS 로 직접 덮어쓸 수 있어요.
  - 중첩한 ThemeProvider 는 `theme` 을 생략하면 바깥 모드를, `overrides` 는 바깥 값을 이어받아요.
  - `usePortalProps()` 추가 (portal 요소에 테마·브랜드 적용). `usePortalClassName()` 은 deprecated.

## 0.2.1

### Patch Changes

- 8062c7c: `@bestow-ui/icons` 패키지 추가: SVG 아이콘 57종을 React 컴포넌트로 제공 (기본 세트는 Lucide, ISC)
  
  - react: Modal, Select, Toast 의 내부 아이콘을 `@bestow-ui/icons` 로 교체
- Updated dependencies [8062c7c]
  - @bestow-ui/icons@0.1.0

## 0.2.0

### Minor Changes

- 77dc33e: 복합 컴포넌트 추가: Modal, Select, Tooltip, Toast (Radix UI 기반)
  
  - portal 로 렌더링되는 요소에도 현재 테마(다크 모드 포함)가 적용되도록 `usePortalClassName` 추가
  - tokens: `zIndex`, `bg.overlay` 색상 추가

### Patch Changes

- Updated dependencies [77dc33e]
  - @bestow-ui/tokens@0.2.0

## 0.1.0

### Minor Changes

- 6c0806b: 첫 릴리스: 디자인 토큰, ThemeProvider(라이트/다크), Button, Typography, Stack, Input, TextField, Checkbox

### Patch Changes

- Updated dependencies [6c0806b]
  - @bestow-ui/tokens@0.1.0
