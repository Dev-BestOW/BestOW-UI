---
'@bestow-ui/react': minor
---

FileUpload 를 추가했어요. 서류·사진 첨부처럼 파일을 고를 때 써요.

- "파일 선택" 버튼 또는 끌어다 놓기로 고르고, 선택한 파일을 이름·크기·삭제 버튼 목록으로 보여 줘요
- `accept`·`maxSize`·`maxFiles`·`multiple` — 조건에 맞지 않는 파일은 이유를 보여 주고 스크린리더에 알려요(`onReject`)
- `name` 을 주면 일반 폼 제출에도 파일이 그대로 실려요. 서버 전송은 `onValueChange` 로 받은 File 로 직접 해요
- 문구는 `LocaleProvider` 의 `fileSelect`·`fileRemove` 등으로 바꿀 수 있어요
