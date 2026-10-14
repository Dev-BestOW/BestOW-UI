---
"@bestow-ui/react": minor
---

폼 컴포넌트 추가: Switch, RadioGroup, Textarea

- `Switch`: Checkbox 와 같은 사용법(`label`, `size`, `checked`/`onCheckedChange`, `disabled`). Radix Switch 기반.
- `RadioGroup`: `options` 배열(`label`, `description`, `disabled`), `orientation`(vertical/horizontal), 그룹 `label`/`helperText`/`error`. 보조 설명은 스크린리더에 설명(aria-describedby)으로 읽혀요.
- `Textarea`: TextField 와 같은 `label`/`helperText`/`error`, `size`, `resize`, 내용에 맞춰 늘어나는 `autoResize`, 글자 수 `showCount`(`maxLength` 와 함께 "12/200").
