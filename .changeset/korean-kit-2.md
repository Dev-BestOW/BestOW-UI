---
"@bestow-ui/korean-utils": minor
"@bestow-ui/react": minor
---

한국 키트 2차: 카드번호·법인등록번호·계좌번호와 은행 목록.

- korean-utils: `formatCardNumber`·`isValidCardNumber`(자릿수 + Luhn, 아메리칸 익스프레스 15자리 4-6-5)·`cardNumberLength`, `formatCorporateNumber`·`isValidCorporateNumber`(검증 공식), `accountNumberDigits`·`isValidAccountNumber`(숫자만, 10~16자리), `KOREAN_BANKS`(국내 은행 26곳, 금융결제원 표준 코드 3자리 + 이름, 2026-11 기준)와 `KoreanBank` 타입.
- react: `CardNumberInput`(autocomplete cc-number), `CorporateNumberInput`, `AccountNumberInput`(서식 없이 숫자만, 하이픈 붙여넣기 가능) 추가. 다 채운 순간의 검증 오류는 0.8초 뒤 알린다(BusinessNumberInput 과 같은 내부 구현으로 정리 — 동작 변화 없음). 위 함수와 `KOREAN_BANKS` 를 같은 이름으로 다시 export. `BestowMessages` 에 선택 키 `cardNumber`·`cardNumberInvalid`·`cardNumberIncomplete`·`corporateNumber`·`corporateNumberInvalid`·`corporateNumberIncomplete`·`accountNumber`·`accountNumberIncomplete` 추가(`en` 포함).
