// @bestow-ui/korean-utils 함수 문서 — 함수마다 "검색해서 들어오는 문제" 하나를 제목으로 둔다(로드맵 24번).
// 코드 예시의 `호출; // 결과` 줄은 e2e/korean-utils.spec.ts 의 "코드 예시의 결과 주석" 테스트가 실제로 계산해 비교한다
// (결과 뒤 괄호 설명은 빼고, 여러 줄 예시는 대상이 아님). 함수 동작을 바꾸면 여기도 고친다.

export interface Guide {
  slug: string;
  /** 제목(h1·<title>) — 검색어에 가깝게 */
  title: string;
  /** 목록·meta description 에 쓰는 한 줄 */
  summary: string;
  /** 어떤 문제를 푸는지 — 문단 */
  problem: string[];
  /** 이 쪽에서 다루는 함수 이름 */
  functions: string[];
  code: string;
  /** 알아 둘 점 */
  notes: string[];
  /** 같은 동작의 React 입력 컴포넌트(Storybook 문서 path) */
  component?: { name: string; path: string; body: string };
}

export const guides: Guide[] = [
  {
    slug: 'phone-number',
    title: '전화번호 하이픈 자동으로 넣기',
    summary: '010·02·031·070·1588 을 구분해 입력하는 동안 하이픈을 넣고, +82 번호도 국내 번호로 바꿔요.',
    problem: [
      '전화번호는 지역마다 자릿수가 달라요. 서울은 02-123-4567·02-1234-5678, 휴대폰은 010-1234-5678, 대표번호는 1588-1234 처럼 하이픈이 하나뿐이에요.',
      '정규식 하나로 3-4-4 를 끊으면 02 번호와 대표번호가 틀어지고, 입력 중인 값(010-123-4)에서는 하이픈이 갑자기 사라졌다 생겼다 해요.',
    ],
    functions: ['formatPhoneNumber', 'phoneNumberDigits', 'phoneNumberMaxDigits'],
    code: `import { formatPhoneNumber, phoneNumberDigits } from '@bestow-ui/korean-utils';

formatPhoneNumber('01012345678'); // '010-1234-5678'
formatPhoneNumber('0212345678');  // '02-1234-5678'
formatPhoneNumber('15881234');    // '1588-1234'
formatPhoneNumber('0101234');     // '010-123-4' (입력 중인 값)

phoneNumberDigits('+82 10-1234-5678'); // '01012345678' (저장용)`,
    notes: [
      '숫자가 아닌 글자는 무시해요. 붙여 넣은 값에 하이픈·공백·괄호가 섞여 있어도 돼요.',
      '번호마다 최대 자릿수를 넘으면 잘라요(02 는 10자리, 대표번호는 8자리). 입력창 최대 길이는 phoneNumberMaxDigits 로 계산해요.',
      '저장은 숫자만, 화면에는 서식을 입혀 보여 주는 방식을 권해요.',
    ],
    component: {
      name: 'PhoneNumberInput',
      path: '/docs/korean-kit-phonenumberinput--docs',
      body: '입력 중에 하이픈 뒤에서 Backspace 를 눌러도 숫자가 지워지고, 중간을 고쳐도 커서가 끝으로 튀지 않아요.',
    },
  },
  {
    slug: 'business-number',
    title: '사업자등록번호 검증 공식',
    summary: '사업자등록번호 10자리를 가중치 1,3,7,1,3,7,1,3,5 공식으로 확인하고 123-45-67890 형태로 나눠요.',
    problem: [
      '사업자등록번호 마지막 자리는 앞 9자리로 계산한 검증 숫자예요. 공식으로 먼저 확인하면 국세청 조회 API 를 부르기 전에 오타를 걸러낼 수 있어요.',
      '공식은 이래요. 앞 9자리에 1,3,7,1,3,7,1,3,5 를 차례로 곱해 더하고, 9번째 숫자 × 5 를 10 으로 나눈 몫을 한 번 더 더해요. 10 에서 그 합의 일의 자리를 뺀 값(10 이면 0)이 마지막 숫자와 같으면 맞는 형식이에요.',
    ],
    functions: ['isValidBusinessNumber', 'formatBusinessNumber'],
    code: `import { formatBusinessNumber, isValidBusinessNumber } from '@bestow-ui/korean-utils';

formatBusinessNumber('1248100998');    // '124-81-00998'
isValidBusinessNumber('124-81-00998'); // true
isValidBusinessNumber('124-81-00999'); // false (마지막 숫자가 다름)`,
    notes: [
      '공식을 통과해도 실제로 등록된 번호라는 뜻은 아니에요. 휴업·폐업 여부는 국세청 사업자등록 상태조회 API 로 확인해요.',
      '0000000000 은 공식을 통과하지만 번호가 아니라서 false 로 돌려줘요.',
    ],
    component: {
      name: 'BusinessNumberInput',
      path: '/docs/korean-kit-businessnumberinput--docs',
      body: '10자리를 채우면 이 공식으로 확인하고, 틀리면 0.8초 뒤 스크린리더에도 알려요.',
    },
  },
  {
    slug: 'korean-amount',
    title: '금액을 한글 단위로 읽기 (12만 5,000원)',
    summary: '125000 을 “12만 5,000원”, 150000000 을 “1억 5,000만원” 처럼 만·억·조 단위로 바꿔요.',
    problem: [
      '1,500,000,000 같은 숫자는 자릿수를 세어야 읽혀요. 결제·송금 화면에서는 “15억원” 처럼 한글 단위를 함께 보여 줘야 금액을 잘못 넣는 실수를 막을 수 있어요.',
    ],
    functions: ['formatKoreanAmount'],
    code: `import { formatKoreanAmount } from '@bestow-ui/korean-utils';

formatKoreanAmount(125000);     // '12만 5,000원'
formatKoreanAmount(150000000);  // '1억 5,000만원'
formatKoreanAmount(1234567890); // '12억 3,456만 7,890원'
formatKoreanAmount(20000, '포인트'); // '2만포인트'`,
    notes: [
      '0 은 “0원”, 음수는 앞에 - 를 붙여요. 소수점 아래는 버려요.',
      '단위 글자는 두 번째 인자로 바꿔요(포인트·P·달러 등).',
    ],
    component: {
      name: 'AmountInput',
      path: '/docs/korean-kit-amountinput--docs',
      body: '입력하는 동안 쉼표를 넣고, showKoreanAmount 를 켜면 칸 아래에 한글 금액을 보여 줘요.',
    },
  },
  {
    slug: 'resident-number',
    title: '주민등록번호 생년월일·성별 읽기와 형식 확인',
    summary: '주민등록번호 앞 7자리로 생년월일·성별·외국인 여부를 읽고, 2020년 10월 이후 번호도 틀리지 않게 확인해요.',
    problem: [
      '주민등록번호 뒷자리 첫 숫자는 태어난 세기와 성별을 나타내요(1·2 는 1900년대, 3·4 는 2000년대, 5~8 은 외국인). 앞 7자리만 받는 화면(나이·성별 확인)에서도 이 규칙으로 읽을 수 있어요.',
      '인터넷에 많이 도는 “마지막 자리 검증 공식”은 2020년 10월부터 맞지 않아요. 그 뒤로 새로 받은 번호는 뒤 6자리가 임의 번호라서, 그 공식을 쓰면 올바른 번호도 틀렸다고 나와요.',
    ],
    functions: ['parseResidentNumber', 'isValidResidentNumber', 'formatResidentNumber'],
    code: `import { formatResidentNumber, isValidResidentNumber, parseResidentNumber } from '@bestow-ui/korean-utils';

parseResidentNumber('900101-1');
// { birthDate: '1990-01-01', sex: 'male', foreigner: false }
parseResidentNumber('900230-1'); // null (2월 30일은 없음)

isValidResidentNumber('900101-1234567'); // true
formatResidentNumber('9001011234567');   // '900101-1234567'`,
    notes: [
      'isValidResidentNumber 는 13자리, 실제로 있는 날짜, 뒷자리 첫 숫자만 봐요. 마지막 검증 숫자는 일부러 보지 않아요.',
      '주민등록번호는 법령에 근거가 있을 때만 수집할 수 있어요(개인정보 보호법 제24조의2). 실제 번호인지는 본인확인 기관 조회가 필요해요.',
      '이 쪽의 입력 칸은 브라우저 안에서만 계산하고 어디에도 보내지 않아요.',
    ],
    component: {
      name: 'ResidentNumberInput',
      path: '/docs/korean-kit-residentnumberinput--docs',
      body: '앞·뒤 칸을 나누고 뒷칸은 가려서 입력받아요. 앞 7자리만 받는 모드도 있어요.',
    },
  },
  {
    slug: 'masking',
    title: '이름·전화번호·주민번호·카드번호 마스킹',
    summary: '홍*동, 010-****-5678, 900101-1******, 1234-****-****-3456 처럼 화면에 보여 줄 개인정보를 가려요.',
    problem: [
      '주문 내역·회원 목록·영수증에는 개인정보를 일부만 보여 줘야 해요. 이름 길이(두 글자·네 글자)나 번호 형식에 따라 가릴 자리가 달라 매번 조건문이 늘어나요.',
    ],
    functions: ['maskName', 'maskPhoneNumber', 'maskResidentNumber', 'maskCardNumber', 'maskDigits'],
    code: `import { maskCardNumber, maskDigits, maskName, maskPhoneNumber, maskResidentNumber } from '@bestow-ui/korean-utils';

maskName('홍길동');   // '홍*동'
maskName('남궁민수'); // '남**수'
maskName('이훈');     // '이*'

maskPhoneNumber('01012345678');        // '010-****-5678'
maskResidentNumber('9001011234567');   // '900101-1******'
maskCardNumber('1234-5678-9012-3456'); // '1234-****-****-3456'

// 계좌번호처럼 형식이 제각각인 번호 — 뒤 4자리만 남기기
maskDigits('110-123-456789', { end: 4 }); // '***-***-**6789'`,
    notes: [
      '마스킹은 화면 표시용이에요. 저장·전송·로그에는 가린 값이 아니라 꼭 필요한 값만 남기세요. 가린 값을 보내도 원래 값은 이미 서버에 있어요.',
      '대표번호(1588-1234)는 개인 번호가 아니라 가리지 않고, 형식을 모르는 번호는 모두 가려요.',
    ],
  },
  {
    slug: 'card-number',
    title: '카드번호 하이픈과 Luhn 검증',
    summary: '카드번호를 4-4-4-4(아메리칸 익스프레스는 4-6-5)로 나누고, Luhn 공식으로 오타를 걸러요.',
    problem: [
      '카드번호 마지막 자리는 Luhn 공식으로 만든 검사 숫자예요. 결제사에 보내기 전에 확인하면 숫자 하나를 잘못 친 경우를 바로 알려 줄 수 있어요.',
      '아메리칸 익스프레스(34·37 로 시작)는 15자리 4-6-5 라서, 4자리씩 끊으면 틀려요.',
    ],
    functions: ['formatCardNumber', 'isValidCardNumber', 'cardNumberLength'],
    code: `import { cardNumberLength, formatCardNumber, isValidCardNumber } from '@bestow-ui/korean-utils';

formatCardNumber('4111111111111111'); // '4111-1111-1111-1111'
formatCardNumber('378282246310005');  // '3782-822463-10005'

isValidCardNumber('4111-1111-1111-1111'); // true
isValidCardNumber('4111-1111-1111-1112'); // false

cardNumberLength('3782'); // 15 (입력창 최대 자릿수)`,
    notes: [
      'Luhn 공식은 오타를 거르는 용도예요. 쓸 수 있는 카드인지는 결제사가 확인해요.',
      '실제 카드번호는 직접 받지 말고 PG 결제창을 쓰는 것을 권해요. 이 함수는 법인카드 등록처럼 번호를 받아야 하는 화면에 써요.',
    ],
    component: {
      name: 'CardNumberInput',
      path: '/docs/korean-kit-cardnumberinput--docs',
      body: '카드 종류에 맞게 하이픈을 넣고, 다 채우면 이 공식으로 확인해요.',
    },
  },
  {
    slug: 'corporate-number',
    title: '법인등록번호 검증 공식',
    summary: '법인등록번호 13자리를 가중치 1,2 공식으로 확인하고 6-7 자리로 나눠요.',
    problem: [
      '법인등록번호는 사업자등록번호와 다른 번호예요. 마지막 자리는 앞 12자리에 1,2 를 번갈아 곱해 더한 값으로 만든 검증 숫자예요. 10 에서 그 합의 일의 자리를 뺀 값(10 이면 0)이 마지막 숫자와 같으면 맞는 형식이에요.',
    ],
    functions: ['isValidCorporateNumber', 'formatCorporateNumber'],
    code: `import { formatCorporateNumber, isValidCorporateNumber } from '@bestow-ui/korean-utils';

formatCorporateNumber('1301110006246');   // '130111-0006246'
isValidCorporateNumber('130111-0006246'); // true
isValidCorporateNumber('130111-0006247'); // false`,
    notes: ['공식을 통과해도 실제로 등기된 법인이라는 뜻은 아니에요. 등기 여부는 인터넷등기소에서 확인해요.'],
    component: {
      name: 'CorporateNumberInput',
      path: '/docs/korean-kit-corporatenumberinput--docs',
      body: '입력하는 동안 하이픈을 넣고, 13자리를 채우면 이 공식으로 확인해요.',
    },
  },
  {
    slug: 'bank-account',
    title: '은행 코드 목록과 계좌번호 확인',
    summary: '국내 은행 26곳의 금융결제원 표준 코드(카카오뱅크 090, 토스뱅크 092 등)와 계좌번호 자릿수 확인.',
    problem: [
      '송금·환불 계좌를 받을 때는 은행 선택 목록과 은행 코드가 필요해요. 은행이 합치거나 이름을 바꾸면(대구은행 → iM뱅크) 목록도 고쳐야 해요.',
      '계좌번호는 은행·상품마다 자릿수와 하이픈 위치가 달라서, 하이픈을 강제로 넣으면 오히려 틀려요.',
    ],
    functions: ['KOREAN_BANKS', 'accountNumberDigits', 'isValidAccountNumber'],
    code: `import { accountNumberDigits, isValidAccountNumber, KOREAN_BANKS } from '@bestow-ui/korean-utils';

KOREAN_BANKS.find((bank) => bank.code === '090')?.name; // '카카오뱅크'

accountNumberDigits('110-123-456789');  // '110123456789' (저장용)
isValidAccountNumber('110-123-456789'); // true (10~16자리)
isValidAccountNumber('12345');          // false`,
    notes: [
      '은행마다 계좌번호 검증 공식이 공개돼 있지 않아 자릿수(10~16)만 확인해요. 실제 계좌·예금주는 예금주 조회 API 로 확인해요.',
      '증권사·외국계 은행 지점은 목록에 없어요. 필요하면 이 목록에 더해 쓰세요.',
    ],
    component: {
      name: 'AccountNumberInput',
      path: '/docs/korean-kit-accountnumberinput--docs',
      body: '은행 선택과 계좌번호 입력을 한 묶음으로 받아요.',
    },
  },
  {
    slug: 'korean-date',
    title: '한국어 날짜와 요일 표시',
    summary: 'Date 를 “2026년 10월 15일 목요일” 로 바꾸고, 일요일부터 시작하는 요일 글자를 써요.',
    problem: [
      'toLocaleDateString 은 브라우저·Node 버전에 따라 “2026. 10. 15.” 처럼 다르게 나올 수 있어요. 서버와 브라우저 결과가 다르면 Next.js 에서 hydration 오류가 나요.',
    ],
    functions: ['formatKoreanDate', 'KOREAN_WEEKDAYS'],
    code: `import { formatKoreanDate, KOREAN_WEEKDAYS } from '@bestow-ui/korean-utils';

formatKoreanDate(new Date(2026, 9, 15));        // '2026년 10월 15일 목요일'
formatKoreanDate(new Date(2026, 9, 15), false); // '2026년 10월 15일'

KOREAN_WEEKDAYS; // ['일', '월', '화', '수', '목', '금', '토']`,
    notes: [
      '날짜 버튼의 스크린리더 이름(aria-label)으로 쓰기 좋아요. “15” 만 읽히는 대신 날짜 전체가 들려요.',
      'Date 의 지역 시간 기준으로 읽어요. 서버에서 부를 때는 서버 시간대를 확인하세요.',
    ],
    component: {
      name: 'DatePicker',
      path: '/docs/korean-kit-datepicker--docs',
      body: '일요일부터 시작하는 달력과 YYYY-MM-DD 직접 입력을 함께 써요.',
    },
  },
  {
    slug: 'extra-address',
    title: '카카오 우편번호 참고항목 만들기',
    summary: '카카오(다음) 우편번호 서비스 결과로 도로명 주소 뒤의 “(역삼동, 래미안)” 참고항목을 만들어요.',
    problem: [
      '도로명 주소만 보면 어느 동네인지 알기 어려워서 법정동과 공동주택 이름을 괄호로 붙여요. 카카오 가이드의 예제 코드를 프로젝트마다 복사해 붙이게 되는 부분이에요.',
      '규칙은 이래요. 도로명 주소를 골랐을 때만, 법정동 이름이 동·로·가 로 끝나면 넣고(법정리는 빼요), 공동주택이면 건물 이름을 넣어요.',
    ],
    functions: ['composeExtraAddress'],
    code: `import { composeExtraAddress } from '@bestow-ui/korean-utils';

// new daum.Postcode({ oncomplete(data) { ... } }) 의 data
composeExtraAddress({ userSelectedType: 'R', bname: '역삼동', buildingName: '래미안', apartment: 'Y' });
// ' (역삼동, 래미안)'
composeExtraAddress({ userSelectedType: 'R', bname: '역삼동', buildingName: '강남빌딩', apartment: 'N' });
// ' (역삼동)'
composeExtraAddress({ userSelectedType: 'J', bname: '역삼동', buildingName: '래미안', apartment: 'Y' });
// '' (지번 주소)`,
    notes: ['앞에 공백이 붙어 있어 도로명 주소 뒤에 그대로 이어 붙이면 돼요.'],
    component: {
      name: 'AddressInput',
      path: '/docs/korean-kit-addressinput--docs',
      body: '우편번호 찾기 창, 참고항목, 상세 주소 칸을 한 번에 그려요. 우편번호 서비스는 공급자로 바꿔 넣을 수 있어요.',
    },
  },
];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
