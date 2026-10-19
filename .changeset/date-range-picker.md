---
'@bestow-ui/react': minor
---

`DateRangePicker` 를 추가했어요. 조회·예약 기간처럼 시작일~종료일을 고를 때 써요.

- 시작일·종료일 DatePicker 두 개를 묶어 숫자 입력과 달력을 그대로 쓰고, 시작일이 종료일보다 늦을 수 없게 서로 제한해요
- `presets` 로 빠른 선택(오늘·1주일·1개월·3개월 — `dateRangePresets`)을 붙이면, 현재 기간과 같은 버튼이 눌린 상태로 보여요
- 값은 `{ start, end }`(`YYYY-MM-DD`). `presetRange(preset, today)` 함수도 함께 공개해요
