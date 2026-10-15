---
"@bestow-ui/tokens": patch
"@bestow-ui/react": patch
---

접근성 대비 수정 — 라이트 테마 `fg.subtle`(= `palette.gray[600]`)을 `#868e96` → `#666e76` 으로 바꿔 흰색·gray50·gray100 배경에서 4.5:1 이상을 맞춘다
(helperText, placeholder, caption 등). RadioGroup 의 비활성 옵션은 컨트롤과 레이블만 흐리게 하고 설명 텍스트는 그대로 읽히게 한다.
