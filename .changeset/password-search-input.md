---
"@bestow-ui/react": minor
---

`PasswordInput`·`SearchInput` 추가.

- `PasswordInput`: 입력창 끝의 보기 버튼(`aria-pressed`, Tab 으로 닿음, 마우스로 눌러도 입력창 포커스·커서 유지)으로 글자를 보이거나 가린다. `visible`·`defaultVisible`·`onVisibleChange`, 기본 `autoComplete="current-password"`(새 비밀번호는 `"new-password"`), form reset 이면 다시 가린다.
- `SearchInput`: 돋보기 + 글자가 있을 때 지우기 버튼(지우면 입력창으로 포커스). `value`·`defaultValue`·`onValueChange`, Enter → `onSearch`(한글 조합을 끝내는 Enter 는 무시), Escape → 검색어 지우기. 레이블이 없으면 이름 "검색".
- `BestowMessages` 에 선택 키 `password`·`showPassword`·`search`·`clearSearch` 추가(`en` 포함).
