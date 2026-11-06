# @bestow-ui/korean-utils

## 0.4.0

### Minor Changes

- 79f9813: 한국 키트 2차: 카드번호·법인등록번호·계좌번호와 은행 목록.
  
  - korean-utils: `formatCardNumber`·`isValidCardNumber`(자릿수 + Luhn, 아메리칸 익스프레스 15자리 4-6-5)·`cardNumberLength`, `formatCorporateNumber`·`isValidCorporateNumber`(검증 공식), `accountNumberDigits`·`isValidAccountNumber`(숫자만, 10~16자리), `KOREAN_BANKS`(국내 은행 26곳, 금융결제원 표준 코드 3자리 + 이름, 2026-11 기준)와 `KoreanBank` 타입.
  - react: `CardNumberInput`(autocomplete cc-number), `CorporateNumberInput`, `AccountNumberInput`(서식 없이 숫자만, 하이픈 붙여넣기 가능) 추가. 다 채운 순간의 검증 오류는 0.8초 뒤 알린다(BusinessNumberInput 과 같은 내부 구현으로 정리 — 동작 변화 없음). 위 함수와 `KOREAN_BANKS` 를 같은 이름으로 다시 export. `BestowMessages` 에 선택 키 `cardNumber`·`cardNumberInvalid`·`cardNumberIncomplete`·`corporateNumber`·`corporateNumberInvalid`·`corporateNumberIncomplete`·`accountNumber`·`accountNumberIncomplete` 추가(`en` 포함).

## 0.3.0

### Minor Changes

- ee53ee1: 마스킹 함수가 원본을 그대로 돌려주지 않게 바꿨어요. 한 글자 이름은 `*`, `maskDigits` 는 남길 자리가 전체를 덮으면 모두 가려요. `maskCardNumber` 는 13자리 미만, `maskPhoneNumber` 는 형식을 알 수 없는 번호를 모두 가려요(15xx 같은 대표번호는 그대로예요).
- 5c0b60d: 전화번호·사업자등록번호 처리를 고쳤어요.
  
  - 050 번호를 11자리(`0507-123-4567`)와 12자리(`0507-1234-5678`)로 나누고, 12자리의 마지막 숫자가 잘리던 문제를 고쳤어요. `phoneNumberMaxDigits` 는 050 번호에 12 를 돌려줘요.
  - `+82` 로 시작하는 번호를 국내 번호로 바꿔요. 새 함수 `phoneNumberDigits` 를 추가했고 `PhoneNumberInput` 붙여 넣기에도 적용돼요.
  - `isValidBusinessNumber('0000000000')` 이 `false` 를 돌려줘요.

## 0.2.0

### Minor Changes

- 18f75b9: 주민등록번호 입력과 마스킹 함수 추가
  
  - korean-utils: `formatResidentNumber`·`parseResidentNumber`(생년월일·성별·외국인 여부)·`isValidResidentNumber`(생년월일·뒷자리 첫 숫자 — 2020년 10월 이후 번호는 뒤 6자리가 임의라 마지막 검증 숫자는 보지 않아요), 화면 표시용 마스킹 `maskName`(홍*동)·`maskPhoneNumber`(010-****-5678)·`maskResidentNumber`(900101-1******)·`maskCardNumber`·`maskDigits`.
  - react: 위 함수를 같은 이름으로 다시 내보내요. 새 컴포넌트 `ResidentNumberInput` — 앞 6자리와 뒷자리를 두 칸으로 받고 뒷자리는 가려요(password). 번호를 통째로 붙여 넣으면 두 칸에 나누고, 다 채우면 생년월일·뒷자리 첫 숫자로 오타를 걸러요. 앞칸을 채워도 포커스를 옮기지 않아요(KWCAG 7.2.1). 나이·성별만 필요하면 `digits={7}`.
  - 새 선택 문구 키 `residentNumber`·`residentNumberFront`·`residentNumberBack`·`residentNumberBackFirst`·`residentNumberInvalid`·`residentNumberIncomplete`(`en` 포함).

## 0.1.0

### Minor Changes

- 첫 배포 — `@bestow-ui/react` 에서 쓰던 한국 서비스 서식·검증 함수를 의존성 없는 패키지로 분리했어요.
  `formatPhoneNumber`·`phoneNumberMaxDigits`, `formatBusinessNumber`·`isValidBusinessNumber`, `formatKoreanAmount`,
  `formatKoreanDate`·`KOREAN_WEEKDAYS`, `composeExtraAddress`.
