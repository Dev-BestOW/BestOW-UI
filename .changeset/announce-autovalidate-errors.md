---
"@bestow-ui/react": patch
---

BusinessNumberInput·DatePicker: 10자리(날짜는 8자리)를 채운 순간 생긴 자동 검증 오류를 스크린리더에 알려요.
지금까지는 화면에만 나오고, 입력창을 벗어났다 다시 들어가야 설명으로 들렸어요. 항상 있는 숨은 `role="status"` 영역에
입력이 0.8초 멈춘 뒤 오류 문구를 넣어요(입력한 글자를 읽는 순간에 넣으면 VoiceOver 가 알림을 버려요).
README·Storybook 소개에 스크린리더 수동 점검(VoiceOver·NVDA) 결과와 프로덕션 권장 안내를 추가했어요.
