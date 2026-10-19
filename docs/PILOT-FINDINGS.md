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
| 4 | **표 선택 상태 관리** (이 페이지 모두 선택·혼합 상태·페이지 넘어 유지) | 상태·계산을 15줄 직접 | 패턴 문서 또는 `useTableSelection` 훅 — 파일럿 1개로는 판단 보류 |
| 5 | **Modal footer 의 제출 버튼** | `<Button type="submit" form="order-form">` (form 속성) | Modal 문서에 폼 패턴 예시 추가 |
| 6 | 빈 상태(검색 결과 없음)·일괄 작업 바 | Table 행 하나에 안내 + Card 로 조합 | 컴포넌트까지는 불필요. 패턴 문서(P15)에 예시 |

## 잘 된 것

- Table 의 정렬 머리글(`aria-sort`)·행 선택(`selected`)·Checkbox `indeterminate`·Badge·Pagination·DropdownMenu 행 메뉴는 그대로 조합됐다.
- 서식 입력(PhoneNumberInput·AmountInput·NumberInput·DatePicker)이 폼 안에서 `id`·`error`·`helperText` 를 같은 방식으로 받아 오류 연결이 쉬웠다.
- axe(라이트·다크+브랜드), 콘솔·hydration 오류 0, 320px 리플로(표는 가로 스크롤 — 1.4.10 예외), 글자 간격, 기본 글꼴 2배를 모두 통과.
