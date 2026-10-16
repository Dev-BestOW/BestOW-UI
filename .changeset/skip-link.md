---
'@bestow-ui/react': minor
---

`SkipLink`(본문 바로가기) 추가 — KWCAG 2.2 6.4.1 반복 영역 건너뛰기 / WCAG 2.4.1.
페이지 맨 앞에 두면 평소에는 보이지 않다가 첫 Tab 에 왼쪽 위에 나타나고, 누르면 본문(기본 `#main`)으로 포커스를 옮긴다
(본문이 포커스를 받지 못하면 `tabindex="-1"` 을 붙인다). 문구는 `LocaleProvider` 의 `skipToContent`(선택 키, `en` 에 포함).
