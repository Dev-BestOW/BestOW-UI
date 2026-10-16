---
'@bestow-ui/react': major
---

**1.0.0 — 공개 API 안정화.** 이제부터 이름·타입을 바꾸는 변경은 major 에서만 해요. 0.12.0 에서 deprecated 로 안내한 옛 이름을 제거했어요
(옮기는 방법: [MIGRATION-1.0.md](https://github.com/Dev-BestOW/BestOW-UI/blob/main/docs/MIGRATION-1.0.md)).

- `toast()` 의 `variant` 제거 → `color` (`'default'` → `'neutral'`)
- `DropdownMenuItem` 의 `color="default"` 제거 → `color="neutral"`(기본값)
- `Spinner` 의 `color="current"` 제거 → `color="inherit"`(기본값)
- `usePortalClassName()` 제거 → `usePortalProps()` 의 `className`·`style`

CSS 변수 이름(`--bestow-*` 87개)도 1.0 에서 확정했어요. 바꾸거나 지우면 major 로 다뤄요.
