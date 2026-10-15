---
'@bestow-ui/react': patch
---

Accordion — `type="multiple"` 에 `collapsible` 이 함께 넘어와도(예: single ↔ multiple 을 바꾸며 props 를 펼쳐 넘길 때)
DOM 속성으로 새지 않도록 했다. 이전에는 React 의 "non-boolean attribute `collapsible`" 콘솔 경고가 났다.
