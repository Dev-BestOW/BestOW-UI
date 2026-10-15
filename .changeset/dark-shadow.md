---
'@bestow-ui/tokens': minor
'@bestow-ui/react': patch
---

다크 모드 그림자 — 그림자 토큰을 모드별로 나눴다. tokens 에 `darkShadow`(`shadow` 와 같은 키)를 추가하고, react 테마는 다크 모드에서
이 값을 쓴다. 어두운 배경에서도 보이도록 더 진하게 하고, 떠 있는 면(md·lg)에는 가장자리를 구분하는 옅은 밝은 테두리(ring)를 넣었다.
CSS 변수 이름(`--bestow-shadow-*`)은 그대로다. 이에 맞춰 Card `elevated` 는 보완용 테두리를 빼고 그림자만 쓴다.
