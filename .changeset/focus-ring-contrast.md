---
'@bestow-ui/react': patch
---

`createIntentColors('primary', hex)` 의 포커스 링 대비 수정 — 노랑·하늘색·분홍처럼 밝은 브랜드 색이면 라이트 모드 포커스 링이
흰 배경과 3:1 미만(예: #facc15 → 1.53:1)이라 잘 보이지 않았다. 배경과 3:1 이 안 되면 대비가 보장된 text 색을 쓴다(다크도 같은 규칙).
