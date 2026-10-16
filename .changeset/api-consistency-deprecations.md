---
'@bestow-ui/react': minor
---

1.0 준비: 공개 API 이름 통일 (옛 이름은 deprecated — 그대로 동작하고 개발 모드에서 한 번 경고, 1.0 에서 제거)

- `toast()` 의 `variant` → **`color`** (`'default'` → `'neutral'`, `'primary'` 추가). Alert·Badge 와 같은 이름.
- `DropdownMenuItem` 의 `color="default"` → **`color="neutral"`**.
- `Spinner` 의 `color="current"` → **`color="inherit"`** (Link·Typography 와 같은 이름).
- `Checkbox` 에 **`onCheckedChange(checked)`** 추가 (Switch 와 같은 이름). `onChange` 도 그대로 쓸 수 있다.
- 빠져 있던 타입 export: `AlertColor`, `ToastColor`, `ToastContextValue`, `TableSize`, `TableAlign`.
