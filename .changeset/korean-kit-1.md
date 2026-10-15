---
'@bestow-ui/react': minor
---

한국 서비스 키트 1차 — `AgreementGroup`(약관 동의)와 `VerificationCodeInput`(인증번호) 추가.

- AgreementGroup — "전체 동의" ↔ 개별 항목 동기화(일부만 동의하면 부분 선택), 필수·선택 표시, 약관 내용 펼쳐 보기
  ("필수 서비스 이용약관 동의 보기" 처럼 어떤 약관인지 담은 버튼 이름, aria-expanded), 오류는 fieldset 의 aria-describedby,
  필수 확인 헬퍼 `hasAllRequiredAgreements(items, value)`, `name` 으로 form 제출.
- VerificationCodeInput — 실제 입력창 하나 + 칸 모양 표시(문자 자동 채우기 `autocomplete="one-time-code"`, 숫자 키패드,
  "123-456" 붙여넣기 정리), `onComplete`, `expiresIn`(남은 시간, `role="timer"`)·`onExpire`(만료 안내를 알림 영역에)·`onResend`(재전송 버튼,
  입력·시간 초기화), `type="alphanumeric"`.
