---
'@bestow-ui/react': minor
---

Alert 컴포넌트 추가 — 페이지 안 안내 문구(callout). `variant`(soft/outline/solid) × `color`(primary/neutral/success/warning/danger),
`title`, color 별 기본 아이콘(`icon` 으로 교체, `false` 로 숨김), `action`, `onClose`(닫기 버튼, `closeLabel`).
기본으로 role 이 없고, 동적으로 나타나는 메시지는 `role="alert"`/`"status"` 를 넘긴다.
