---
'@bestow-ui/react': patch
'@bestow-ui/tokens': patch
'@bestow-ui/icons': patch
---

설치·서버 렌더링·색 대비 점검에서 찾은 문제 수정

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
