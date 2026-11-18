---
"@bestow-ui/korean-utils": minor
"@bestow-ui/react": minor
---

초성 검색 함수 `getChoseong`·`matchesKorean` 을 추가했어요(react 에서도 같은 이름으로 export). Combobox·MultiCombobox 의 기본 필터가 초성(`ㄱㅁ` → 국민은행)과 입력 중인 한글(`국미` → 국민, `한` → 하나)도 찾아요 — 한글을 치는 도중 목록이 사라졌다 나타나지 않아요. 예전 기본(대소문자 무시 포함 검색)이 찾던 항목은 그대로 찾아요.
