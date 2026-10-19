---
'@bestow-ui/react': minor
---

Stepper 를 추가했어요. 가입·결제·신청처럼 여러 단계로 나뉜 흐름에서 지금 어디쯤인지 보여 줘요.

- `steps`(이름·설명), `current`(0부터, 앞 단계는 완료로 표시), `orientation`(가로·세로)
- 순서 목록이라 스크린리더가 "4개 중 2번째" 를 읽고, 현재 단계는 `aria-current="step"`, 완료한 단계는 "(완료)" 를 함께 읽어요
- 문구는 `LocaleProvider` 의 `steps`·`stepCompleted` 로 바꿀 수 있어요
