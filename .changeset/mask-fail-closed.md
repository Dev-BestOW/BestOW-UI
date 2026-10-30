---
'@bestow-ui/korean-utils': minor
'@bestow-ui/react': patch
---

마스킹 함수가 원본을 그대로 돌려주지 않게 바꿨어요. 한 글자 이름은 `*`, `maskDigits` 는 남길 자리가 전체를 덮으면 모두 가려요. `maskCardNumber` 는 13자리 미만, `maskPhoneNumber` 는 형식을 알 수 없는 번호를 모두 가려요(15xx 같은 대표번호는 그대로예요).
