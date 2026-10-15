---
'@bestow-ui/tokens': minor
'@bestow-ui/react': minor
---

`warning` 의미 색 추가 — tokens 에 `palette.amber` 와 `lightColors`/`darkColors` 의 `warning` 그룹(라이트·다크 모두 대비 4.5:1 이상)을,
react 에 `--bestow-color-warning-*` CSS 변수와 Badge `color="warning"`, Typography `color="warning"`, Toast `variant: 'warning'`,
`createIntentColors('warning', hex)` 를 추가했다. 노란색이라 solid 위 글자는 어두운 색(gray900)이다.

다크 모드 solid hover 대비 수정 — 다크의 primary·danger·success `solidHover` 가 흰 글자와 대비 4.5:1 미만(3.3~4.38)이라
한 단계 어두운 색으로 바꿨다. `createIntentColors` 도 hover 색이 글자 대비를 해치면 반대 방향(어둡게/밝게)으로 만들도록 고쳤다.
