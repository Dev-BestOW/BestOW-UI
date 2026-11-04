---
"@bestow-ui/react": major
"@bestow-ui/tokens": minor
---

입력 칸·체크 컨트롤 테두리 기본값을 배경과 3:1 이상으로 올려요 (WCAG 1.4.11 비텍스트 대비).

- **화면이 바뀌어요(react major):** 입력 칸(TextField·Select·Combobox·DatePicker·서식 입력·Textarea·인증번호 칸) 테두리가 라이트 gray300 → gray600(흰 배경 1.3:1 → 5.18:1),
  다크 gray700 → gray500 으로, Checkbox·Radio 테두리·꺼진 Switch·Stepper 예정 단계가 라이트 gray500 → gray600 으로 진해져요. 카드·구분선 테두리(`border.default`)는 그대로예요.
- 입력 칸은 더 이상 `border.default`·`border.strong` 을 따르지 않아요. 이 두 토큰을 덮어써 입력 칸 색을 바꾸던 경우 `border.input`·`inputHover`·`control` 을 함께 지정하세요.
- `strongInputBorders` 는 기본값과 같아져 deprecated 예요(3.0 에서 제거).
- tokens: `lightColors`·`darkColors` 의 `border` 에 `input`·`inputHover`·`control` 추가(`SemanticColors` 에서는 선택 키).

1.x 처럼 되돌리는 방법은 `docs/MIGRATION-2.0.md` 에 있어요.
