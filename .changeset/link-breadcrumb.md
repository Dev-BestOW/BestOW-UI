---
'@bestow-ui/react': minor
---

Link·Breadcrumb 컴포넌트 추가.

- Link — `color`(primary/neutral/inherit), `underline`(always 기본 — 색만으로 구분되지 않게 / hover), `external`(새 창 + `rel` +
  아이콘 + 스크린리더용 "(새 창)", `externalLabel`). 라우터 링크는 클라이언트 컴포넌트에서 `as={NextLink}`,
  서버 컴포넌트에서 `asChild`(`<Link asChild><NextLink href="/">홈</NextLink></Link>`).
- Breadcrumb — `items`(`{ label, href? }[]`), `nav` > `ol` 구조, 마지막 항목은 링크가 아닌 `aria-current="page"`, 장식용 구분 기호
  (`separator` 로 변경), `linkAs` 로 라우터 링크, `aria-label`(기본 "이동 경로").

`@radix-ui/react-slot` 의존성이 추가됐다.
