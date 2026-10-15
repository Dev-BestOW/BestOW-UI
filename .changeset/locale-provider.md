---
'@bestow-ui/react': minor
---

`LocaleProvider` 와 영어 문구 묶음 `en` 추가 — 컴포넌트 기본 문구(닫기, 결과 없음, 페이지·달력·날짜·주소·인증번호 문구 등)를
한곳에서 바꾼다. 우선순위는 컴포넌트 prop > LocaleProvider > 한국어 기본값이고, 중첩하면 바깥 값을 이어받는다.
ThemeProvider 안의 글자는 한글을 단어 단위로 줄바꿈한다(`word-break: keep-all`, 긴 URL 등은 `overflow-wrap: break-word`).
