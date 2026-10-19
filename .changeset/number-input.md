---
'@bestow-ui/react': minor
---

NumberInput 을 추가했어요. 수량·인원처럼 숫자를 입력할 때 써요.

- −/+ 버튼, ↑/↓(`step`)·PageUp/PageDown(`largeStep`)·Home/End(`min`/`max`)로 값을 바꿔요
- 천 단위 쉼표(`thousandSeparator`), 소수(`precision`, 기본은 `step` 의 자릿수), 단위(`unit`)
- 입력 중에는 범위 밖 값도 받고, 포커스가 빠질 때 범위·자릿수에 맞춰요
- 스크린리더에는 spinbutton 으로 값·최소·최대를 알려요. 버튼 문구는 `LocaleProvider` 의 `increment`·`decrement` 로 바꿀 수 있어요
