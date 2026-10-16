# @bestow-ui/react

## 1.1.0

### Minor Changes

- e831b9c: `Combobox` 선택 지우기
  
  - 입력창 글자를 모두 지우고 닫으면(포커스 이동·Esc·Enter) 선택이 지워지고 `onValueChange('')` 가 호출된다.
    (지금까지는 한 번 고르면 빈 값으로 되돌릴 수 없었다.) 글자를 모두 지운 상태에서는 Enter 가 첫 항목을 고르지 않는다.
  - `clearable` prop — 값이 있을 때 "선택 지우기" 버튼을 보여 준다. 이름은 `clearLabel` 또는 `LocaleProvider` 의 `clearSelection`(선택 키, `en` 에 포함).
  - Storybook 자동 문서에 `PhoneNumberInput`·`BusinessNumberInput`·`AmountInput`·`TextField`·`Accordion` 의 주요 prop(label·error·size 등)이 보이도록 했다 (타입 변화 없음).
- 9ad5028: `SegmentedControl` 추가 — 여러 값 중 하나를 고르는 칸 묶음(기간 일/주/월, 정렬, 화면 모드 등).
  WAI-ARIA radiogroup 의미: Tab 으로 선택된 칸에 들어가고 ←/→ 로 옮기면 바로 선택된다.
  `options`(label·icon·disabled), `value`/`defaultValue`/`onValueChange`, `label` 또는 `aria-label`, `size`(sm/md/lg — 전체 높이가 Button 과 같음),
  `fullWidth`, `disabled`, `name`. 선택에 따라 패널이 바뀌면 Tabs 를 쓴다.
- 3e54d8c: `SkipLink`(본문 바로가기) 추가 — KWCAG 2.2 6.4.1 반복 영역 건너뛰기 / WCAG 2.4.1.
  페이지 맨 앞에 두면 평소에는 보이지 않다가 첫 Tab 에 왼쪽 위에 나타나고, 누르면 본문(기본 `#main`)으로 포커스를 옮긴다
  (본문이 포커스를 받지 못하면 `tabindex="-1"` 을 붙인다). 문구는 `LocaleProvider` 의 `skipToContent`(선택 키, `en` 에 포함).

## 1.0.0

### Major Changes

- 3fee2d5: **1.0.0 — 공개 API 안정화.** 이제부터 이름·타입을 바꾸는 변경은 major 에서만 해요. 0.12.0 에서 deprecated 로 안내한 옛 이름을 제거했어요
  (옮기는 방법: [MIGRATION-1.0.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md)).
  
  - `toast()` 의 `variant` 제거 → `color` (`'default'` → `'neutral'`)
  - `DropdownMenuItem` 의 `color="default"` 제거 → `color="neutral"`(기본값)
  - `Spinner` 의 `color="current"` 제거 → `color="inherit"`(기본값)
  - `usePortalClassName()` 제거 → `usePortalProps()` 의 `className`·`style`
  
  CSS 변수 이름(`--bestow-*` 87개)도 1.0 에서 확정했어요. 바꾸거나 지우면 major 로 다뤄요.

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
- Updated dependencies [5c05fee]
- Updated dependencies [3fee2d5]
  - @bestow-ui/tokens@1.0.0
  - @bestow-ui/icons@0.1.2

## 0.12.0

### Minor Changes

- 948ec39: 1.0 준비: 공개 API 이름 통일 (옛 이름은 deprecated — 그대로 동작하고 개발 모드에서 한 번 경고, 1.0 에서 제거)
  
  - `toast()` 의 `variant` → **`color`** (`'default'` → `'neutral'`, `'primary'` 추가). Alert·Badge 와 같은 이름.
  - `DropdownMenuItem` 의 `color="default"` → **`color="neutral"`**.
  - `Spinner` 의 `color="current"` → **`color="inherit"`** (Link·Typography 와 같은 이름).
  - `Checkbox` 에 **`onCheckedChange(checked)`** 추가 (Switch 와 같은 이름). `onChange` 도 그대로 쓸 수 있다.
  - 빠져 있던 타입 export: `AlertColor`, `ToastColor`, `ToastContextValue`, `TableSize`, `TableAlign`.
- 25da752: 한국 서비스 키트 — `Calendar`(달력)와 `DatePicker`(날짜 입력) 추가.
  
  - Calendar — WAI-ARIA grid. 일요일부터 시작, 일요일·공휴일(`isHoliday`) 빨강, 토요일 파랑. 날짜 이름은 "15, 2026년 10월 목요일"
    (보이는 숫자로 시작 — WCAG 2.5.3 / KWCAG 2.2 "레이블과 네임"), 오늘은 `aria-current="date"`. 키보드 ←→↑↓, Home/End,
    PageUp/PageDown(Shift 와 함께 1년), Enter/Space. `min`·`max`·`isDateDisabled`, `today`(고정용), `initialFocus`.
  - DatePicker — `YYYY-MM-DD` 직접 입력(하이픈 자동) + 달력 버튼(Popover). 열면 선택된 날짜(없으면 오늘)로 포커스, 고르면 버튼으로 복귀.
    없는 날짜·범위 밖 날짜는 자동 오류. 값은 시간대 문제가 없는 'YYYY-MM-DD' 문자열.
  - Popover `onOpenAutoFocus` 추가. 날짜 함수 `formatKoreanDate`, `parseISODate`, `toISODate` 공개.
- 3beb564: `LocaleProvider` 와 영어 문구 묶음 `en` 추가 — 컴포넌트 기본 문구(닫기, 결과 없음, 페이지·달력·날짜·주소·인증번호 문구 등)를
  한곳에서 바꾼다. 우선순위는 컴포넌트 prop > LocaleProvider > 한국어 기본값이고, 중첩하면 바깥 값을 이어받는다.
  ThemeProvider 안의 글자는 한글을 단어 단위로 줄바꿈한다(`word-break: keep-all`, 긴 URL 등은 `overflow-wrap: break-word`).

### Patch Changes

- c2dd829: Calendar 공휴일을 색만으로 알리지 않도록 숫자 아래에 점을 표시한다 (KWCAG 2.2 5.4.1 / WCAG 1.4.1).
- 9a3b294: npm README 를 포지셔닝("한국 서비스를 만들 때 바로 쓰는, 접근성이 검증된 React 디자인 시스템")에 맞게 고쳤다 — 한국 서비스 키트,
  검사로 증명하는 접근성(KWCAG 2.2 대응 근거), 테마 빌더, 다국어 안내. 번들 크기 안내를 현재 값(Button 하나 약 1.5 kB)으로 갱신.

## 0.11.0

### Minor Changes

- a1ad94b: 한국 서비스 키트 1차 — `AgreementGroup`(약관 동의)와 `VerificationCodeInput`(인증번호) 추가.
  
  - AgreementGroup — "전체 동의" ↔ 개별 항목 동기화(일부만 동의하면 부분 선택), 필수·선택 표시, 약관 내용 펼쳐 보기
    ("필수 서비스 이용약관 동의 보기" 처럼 어떤 약관인지 담은 버튼 이름, aria-expanded), 오류는 fieldset 의 aria-describedby,
    필수 확인 헬퍼 `hasAllRequiredAgreements(items, value)`, `name` 으로 form 제출.
  - VerificationCodeInput — 실제 입력창 하나 + 칸 모양 표시(문자 자동 채우기 `autocomplete="one-time-code"`, 숫자 키패드,
    "123-456" 붙여넣기 정리), `onComplete`, `expiresIn`(남은 시간, `role="timer"`)·`onExpire`(만료 안내를 알림 영역에)·`onResend`(재전송 버튼,
    입력·시간 초기화), `type="alphanumeric"`.
- e46f8cf: 한국 서비스 키트 2차 — `PhoneNumberInput`(전화번호), `BusinessNumberInput`(사업자등록번호), `AmountInput`(금액) 추가.
  
  - 입력하는 대로 하이픈·쉼표를 넣고 값은 서식 없이 넘긴다(전화·사업자번호는 숫자 문자열, 금액은 number).
    중간에 입력하거나 서식 문자 바로 뒤에서 지워도 커서가 제자리에 머문다(실제 브라우저 스토리 테스트로 확인).
  - 전화번호: 010-1234-5678 / 02-123-4567 / 1588-1234, `type="tel"`·`autocomplete="tel-national"`.
  - 사업자등록번호: 123-45-67890, 10자리를 채우면 검증 공식으로 확인해 자동 오류(`validate`, `invalidText`), `onValueChange(digits, valid)`.
  - 금액: 천 단위 쉼표, 단위("원"), "12만 5,000원" 읽기(`showKoreanAmount`), `max`.
  - 함수도 공개: `formatPhoneNumber`, `formatBusinessNumber`, `isValidBusinessNumber`, `formatKoreanAmount`.
- 56be911: 한국 서비스 키트 — `AddressInput`(주소 입력) 추가, Modal·Drawer 포커스 복귀 수정.
  
  - AddressInput — 우편번호·기본 주소·상세 주소를 "주소" 그룹으로. "주소 검색" 을 누르면 검색 창(Modal)에서 고르고, 고르면 상세 주소로 포커스 이동.
    `provider` 로 주소 서비스를 바꿔 끼운다(기본 `kakaoPostcodeProvider` — 카카오 우편번호 서비스, 검색할 때 스크립트를 불러와 코어 번들에 영향 없음).
    도로명 주소 참고 항목은 카카오 가이드 방식(`composeExtraAddress`). `name` 으로 form 제출.
  - Modal `onCloseAutoFocus` 추가 — 닫힐 때 포커스를 보낼 곳을 정한다.
  - 수정: `trigger` 없이 `open` 으로 제어하는 Modal·Drawer 가 닫히면 포커스가 body 로 사라지던 문제 — 열 때 포커스가 있던 요소로 돌아간다.

### Patch Changes

- 68527b8: `createIntentColors('primary', hex)` 의 포커스 링 대비 수정 — 노랑·하늘색·분홍처럼 밝은 브랜드 색이면 라이트 모드 포커스 링이
  흰 배경과 3:1 미만(예: #facc15 → 1.53:1)이라 잘 보이지 않았다. 배경과 3:1 이 안 되면 대비가 보장된 text 색을 쓴다(다크도 같은 규칙).

## 0.10.0

### Minor Changes

- 2b0ce51: Combobox 컴포넌트 추가 — 입력해서 거르며 고르는 선택 상자 (WAI-ARIA combobox + listbox 패턴). 입력창 `role="combobox"`·
  `aria-expanded`·`aria-controls`·`aria-activedescendant`(포커스는 입력창 유지), ↓/↑ 이동(비활성 항목 건너뜀)·Enter 선택·Esc 닫기(입력 되돌림),
  `filter`(기본: label 포함 검색), `emptyMessage`, Select 와 같은 폼 props(`label`, `helperText`, `error`, `required`, `size`, `fullWidth`,
  `disabled`, `name` → hidden input). 목록은 Radix Popover 로 portal 에 띄우며 테마·브랜드 오버라이드를 따른다.
- b17ebf8: Slider 컴포넌트 추가 — Radix Slider 기반. 값은 배열(`[50]`, 범위는 `[20, 80]`), 제어(`value`/`onValueChange`)·비제어(`defaultValue`),
  `onValueCommit`, `min`/`max`/`step`/`minStepsBetweenThumbs`, `label`(손잡이 이름)·`helperText`(aria-describedby)·`showValue`·`formatValue`
  (aria-valuetext 공용), 범위 손잡이 이름 `thumbLabels`(기본 "최소"/"최대"), `size`(sm/md), `disabled`.
  막대·손잡이는 primary text 색이라 라이트·다크 모두 트랙과 3:1 이상 구분된다. `@radix-ui/react-slider` 의존성이 추가됐다.
- 240c926: Table 컴포넌트 추가 — 네이티브 `<table>` 기반 `Table`/`TableHeader`/`TableBody`/`TableFooter`/`TableRow`/`TableHead`/`TableCell`.
  `size`(sm/md), `striped`, `stickyHeader`, `caption`(표·스크롤 영역의 이름) 또는 `aria-label`, 셀 `align`, 행 `selected`,
  머리 셀 정렬(`sortDirection` + `onSort` → 정렬 버튼과 `aria-sort`). 머리 셀 `scope` 는 위치에 따라 자동(col/row).
  넘치는 표는 바깥 영역이 스크롤되고 키보드로 스크롤할 수 있도록 포커스를 받는다.

## 0.9.0

### Minor Changes

- 368b6d5: Alert 컴포넌트 추가 — 페이지 안 안내 문구(callout). `variant`(soft/outline/solid) × `color`(primary/neutral/success/warning/danger),
  `title`, color 별 기본 아이콘(`icon` 으로 교체, `false` 로 숨김), `action`, `onClose`(닫기 버튼, `closeLabel`).
  기본으로 role 이 없고, 동적으로 나타나는 메시지는 `role="alert"`/`"status"` 를 넘긴다.
- e63b3b1: Drawer 컴포넌트 추가 — 화면 가장자리에서 밀려 나오는 패널(시트). Modal 과 같은 API(`open`/`defaultOpen`/`onOpenChange`, `trigger`,
  `title`, `description`, `footer`, `hideCloseButton`, `closeOnOverlayClick`) + `side`(right/left/top/bottom), `size`(sm/md/lg),
  `DrawerClose`. Radix Dialog 기반(포커스 가두기·Esc·포커스 복귀), portal 에 테마·브랜드 오버라이드 적용, reducedMotion 시 애니메이션 끔.
- 368b6d5: IconButton 컴포넌트 추가 — 아이콘만 있는 정사각형 버튼. Button 과 같은 `variant`·`color`·`size`·`loading`·`disabled` 를 받고
  기본은 ghost·neutral. `aria-label` 은 타입에서 필수이고, 아이콘 크기는 size 에 맞춰 자동 조절된다(sm 16 · md 20 · lg 24px).
- e63b3b1: Link·Breadcrumb 컴포넌트 추가.
  
  - Link — `color`(primary/neutral/inherit), `underline`(always 기본 — 색만으로 구분되지 않게 / hover), `external`(새 창 + `rel` +
    아이콘 + 스크린리더용 "(새 창)", `externalLabel`). 라우터 링크는 클라이언트 컴포넌트에서 `as={NextLink}`,
    서버 컴포넌트에서 `asChild`(`<Link asChild><NextLink href="/">홈</NextLink></Link>`).
  - Breadcrumb — `items`(`{ label, href? }[]`), `nav` > `ol` 구조, 마지막 항목은 링크가 아닌 `aria-current="page"`, 장식용 구분 기호
    (`separator` 로 변경), `linkAs` 로 라우터 링크, `aria-label`(기본 "이동 경로").
  
  `@radix-ui/react-slot` 의존성이 추가됐다.
- e63b3b1: Progress 컴포넌트 추가 — `role="progressbar"` 진행 막대. `value`/`max`(범위 밖 값은 보정), 생략하면 진행률을 모르는 상태(움직이는 막대,
  동작 줄이기 설정에서는 정지), `label`(이름) 또는 `aria-label`, `showValue`·`formatValue`(화면 표시와 aria-valuetext 에 함께 사용),
  `size`(sm/md/lg), `color`. 막대는 intent 의 text 색을 써서 라이트·다크 모두 트랙과 3:1 이상 구분된다.
- 02111c5: `warning` 의미 색 추가 — tokens 에 `palette.amber` 와 `lightColors`/`darkColors` 의 `warning` 그룹(라이트·다크 모두 대비 4.5:1 이상)을,
  react 에 `--bestow-color-warning-*` CSS 변수와 Badge `color="warning"`, Typography `color="warning"`, Toast `variant: 'warning'`,
  `createIntentColors('warning', hex)` 를 추가했다. 노란색이라 solid 위 글자는 어두운 색(gray900)이다.
  
  다크 모드 solid hover 대비 수정 — 다크의 primary·danger·success `solidHover` 가 흰 글자와 대비 4.5:1 미만(3.3~4.38)이라
  한 단계 어두운 색으로 바꿨다. `createIntentColors` 도 hover 색이 글자 대비를 해치면 반대 방향(어둡게/밝게)으로 만들도록 고쳤다.

### Patch Changes

- 02111c5: 다크 모드 그림자 — 그림자 토큰을 모드별로 나눴다. tokens 에 `darkShadow`(`shadow` 와 같은 키)를 추가하고, react 테마는 다크 모드에서
  이 값을 쓴다. 어두운 배경에서도 보이도록 더 진하게 하고, 떠 있는 면(md·lg)에는 가장자리를 구분하는 옅은 밝은 테두리(ring)를 넣었다.
  CSS 변수 이름(`--bestow-shadow-*`)은 그대로다. 이에 맞춰 Card `elevated` 는 보완용 테두리를 빼고 그림자만 쓴다.
- e63b3b1: tree-shaking 개선 — vanilla-extract recipe 가 만드는 스타일 함수 호출(createRuntimeFn)에 `/* @__PURE__ */` 를 붙이도록 빌드를 고쳤다.
  이전에는 컴포넌트 하나만 import 해도 모든 컴포넌트의 recipe 가 번들에 남았다. 예: `Button` 하나 2.6 kB → 1.5 kB (minified + brotli).
- Updated dependencies [02111c5]
- Updated dependencies [02111c5]
  - @bestow-ui/tokens@0.9.0

## 0.8.3

### Patch Changes

- b511f80: npm 패키지 페이지 정리 — 각 패키지에 README(영어 + 한국어)와 LICENSE 파일을 넣고, `keywords`·`author`·`bugs`·설명을 보강했다.
  코드 변경은 없다.
- Updated dependencies [b511f80]
  - @bestow-ui/tokens@0.8.3
  - @bestow-ui/icons@0.1.1

## 0.8.2

### Patch Changes

- 913b204: Accordion — `type="multiple"` 에 `collapsible` 이 함께 넘어와도(예: single ↔ multiple 을 바꾸며 props 를 펼쳐 넘길 때)
  DOM 속성으로 새지 않도록 했다. 이전에는 React 의 "non-boolean attribute `collapsible`" 콘솔 경고가 났다.

## 0.8.1

### Patch Changes

- 159c13e: 접근성 대비 수정 — 라이트 테마 `fg.subtle`(= `palette.gray[600]`)을 `#868e96` → `#666e76` 으로 바꿔 흰색·gray50·gray100 배경에서 4.5:1 이상을 맞춘다
  (helperText, placeholder, caption 등). RadioGroup 의 비활성 옵션은 컨트롤과 레이블만 흐리게 하고 설명 텍스트는 그대로 읽히게 한다.
- 159c13e: tree-shaking 개선 — 컴포넌트 정의(`forwardRef`/`createContext`)에 `/* @__PURE__ */` 를 붙여, 쓰지 않는 컴포넌트와 그 Radix 의존성이
  사용자 번들에서 빠지도록 했다. 예: `Button` 하나만 import 할 때 40 kB → 2.4 kB (minified + brotli).
- Updated dependencies [159c13e]
  - @bestow-ui/tokens@0.8.1

## 0.8.0

### Minor Changes

- f1d315a: Accordion 컴포넌트 추가 (`@radix-ui/react-accordion`) — `Accordion`(`type` single/multiple, `collapsible`), `AccordionItem`(`title`, `headingLevel`, `disabled`).
  펼침/접힘 높이 애니메이션은 움직임 줄이기 설정에서 끈다.
- f1d315a: DropdownMenu 컴포넌트 추가 (`@radix-ui/react-dropdown-menu`) — `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`(`side`/`align`),
  `DropdownMenuItem`(`icon`, `shortcut`, `color="danger"`, `disabled`), `DropdownMenuLabel`, `DropdownMenuGroup`, `DropdownMenuSeparator`.
- f1d315a: Pagination 컴포넌트 추가 — `totalPages`, `page`/`defaultPage`/`onPageChange`, `siblingCount`, `boundaryCount`, `size`(sm/md), `getItemLabel`(다국어).
  `nav` + 목록 구조, 현재 페이지 `aria-current="page"`, 생략 부호(…)는 스크린리더에서 숨김. 현재 페이지가 바뀌어도 버튼 수가 일정하다.
- f1d315a: Popover 컴포넌트 추가 (`@radix-ui/react-popover`) — `content`, `title`(dialog 이름)/`aria-label`, `showClose`, `showArrow`, Tooltip 과 같은 `side`/`align`,
  `open`/`defaultOpen`/`onOpenChange`, `modal`. 내용 안에서 닫는 요소용 `PopoverClose`.
- f1d315a: Tabs 컴포넌트 추가 (`@radix-ui/react-tabs`) — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`. `variant`(line/soft), `size`(sm/md), `activationMode`(automatic/manual).

## 0.7.0

### Minor Changes

- 33f9dba: Avatar 컴포넌트 추가 (`@radix-ui/react-avatar`) — `src`, `alt`/`name`(접근 가능한 이름), `size`(sm/md/lg), `shape`(circle/square).
  이미지가 없거나 실패하면 이름 이니셜 → 사용자 아이콘 순으로 대체하고, `fallback` 으로 직접 지정할 수 있다.
- 33f9dba: Divider 컴포넌트 추가 — `orientation`(horizontal/vertical, `role="separator"`), `decorative`, 가운데 텍스트(`children`).
- 33f9dba: Skeleton 컴포넌트 추가 — `variant`(text/rect/circle), `width`/`height`(숫자는 px), `lines`(text 여러 줄). shimmer 애니메이션은 움직임 줄이기 설정에서 멈춘다.

## 0.6.0

### Minor Changes

- e9e628d: Badge 컴포넌트 추가 — `variant`(solid/soft/outline) × `color`(primary/neutral/danger/success), `size`(sm/md/lg), `startIcon`.
- e9e628d: Card 컴포넌트 추가 — `variant`(outline/elevated/soft), `padding`(none/sm/md/lg), `as`. 영역 구분용 `CardHeader`, `CardBody`, `CardFooter`.

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
