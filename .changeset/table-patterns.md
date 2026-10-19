---
'@bestow-ui/react': minor
---

목록 화면을 위한 Table 보강이에요.

- `TableEmpty` — 결과가 없을 때 표 전체 폭으로 안내·버튼을 보여 주는 행(`colSpan`)
- `TableSkeleton` — 불러오는 동안의 자리 표시 행(보조기술에서는 숨김, 표에 `aria-busy` 를 함께 줘요)
- `useTableSelection` — 행 선택 상태 hook. "이 페이지 모두 선택"(혼합 상태 포함)과 행 체크박스에 펼쳐 쓰는 prop 을 돌려주고, 페이지를 넘겨도 선택이 유지돼요
