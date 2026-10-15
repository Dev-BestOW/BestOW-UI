---
'@bestow-ui/react': minor
---

Progress 컴포넌트 추가 — `role="progressbar"` 진행 막대. `value`/`max`(범위 밖 값은 보정), 생략하면 진행률을 모르는 상태(움직이는 막대,
동작 줄이기 설정에서는 정지), `label`(이름) 또는 `aria-label`, `showValue`·`formatValue`(화면 표시와 aria-valuetext 에 함께 사용),
`size`(sm/md/lg), `color`. 막대는 intent 의 text 색을 써서 라이트·다크 모두 트랙과 3:1 이상 구분된다.
