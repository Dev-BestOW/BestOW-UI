---
'@bestow-ui/react': patch
---

RadioGroup 을 네이티브 `<input type="radio">` 로 바꿨어요. 화살표 키를 바로 떼는 입력(자동화 도구·일부 보조기기)에서
포커스만 옮겨지고 선택이 빠지던 문제를 고쳤어요. props·ref·모양은 그대로이고, `@radix-ui/react-radio-group` 의존성이 빠졌어요.
