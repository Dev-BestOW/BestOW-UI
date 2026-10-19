---
'@bestow-ui/tokens': patch
'@bestow-ui/react': patch
---

Modal·Drawer 안에서 연 Select·Combobox·DropdownMenu·Popover(DatePicker 달력 포함) 목록이 배경막 아래에 가려 고를 수 없던 문제를 고쳤어요.
`zIndex.dropdown`(`--bestow-z-index-dropdown`)을 1000 → 1320 으로 올려 대화상자보다 위, 토스트보다 아래에 그려요.
또 메뉴 항목에서 연 Modal·Drawer 를 닫으면 포커스가 메뉴 버튼으로 돌아가요(전에는 사라진 메뉴 항목을 찾다 body 로 갔어요).
