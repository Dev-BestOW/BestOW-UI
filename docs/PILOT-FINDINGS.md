# 파일럿 화면에서 발견한 것 (ROADMAP P14-1)

실제 서비스에서 흔한 **주문 관리 관리자 화면**(`apps/playground/app/orders/page.tsx`)을 디자인 시스템만으로 만들며 막히거나
직접 짜야 했던 부분을 모았다. 화면: 검색·상태 필터·정렬·행 선택과 일괄 취소·페이지 이동 → 행 메뉴 → 상세 Drawer → 등록 Modal 폼(검증·오류 요약).
E2E: `apps/playground/e2e/orders.spec.ts` (흐름 6개, Chromium·WebKit).

## 고친 버그 (컴포넌트를 함께 쓸 때만 드러난 것)

| 문제 | 원인 | 수정 |
|---|---|---|
| **Modal·Drawer 안에서 연 Select 목록을 고를 수 없다** (배경막에 가림). Combobox·DropdownMenu·Popover·DatePicker 달력도 같음 | `zIndex.dropdown`(1000) < 배경막(1300) | dropdown 1320(대화상자 위·토스트 아래) + 쌓임 순서 테스트 |
| **행 메뉴 → 상세 Drawer 를 닫으면 포커스가 사라진다** (body 로) | trigger 없는 Drawer 는 열 때 포커스가 있던 요소로 돌아가는데, 그게 메뉴와 함께 사라진 메뉴 항목 | `useReturnFocus` 가 메뉴 안이면 메뉴를 연 버튼(`aria-labelledby`)을 기억 + 단위 테스트(변이 확인) |

## 빈칸 — 직접 짜야 했던 것 (우선순위 순)

| # | 무엇 | 지금 한 방법 | 제안 |
|---|---|---|---|
| ~~1~~ ✅ | **폼 오류 요약** (→ `ErrorSummary`, 2026-10-19) (제출 시 "고칠 곳이 N개" + 각 칸으로 가는 링크 + 요약으로 포커스) | Alert + `<ul>` + `<a onClick={focus}>` + `tabIndex={-1}` div 를 25줄로 직접. 링크가 브라우저 기본 파란색이라 Alert 안에서 어색 | `ErrorSummary` 컴포넌트 또는 Alert 안 링크 스타일 + 패턴 문서. P14-2(폼 라이브러리 연동)와 함께 |
| ~~2~~ ✅ | **스크린리더 전용 글자** (→ `VisuallyHidden`, 2026-10-19) (표의 "작업" 열 머리글) | 내부 `visuallyHidden` 스타일은 있지만 공개되지 않아 `aria-label` 로 대신 | `VisuallyHidden` 컴포넌트 공개 (작음) |
| ~~3~~ ✅ | **키–값 목록** (→ `DescriptionList`, 2026-10-19) (상세 Drawer 의 고객·연락처·금액…) | `<dl>` 에 인라인 grid 스타일 | `DescriptionList`(가로·세로, 토큰 간격·글자색) |
| ~~4~~ ✅ | **표 선택 상태 관리** (→ `useTableSelection`, 2026-10-19) (이 페이지 모두 선택·혼합 상태·페이지 넘어 유지) | 상태·계산을 15줄 직접 | 패턴 문서 또는 `useTableSelection` 훅 — 파일럿 1개로는 판단 보류 |
| ~~5~~ ✅ | **Modal footer 의 제출 버튼** (→ Modal 스토리 "폼 제출", 2026-10-19) | `<Button type="submit" form="order-form">` (form 속성) | Modal 문서에 폼 패턴 예시 추가 |
| ~~6~~ ✅ | 빈 상태(검색 결과 없음)·일괄 작업 바 (→ `TableEmpty`·`TableSkeleton`·Table 스토리 "목록 화면 패턴", 2026-10-19) | Table 행 하나에 안내 + Card 로 조합 | 컴포넌트까지는 불필요. 패턴 문서(P15)에 예시 |

**빈칸 6개 모두 해결 (2026-10-19).**

## 잘 된 것

- Table 의 정렬 머리글(`aria-sort`)·행 선택(`selected`)·Checkbox `indeterminate`·Badge·Pagination·DropdownMenu 행 메뉴는 그대로 조합됐다.
- 서식 입력(PhoneNumberInput·AmountInput·NumberInput·DatePicker)이 폼 안에서 `id`·`error`·`helperText` 를 같은 방식으로 받아 오류 연결이 쉬웠다.
- axe(라이트·다크+브랜드), 콘솔·hydration 오류 0, 320px 리플로(표는 가로 스크롤 — 1.4.10 예외), 글자 간격, 기본 글꼴 2배를 모두 통과.

---

# 파일럿 2 — 외부 서비스 shipped 에 실제 도입 (2026-10-23~)

[shipped](https://github.com/Dev-BestOW/shipped)(GitHub 커밋으로 경력기술서 초안을 만드는 서비스)에서 Tailwind CSS 4 를 걷어내고
`@bestow-ui/react` 1.7.0 만으로 화면 4개(홈·레포 목록·기여 분석·git log 업로드)를 옮기며 찾은 것을 모은다. 이후 shipped 작업에서 찾는 것도 여기에 이어 적는다.
playground 와 다른 조건: npm 에서 설치한 패키지를 씀, Next.js 16.4 `cacheComponents`(PPR) 켬, 서버 컴포넌트 비중이 높음, 스타일은 CSS Modules + `--bestow-*` 토큰.

## 버그

| 문제 | 원인 | 제안 |
|---|---|---|
| **세로 Stepper 에서 설명이 있는 단계와 없는 단계가 섞이면 원 사이 간격이 들쭉날쭉하다** (설명 없음 52px, 있음 68px) | vertical 단계 높이 = max(원 28px, 글자 높이) + `paddingBottom: space[6]`. 설명이 없으면 원이 더 높아 52px, 있으면 글자 두 줄이 더 높아 68px 이 된다 | 글자 영역에 최소 높이(이름 + 설명 한 줄)를 두거나, 원 사이 간격을 고정하고 설명은 그 안에 넣는다. shipped 는 모든 단계에 한 줄 설명(결과 요약·걸린 시간)을 붙여 우회 |
| **숨겨 둔 SkipLink 의 그림자가 화면 맨 위에 비친다** (라이트 테마, 왼쪽 위 약 100×5px 가 255 → 251 로 옅게 어두움. 다크는 눈에 안 띔) | `top: space[2]`(8px)에서 `translateY(calc(-100% - space[4]))` 만큼 올려 아랫변이 화면 위 8px 에 걸리는데, `shadow.md`(`0 4px 12px`)가 그 아래로 약 16px 번진다 | 숨긴 상태에서는 `box-shadow` 를 빼고 `:focus` 에서만 준다(가장 간단). 또는 이동 거리에 그림자 번짐만큼 더한다. 대비 차이가 작아 axe·시각 회귀로는 안 잡힌다 |

## 빈칸 — 직접 짜야 했던 것 (우선순위 순)

| # | 무엇 | 지금 한 방법 | 제안 |
|---|---|---|---|
| 1 | **버튼 모양 링크** ("내 레포 보기"·"GitHub로 시작하기"·외부 앱 설치 페이지처럼 페이지를 이동하는 주요 동작) | `Button` 이 `asChild`·`as` 를 받지 않아, `Button.css.ts` 의 토큰을 그대로 옮긴 `ButtonLink`(CSS Module 약 80줄)를 직접 만들었다. hover·focus·크기를 손으로 맞춰야 하고 Button 이 바뀌면 어긋난다 | `Button`·`IconButton` 에 `asChild` (`@radix-ui/react-slot` 은 이미 의존성). 서버 컴포넌트에서 Next `Link` 를 감쌀 수 있어야 하므로 `as` 보다 `asChild` 가 먼저. 링크일 때 `disabled`·`loading` 을 어떻게 다룰지 문서화 |
| 2 | **`as` 로 바꾼 요소의 고유 속성** (`<Typography as="time" dateTime>`, `as="label" htmlFor` 등) | props 타입이 `HTMLAttributes<HTMLElement>` 고정이라 `dateTime` 이 타입 오류 → Typography 안에 `<time>` 을 한 겹 더 뒀다 | `as` 에 따라 props 를 넓히는 다형성 타입(`ComponentPropsWithoutRef<E>`) 또는 `asChild`. `Stack`·`Card`·`Grid` 등 `as` 를 받는 컴포넌트 공통 |
| 3 | **Pretendard 불러오기 안내** | 기본 글꼴 토큰이 `"Pretendard Variable"` 인데 패키지에 글꼴이 없고 README 에 불러오는 방법이 없다. `pretendard` 패키지의 dynamic subset CSS 를 `layout.tsx` 에서 import 했다 | README "시작하기"에 글꼴 한 줄 추가 (`import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'` 와 Next.js `next/font/local` 예). 안 불러오면 시스템 글꼴로 보인다는 점도 |
| 4 | **Tailwind 와 함께 쓰기** (shipped 는 결국 Tailwind 를 뺐지만, 도입 검토 때 막힌 부분) | `styles.css` 가 `@layer` 밖이라, Tailwind 4 유틸리티(`@layer utilities`)를 컴포넌트에 붙이면 컴포넌트가 정한 속성은 항상 진다 (`<Button className="px-8">` 무시) | 스타일을 `@layer bestow` 로 감싸 사용하는 쪽이 순서를 정하게 하거나, 최소한 "Tailwind 와 함께 쓰기" 문서에 우선순위 규칙을 적는다 |
| 5 | **Table 밖의 빈 상태 상자** (레포 0개, 커밋 0개, "이메일을 고르면 결과가 나와요") | 점선 테두리 + 안내 문구 + 버튼을 `EmptyState`(Stack + CSS Module)로 직접. 파일럿 1 은 Table 안(`TableEmpty`)이라 컴포넌트까지는 불필요로 판단 | 두 번째 등장. 제목·설명·동작 버튼 슬롯을 가진 `EmptyState` 컴포넌트 검토, 아니면 패턴 문서에 예시 |
| 6 | **테두리 + 구분선 목록** (레포 목록·커밋 목록·이메일 체크 목록) | `<ul>` + CSS Module `DividedList` 로 직접 (Table 은 열이 없는 목록에 무겁고 Card 는 항목마다 상자가 생김) | 판단 보류 — `List`(divided, 항목 padding 토큰) 정도의 작은 컴포넌트 또는 패턴 문서 |
| 7 | **진행 중인 비동기 단계 표시** (AI가 도구를 부르며 분석하는 단계가 실시간으로 늘어나는 목록: "작업 영역 살펴보기 → 변경 파일 확인 → 초안 쓰기") | `Stepper orientation="vertical"` 에 단계를 계속 추가하고 `current` 를 진행 중 단계로 둔다. Stepper 에는 진행 중(로딩) 표시가 없어 1분 가까이 멈춘 것처럼 보이므로, 목록 아래에 `Spinner` + "○○ 중이에요" 문구를 따로 둠. 진행 상황은 `VisuallyHidden role="status"` 로 따로 알림 | Stepper 단계에 `status`(`complete`·`current`·`loading`·`error`) 또는 `loading` prop. 스트리밍 UI(AI 응답·업로드 처리)에서 흔한 패턴이라 Stepper 스토리에 "비동기 진행" 예시 |

## 잘 된 것

- `shared.js`(서버)·`client.js`(`'use client'`) 분리 덕분에 PPR 정적 셸 + Suspense 스트리밍 화면에서 `Stack`·`Grid`·`Typography`·`Card`·`Skeleton`·`Badge` 를 서버 컴포넌트에서 그대로 썼다. 빌드·dev 로그에 오류 없음.
- 서버 컴포넌트에서 `<Link asChild><NextLink/></Link>` 로 라우터 링크 연결. `Link external` 의 새 창 안내도 그대로 씀.
- `ThemeProvider theme="system"` 하나로 라이트·다크 첫 화면이 깜빡이지 않음 (헤드리스 Chrome 라이트·다크 스크린숏으로 확인).
- 구간별 props(`Stack direction={{ base: 'column', md: 'row' }}`, `Grid columns={{ base: 2, md: 4 }}`)로 Tailwind 반응형 클래스를 모두 대체.
- `FileUpload`(maxSize 거절 안내 포함), `Checkbox` `label` 에 ReactNode(이름·이메일 두 줄), `Avatar`(이름 글자 폴백)를 고치지 않고 씀.
- 토큰이 이름 고정 CSS 변수라 CSS Modules 에서 바로 `var(--bestow-color-border-default)` 처럼 쓸 수 있었다.
