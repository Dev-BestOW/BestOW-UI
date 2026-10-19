---
'@bestow-ui/react': patch
---

`styles.css` 크기를 줄였어요(minify + brotli 33 kB → 9 kB). 빌드 도구가 컴포넌트마다 남기던 디버그용 주석(원본 CSS 를 base64 로 담은 이름)을
파일 경로만 남기게 바꿨어요. 스타일은 그대로이고, CSS 를 압축하지 않고 그대로 쓰는 환경에서 특히 가벼워져요.
