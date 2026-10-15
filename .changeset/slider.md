---
'@bestow-ui/react': minor
---

Slider 컴포넌트 추가 — Radix Slider 기반. 값은 배열(`[50]`, 범위는 `[20, 80]`), 제어(`value`/`onValueChange`)·비제어(`defaultValue`),
`onValueCommit`, `min`/`max`/`step`/`minStepsBetweenThumbs`, `label`(손잡이 이름)·`helperText`(aria-describedby)·`showValue`·`formatValue`
(aria-valuetext 공용), 범위 손잡이 이름 `thumbLabels`(기본 "최소"/"최대"), `size`(sm/md), `disabled`.
막대·손잡이는 primary text 색이라 라이트·다크 모두 트랙과 3:1 이상 구분된다. `@radix-ui/react-slider` 의존성이 추가됐다.
