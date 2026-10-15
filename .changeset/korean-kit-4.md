---
'@bestow-ui/react': minor
---

한국 서비스 키트 — `Calendar`(달력)와 `DatePicker`(날짜 입력) 추가.

- Calendar — WAI-ARIA grid. 일요일부터 시작, 일요일·공휴일(`isHoliday`) 빨강, 토요일 파랑. 날짜 이름은 "15, 2026년 10월 목요일"
  (보이는 숫자로 시작 — WCAG 2.5.3 / KWCAG 2.2 "레이블과 네임"), 오늘은 `aria-current="date"`. 키보드 ←→↑↓, Home/End,
  PageUp/PageDown(Shift 와 함께 1년), Enter/Space. `min`·`max`·`isDateDisabled`, `today`(고정용), `initialFocus`.
- DatePicker — `YYYY-MM-DD` 직접 입력(하이픈 자동) + 달력 버튼(Popover). 열면 선택된 날짜(없으면 오늘)로 포커스, 고르면 버튼으로 복귀.
  없는 날짜·범위 밖 날짜는 자동 오류. 값은 시간대 문제가 없는 'YYYY-MM-DD' 문자열.
- Popover `onOpenAutoFocus` 추가. 날짜 함수 `formatKoreanDate`, `parseISODate`, `toISODate` 공개.
