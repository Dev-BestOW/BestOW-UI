---
'@bestow-ui/react': patch
---

tree-shaking 개선 — vanilla-extract recipe 가 만드는 스타일 함수 호출(createRuntimeFn)에 `/* @__PURE__ */` 를 붙이도록 빌드를 고쳤다.
이전에는 컴포넌트 하나만 import 해도 모든 컴포넌트의 recipe 가 번들에 남았다. 예: `Button` 하나 2.6 kB → 1.5 kB (minified + brotli).
