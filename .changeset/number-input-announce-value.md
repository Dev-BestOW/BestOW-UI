---
'@bestow-ui/react': patch
---

`NumberInput` 을 ↑/↓·PageUp/PageDown·Home/End·−/+ 버튼으로 바꾸면 스크린리더가 단위를 붙인 값("2석")을 읽게 했어요.
Safari+VoiceOver 는 값이 바뀌면 글자 편집("선택 항목 대치됨, 2")으로만 읽었어요. 키·버튼으로 바꾼 값을 숨은 알림 영역으로 알리고,
직접 입력할 때는 입력한 글자를 그대로 읽으므로 알리지 않아요.
