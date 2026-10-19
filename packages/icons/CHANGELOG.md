# @bestow-ui/icons

## 0.1.3

### Patch Changes

- 7746ede: npm README 를 한국어로 바꾸고(영어는 한 줄 소개만), 패키지 설명·검색 키워드를 정리했어요(`korean`·`kwcag`·`a11y` 등). 코드 변경은 없어요.

## 0.1.2

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

## 0.1.1

### Patch Changes

- b511f80: npm 패키지 페이지 정리 — 각 패키지에 README(영어 + 한국어)와 LICENSE 파일을 넣고, `keywords`·`author`·`bugs`·설명을 보강했다.
  코드 변경은 없다.

## 0.1.0

### Minor Changes

- 8062c7c: `@bestow-ui/icons` 패키지 추가: SVG 아이콘 57종을 React 컴포넌트로 제공 (기본 세트는 Lucide, ISC)
  
  - react: Modal, Select, Toast 의 내부 아이콘을 `@bestow-ui/icons` 로 교체
