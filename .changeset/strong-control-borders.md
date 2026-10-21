---
'@bestow-ui/react': minor
---

`strongInputBorders` 가 Checkbox·RadioGroup 테두리, 꺼진 Switch, Stepper 의 예정 단계도 진하게 해요(선택 토큰 `color.border.control` 추가).

- 이 컨트롤들이 쓰는 `border.strong`(gray500)은 라이트에서 흰 배경과 2.07:1 이라 WCAG 1.4.11(비텍스트 대비 3:1)에 못 미쳐요.
  `strongInputBorders` 를 쓰면 라이트 gray600(5.18:1)으로 바뀌어요. 다크는 이미 8.57:1 이라 그대로예요.
- `color.border.control` 은 기본값이 없어서 **지금 화면은 바뀌지 않아요** — 지정하지 않으면 기존처럼 `border.strong` 을 따라요.
- 이미 `strongInputBorders` 를 쓰고 있다면 체크 컨트롤도 함께 진해져요. 입력 칸만 바꾸려면 `color.border.input`·`inputHover` 만 지정해요.
- 2.0 에서 기본값이 될 예정이에요(`docs/MIGRATION-2.0.md`).
