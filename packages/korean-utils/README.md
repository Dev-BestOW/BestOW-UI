# @bestow-ui/korean-utils

[![npm](https://img.shields.io/npm/v/@bestow-ui/korean-utils)](https://www.npmjs.com/package/@bestow-ui/korean-utils)
[![license](https://img.shields.io/npm/l/@bestow-ui/korean-utils)](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE)

> Formatting, validation and masking helpers for Korean services — phone numbers, business and resident registration numbers, KRW amounts in Korean, dates. Zero dependencies. Docs are in Korean.

**한국 서비스에 늘 필요한 서식·검증 함수를 모았어요.** 전화번호 하이픈, 사업자등록번호 검증 공식, 주민등록번호 생년월일·성별 읽기,
"12만 5,000원" 금액 읽기, 한국어 날짜, 카카오 우편번호 참고항목, 화면에 보여 줄 때의 마스킹(`홍*동`, `010-****-5678`)까지.

- **의존성 0, 프레임워크 무관** — React·Vue·Svelte·Node 서버 어디서나 써요. 전체 약 1.3 kB, 함수 하나만 쓰면 그만큼만 번들에 들어가요(`maskName` 하나 92 B, minify + brotli).
- **입력 중인 값도 자연스럽게** — `formatPhoneNumber('0101234')` → `'010-123-4'` 처럼 덜 입력한 값도 나눠서, 입력창의 onChange 에 그대로 쓸 수 있어요.
- **하이픈이 섞여도 됨** — 숫자가 아닌 글자는 무시해요.
- [BestOW UI](https://github.com/Dev-BestOW/BestOW-UI) 디자인 시스템의 `PhoneNumberInput`·`BusinessNumberInput`·`AmountInput` 이 쓰는 함수 그대로예요.

## 설치

```bash
npm install @bestow-ui/korean-utils
# pnpm add @bestow-ui/korean-utils / yarn add @bestow-ui/korean-utils
```

## 사용하기

```ts
import {
  formatPhoneNumber,
  formatBusinessNumber,
  isValidBusinessNumber,
  formatKoreanAmount,
  formatKoreanDate,
} from '@bestow-ui/korean-utils';

formatPhoneNumber('01012345678'); // '010-1234-5678'
formatPhoneNumber('021234567'); //   '02-123-4567'
formatPhoneNumber('15881234'); //    '1588-1234'

formatBusinessNumber('1248100998'); //   '124-81-00998'
isValidBusinessNumber('124-81-00998'); // true (검증 공식)

formatKoreanAmount(125000); //    '12만 5,000원'
formatKoreanAmount(150000000); // '1억 5,000만원'
formatKoreanAmount(20000, '포인트'); // '2만포인트'

formatKoreanDate(new Date(2026, 9, 15)); //        '2026년 10월 15일 목요일'
formatKoreanDate(new Date(2026, 9, 15), false); // '2026년 10월 15일'

formatResidentNumber('9001011234567'); //  '900101-1234567'
isValidResidentNumber('900101-1234567'); // true (생년월일·뒷자리 첫 숫자)
parseResidentNumber('900101-1'); //        { birthDate: '1990-01-01', sex: 'male', foreigner: false }

maskName('홍길동'); //                  '홍*동'
maskPhoneNumber('01012345678'); //     '010-****-5678'
maskResidentNumber('9001011234567'); // '900101-1******'
maskCardNumber('1234-5678-9012-3456'); // '1234-****-****-3456'
maskDigits('110-123-456789', { end: 4 }); // '***-***-**6789' (계좌번호처럼 형식이 제각각인 번호)
```

## 함수

| 함수 | 하는 일 |
|---|---|
| `formatPhoneNumber(input)` | 하이픈 넣기. 서울(02)·대표번호(15xx·16xx·18xx)·휴대폰·지역번호·070 을 구분하고, 최대 자릿수를 넘으면 자른다 |
| `phoneNumberMaxDigits(digits)` | 그 번호의 최대 자릿수(02 → 10, 대표번호 → 8, 나머지 → 11). 입력창 `maxLength` 계산에 |
| `formatBusinessNumber(input)` | 사업자등록번호 3-2-5 하이픈 |
| `isValidBusinessNumber(input)` | 사업자등록번호 검증 공식(가중치 1,3,7,1,3,7,1,3,5) 확인. **실제로 등록된 번호인지는 국세청 조회가 필요해요** |
| `formatKoreanAmount(amount, unit = '원')` | 만·억·조 단위로 읽기 쉽게. 음수는 `-` 를 붙인다 |
| `formatKoreanDate(date, withWeekday = true)` | `2026년 10월 15일 목요일`. 스크린리더용 날짜 이름에도 좋아요 |
| `KOREAN_WEEKDAYS` | `['일', '월', '화', '수', '목', '금', '토']` |
| `formatResidentNumber(input)` | 주민·외국인등록번호 6-7 하이픈 |
| `parseResidentNumber(input)` | 앞 7자리로 생년월일(`YYYY-MM-DD`)·성별·외국인 여부. 없는 날짜면 `null`. 앞 7자리만 받는 화면에도 |
| `isValidResidentNumber(input)` | 13자리 + 생년월일·뒷자리 첫 숫자 확인. **마지막 검증 숫자는 보지 않아요** — 2020년 10월 이후 번호는 뒤 6자리가 임의 번호라 예전 공식으로는 올바른 번호도 틀렸다고 나와요. 실제 번호인지는 본인확인 기관 조회가 필요해요 |
| `maskName(name)` | 가운데 글자 가리기(`홍*동`, `남**수`, 두 글자는 `이*`) |
| `maskPhoneNumber(input)` | 가운데 자리 가리기(`010-****-5678`) |
| `maskResidentNumber(input)` | 뒤 6자리 가리기(`900101-1******`) |
| `maskCardNumber(input)` | 앞 4·뒤 4자리만 남기기 |
| `maskDigits(input, { start, end })` | 숫자 중 앞 `start`·뒤 `end` 개만 남기고 가리기(구분 글자는 그대로) |
| `composeExtraAddress(data)` | [카카오(다음) 우편번호 서비스](https://postcode.map.kakao.com/guide) 결과로 도로명 주소 참고항목(법정동, 공동주택 건물명)을 만든다 — 예: `' (역삼동, 래미안)'` |

### 입력창에서 쓰기

```tsx
const [phone, setPhone] = useState('');

<input
  type="tel"
  inputMode="numeric"
  autoComplete="tel"
  value={formatPhoneNumber(phone)}
  // 서식을 거치면 최대 자릿수에서 잘리고, 숫자만 남겨 저장한다
  onChange={(e) => setPhone(formatPhoneNumber(e.target.value).replace(/\D/g, ''))}
/>;
```

숫자만 저장하고 보여 줄 때 서식을 입혀요. 이렇게 하면 중간에 글자를 지울 때 커서가 맨 끝으로 튀는데,
BestOW UI 의 [`PhoneNumberInput`](https://dev-bestow.github.io/BestOW-UI/?path=/docs/korean-kit-phonenumberinput--docs) 은 커서 위치와
하이픈 뒤 Backspace 까지 처리해 두었어요.

> 마스킹은 **화면 표시용**이에요. 저장·전송·로그에는 가린 값이 아니라 꼭 필요한 값만 남기세요.
> 주민등록번호는 법령에 근거가 있을 때만 수집할 수 있어요(개인정보 보호법 제24조의2).

## React 컴포넌트가 필요하면

[`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react) 에 이 함수들을 쓰는 입력 컴포넌트가 있어요 — 전화번호·사업자등록번호·주민등록번호·금액·주소·인증번호·약관 동의·날짜.
접근성(KWCAG 2.2)을 CI 로 검사하고, 대표색 하나로 브랜드 테마를 만들 수 있어요. → [Storybook › Korean Kit](https://dev-bestow.github.io/BestOW-UI/?path=/docs/korean-kit-agreementgroup--docs)

`@bestow-ui/react` 1.5 까지 쓰던 `import { formatPhoneNumber } from '@bestow-ui/react'` 도 그대로 동작해요(같은 함수를 다시 내보내요).

## 라이선스

[MIT](https://github.com/Dev-BestOW/BestOW-UI/blob/main/LICENSE) © Dev-BestOW
