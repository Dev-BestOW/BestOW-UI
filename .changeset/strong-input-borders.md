---
'@bestow-ui/react': minor
---

입력 칸 테두리를 진하게 하는 `strongInputBorders` 와 선택 토큰 `color.border.input`·`color.border.inputHover` 를 추가했어요.

- 기본 테두리(`border.default`)는 흰 배경과 1.3:1 이라 칸의 경계가 잘 보이지 않아요(WCAG 1.4.11 비텍스트 대비 3:1 미만).
  `createTheme(strongInputBorders)` 를 테마에 더하면 Input·Select·Combobox·DatePicker·서식 입력·Textarea·인증번호 칸의 테두리가
  배경과 3:1 이상으로 진해져요(라이트 gray600, 다크 gray500 — hover 는 한 단계 더).
- 새 토큰은 기본값이 없어서(CSS 변수를 정의하지 않음) **지금 화면은 바뀌지 않아요**. 지정하지 않으면 기존처럼 `border.default`·`border.strong` 을 따라요
  — `border.default` 를 덮어써 둔 설정도 그대로 적용돼요.
- 2.0 에서 진한 테두리가 기본값이 될 예정이에요(`docs/MIGRATION-2.0.md`).
