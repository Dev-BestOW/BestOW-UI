---
"@bestow-ui/react": minor
---

`Tag`·`TagGroup`·`EmptyState` 추가.

- `Tag`: 짧은 글자 태그. 표시용, `onRemove` 로 삭제(삭제 버튼 "<글자> 삭제", 버튼 위에서 Delete·Backspace 도), `selected`·`defaultSelected`·`onSelectedChange` 로 고르는 칩(button, `aria-pressed` + 켜지면 체크 아이콘, 고대비 모드는 시스템 강조색). `color`·`variant`(soft/outline)·`size`(sm 24px/md 32px). 삭제 버튼은 24px 누를 자리.
- `TagGroup`: Tag 목록(`role="list"`). 지우면 포커스를 다음 태그(없으면 앞 태그, 다 지우면 목록)로 옮기고 0.5초 뒤 "<글자> 삭제됨" 을 알린다.
- `EmptyState`: 보여 줄 것이 없을 때의 안내(아이콘·제목·설명·행동 버튼, `titleAs` 기본 h3, `size` sm/md). hook 이 없어 서버 컴포넌트에서도 쓴다. `TableEmpty` 안에 넣어도 된다.
- `BestowMessages` 에 선택 키 `removeTag`·`tagRemoved` 추가(`en` 포함).
