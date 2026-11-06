---
"@bestow-ui/react": minor
---

`MultiCombobox` 추가 — 입력해서 거르며 여러 개를 고르는 선택 상자.

- 고른 값은 입력창 안의 칩(Tag)으로, 고른 순서대로 보인다. `value`·`defaultValue`·`onValueChange` 는 `string[]`. `options` 에 없는 값도 값 그대로 칩이 된다.
- Enter·클릭으로 고르기·풀기(목록은 열린 채 검색어만 지움, listbox `aria-multiselectable`). 빈 입력창에서 Backspace 로 마지막 칩을 지운다. 칩 삭제 버튼은 Tab 순서에 있고, 지우면 포커스가 다음 칩 → 앞 칩 → 입력창으로 가며 0.5초 뒤 "<이름> 삭제됨" 을 알린다.
- `maxSelected` — 다 고르면 나머지 항목이 비활성이 되고 "최대 n개까지 고를 수 있어요" 를 칸 설명으로 보여 주고 알린다. `removeLabel` 로 칩 삭제 버튼 이름을 바꾼다. `clearable` 은 모두 지우기.
- `name` 이면 고른 값마다 hidden input 하나(`name=a&name=b`). `form.reset()`·`fieldset disabled` 계약을 따른다.
- `BestowMessages` 에 선택 키 `selectedOptions`(칩 목록 이름 "고른 항목")·`maxSelected` 추가(`en` 포함).
- `Combobox` 는 목록 로직을 MultiCombobox 와 함께 쓰도록 내부를 나눴다(동작 변화 없음).
