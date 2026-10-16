---
'@bestow-ui/react': minor
---

`Combobox` 선택 지우기

- 입력창 글자를 모두 지우고 닫으면(포커스 이동·Esc·Enter) 선택이 지워지고 `onValueChange('')` 가 호출된다.
  (지금까지는 한 번 고르면 빈 값으로 되돌릴 수 없었다.) 글자를 모두 지운 상태에서는 Enter 가 첫 항목을 고르지 않는다.
- `clearable` prop — 값이 있을 때 "선택 지우기" 버튼을 보여 준다. 이름은 `clearLabel` 또는 `LocaleProvider` 의 `clearSelection`(선택 키, `en` 에 포함).
- Storybook 자동 문서에 `PhoneNumberInput`·`BusinessNumberInput`·`AmountInput`·`TextField`·`Accordion` 의 주요 prop(label·error·size 등)이 보이도록 했다 (타입 변화 없음).
