---
"@bestow-ui/react": minor
---

Spinner 컴포넌트와 Button `loading` prop 추가

- `Spinner`: `size`(sm/md/lg), `color`(current/primary/neutral/danger), `label`(스크린리더용, 빈 문자열이면 장식용). 움직임 줄이기 설정에서는 느리게 회전한다.
- `Button` `loading`: 스피너 표시 + `aria-busy`, 클릭과 폼 제출을 막는다. `disabled` 와 달리 포커스를 유지한다.
