---
'@bestow-ui/react': minor
---

한국 서비스 키트 — `AddressInput`(주소 입력) 추가, Modal·Drawer 포커스 복귀 수정.

- AddressInput — 우편번호·기본 주소·상세 주소를 "주소" 그룹으로. "주소 검색" 을 누르면 검색 창(Modal)에서 고르고, 고르면 상세 주소로 포커스 이동.
  `provider` 로 주소 서비스를 바꿔 끼운다(기본 `kakaoPostcodeProvider` — 카카오 우편번호 서비스, 검색할 때 스크립트를 불러와 코어 번들에 영향 없음).
  도로명 주소 참고 항목은 카카오 가이드 방식(`composeExtraAddress`). `name` 으로 form 제출.
- Modal `onCloseAutoFocus` 추가 — 닫힐 때 포커스를 보낼 곳을 정한다.
- 수정: `trigger` 없이 `open` 으로 제어하는 Modal·Drawer 가 닫히면 포커스가 body 로 사라지던 문제 — 열 때 포커스가 있던 요소로 돌아간다.
