# @bestow-ui/tokens

## 1.0.0

### Major Changes

- 3fee2d5: **1.0.0 — 토큰 이름 안정화.** 코드 변경은 없어요. `@bestow-ui/react` 1.0 과 함께 토큰 키(=react 의 CSS 변수 이름)를 확정하고,
  이후 키를 바꾸거나 지우는 변경은 major 에서만 해요.

### Patch Changes

- 5c05fee: 설치·서버 렌더링·색 대비 점검에서 찾은 문제 수정
  
  - CommonJS 프로젝트(`require`, TypeScript `module: node16/nodenext`)에서 타입을 ESM 용 `index.d.ts` 로 읽어
    TypeScript 5.7 이하에서 TS1479 오류가 나던 문제 — `exports` 의 `require` 조건이 `index.d.cts` 를 가리키게 했다. `./package.json` export 추가.
  - (react) React 18 에서 서버 렌더링하면 서식 입력(PhoneNumberInput·BusinessNumberInput·AmountInput·DatePicker)이
    "useLayoutEffect does nothing on the server" 경고를 남기던 문제.
  - (react) Next.js 서버 컴포넌트에서 `createTheme`·`createIntentColors`·`vars`·`themeClass`·서식 함수(`formatKoreanAmount` 등)·
    날짜 함수·`en`·`hasAllRequiredAgreements`·`composeExtraAddress` 를 부르면 "Attempted to call … from the server" 로 실패하던 문제.
    패키지 전체에 붙어 있던 `"use client"` 를 컴포넌트·hook 파일(`dist/client.js`)에만 붙이고, 함수·값은 지시어 없는 `dist/shared.js` 로 나눴다
    (import 경로는 그대로 `@bestow-ui/react`).
  - (react) `createIntentColors` 가 초록(#059669)·주황(#ea580c)처럼 흰 글자·짙은 글자 모두 대비 4.5:1 이 안 나오는 중간 밝기 색에서
    기준에 못 미치는 버튼 색을 만들던 문제 — 이때는 solid 의 밝기를 4.5 가 나올 만큼만 옮긴다(색 공간 표본 343색 테스트 추가).
  - (react) 인라인 `Calendar` 를 서버 렌더링할 때 서버(UTC 등)와 브라우저(KST)의 "오늘" 이 다르면 hydration 이 어긋나던 문제 —
    `today` 를 주지 않으면 오늘은 hydration 뒤 브라우저에서 정한다.
  - (react) `Pagination` 의 `getItemLabel` 에 쓰는 `PaginationItemType` 타입 export.

## 0.9.0

### Minor Changes

- 02111c5: 다크 모드 그림자 — 그림자 토큰을 모드별로 나눴다. tokens 에 `darkShadow`(`shadow` 와 같은 키)를 추가하고, react 테마는 다크 모드에서
  이 값을 쓴다. 어두운 배경에서도 보이도록 더 진하게 하고, 떠 있는 면(md·lg)에는 가장자리를 구분하는 옅은 밝은 테두리(ring)를 넣었다.
  CSS 변수 이름(`--bestow-shadow-*`)은 그대로다. 이에 맞춰 Card `elevated` 는 보완용 테두리를 빼고 그림자만 쓴다.
- 02111c5: `warning` 의미 색 추가 — tokens 에 `palette.amber` 와 `lightColors`/`darkColors` 의 `warning` 그룹(라이트·다크 모두 대비 4.5:1 이상)을,
  react 에 `--bestow-color-warning-*` CSS 변수와 Badge `color="warning"`, Typography `color="warning"`, Toast `variant: 'warning'`,
  `createIntentColors('warning', hex)` 를 추가했다. 노란색이라 solid 위 글자는 어두운 색(gray900)이다.
  
  다크 모드 solid hover 대비 수정 — 다크의 primary·danger·success `solidHover` 가 흰 글자와 대비 4.5:1 미만(3.3~4.38)이라
  한 단계 어두운 색으로 바꿨다. `createIntentColors` 도 hover 색이 글자 대비를 해치면 반대 방향(어둡게/밝게)으로 만들도록 고쳤다.

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
