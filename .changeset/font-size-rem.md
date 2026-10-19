---
'@bestow-ui/react': minor
---

글자 크기가 브라우저 기본 글꼴 크기 설정을 따르도록 바꿨어요. 글자 크기 CSS 변수(`--bestow-font-size-*`)를 px 대신 rem 으로 내고
(16px 기준이라 기본 설정에서는 화면이 같아요), 글자가 든 컨트롤(Button·Tabs·Badge·SegmentedControl·Pagination)은 글자가 커지면 함께 커져요.
`@bestow-ui/tokens` 의 값은 그대로예요. 또 320px 처럼 좁은 화면에서 VerificationCodeInput 의 칸이 화면보다 넓어지던 문제를 고쳤어요.
