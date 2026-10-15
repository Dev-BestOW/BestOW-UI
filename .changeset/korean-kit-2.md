---
'@bestow-ui/react': minor
---

한국 서비스 키트 2차 — `PhoneNumberInput`(전화번호), `BusinessNumberInput`(사업자등록번호), `AmountInput`(금액) 추가.

- 입력하는 대로 하이픈·쉼표를 넣고 값은 서식 없이 넘긴다(전화·사업자번호는 숫자 문자열, 금액은 number).
  중간에 입력하거나 서식 문자 바로 뒤에서 지워도 커서가 제자리에 머문다(실제 브라우저 스토리 테스트로 확인).
- 전화번호: 010-1234-5678 / 02-123-4567 / 1588-1234, `type="tel"`·`autocomplete="tel-national"`.
- 사업자등록번호: 123-45-67890, 10자리를 채우면 검증 공식으로 확인해 자동 오류(`validate`, `invalidText`), `onValueChange(digits, valid)`.
- 금액: 천 단위 쉼표, 단위("원"), "12만 5,000원" 읽기(`showKoreanAmount`), `max`.
- 함수도 공개: `formatPhoneNumber`, `formatBusinessNumber`, `isValidBusinessNumber`, `formatKoreanAmount`.
