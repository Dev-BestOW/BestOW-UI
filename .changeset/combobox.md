---
'@bestow-ui/react': minor
---

Combobox 컴포넌트 추가 — 입력해서 거르며 고르는 선택 상자 (WAI-ARIA combobox + listbox 패턴). 입력창 `role="combobox"`·
`aria-expanded`·`aria-controls`·`aria-activedescendant`(포커스는 입력창 유지), ↓/↑ 이동(비활성 항목 건너뜀)·Enter 선택·Esc 닫기(입력 되돌림),
`filter`(기본: label 포함 검색), `emptyMessage`, Select 와 같은 폼 props(`label`, `helperText`, `error`, `required`, `size`, `fullWidth`,
`disabled`, `name` → hidden input). 목록은 Radix Popover 로 portal 에 띄우며 테마·브랜드 오버라이드를 따른다.
