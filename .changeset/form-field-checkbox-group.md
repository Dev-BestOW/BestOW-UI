---
"@bestow-ui/react": minor
---

`FormField`·`CheckboxGroup` 추가

- `FormField` — 직접 만든 입력이나 다른 라이브러리 입력에 TextField 와 같은 레이블·도움말·오류·필수 연결을 붙여요. 자식 함수가 받은 `id`·`aria-describedby`·`aria-invalid`·`aria-required` 를 입력에 펼쳐 넣고(react-hook-form `register` 와 함께 펼쳐도 돼요), label 로 이름을 받을 수 없는 요소는 둘째 인자의 `labelId` 를 `aria-labelledby` 에 넣어요. hook 이 없어 서버 컴포넌트에서도 써요.
- `CheckboxGroup` — 여러 개를 고르는 체크박스 묶음(`options`·`value: string[]`·`onValueChange`, RadioGroup 과 같은 모양). 묶음 레이블·도움말·오류(체크박스마다 `aria-invalid`), `required` 는 * 와 스크린리더용 "필수", 고른 값은 같은 `name` 으로 폼에 제출돼요. ErrorSummary 링크는 선택된(없으면 첫) 체크박스로 가요.
