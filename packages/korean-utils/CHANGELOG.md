# @bestow-ui/korean-utils

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
