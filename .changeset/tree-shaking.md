---
"@bestow-ui/react": patch
---

tree-shaking 개선 — 컴포넌트 정의(`forwardRef`/`createContext`)에 `/* @__PURE__ */` 를 붙여, 쓰지 않는 컴포넌트와 그 Radix 의존성이
사용자 번들에서 빠지도록 했다. 예: `Button` 하나만 import 할 때 40 kB → 2.4 kB (minified + brotli).
