// 한국 서비스에서 자주 쓰는 서식·검증 함수. 컴포넌트와 함께 공개 API 로 export 한다.

const onlyDigits = (input: string) => input.replace(/\D/g, '');

/** 전화번호 최대 자릿수: 02 는 10, 15xx·16xx·18xx 대표번호는 8, 나머지(010, 031, 070 …)는 11 */
export function phoneNumberMaxDigits(digits: string): number {
  if (digits.startsWith('02')) return 10;
  if (/^1[568]/.test(digits)) return 8;
  return 11;
}

/**
 * 숫자만 있는 전화번호에 하이픈을 넣는다. 입력 중인 값도 자연스럽게 나눈다.
 * @example formatPhoneNumber('01012345678') // '010-1234-5678'
 * @example formatPhoneNumber('021234567')   // '02-123-4567'
 * @example formatPhoneNumber('15881234')    // '1588-1234'
 */
export function formatPhoneNumber(input: string): string {
  const d = onlyDigits(input).slice(0, phoneNumberMaxDigits(onlyDigits(input)));
  if (d.startsWith('02')) {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
  }
  if (/^1[568]/.test(d)) {
    return d.length <= 4 ? d : `${d.slice(0, 4)}-${d.slice(4)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/**
 * 사업자등록번호(10자리)에 하이픈을 넣는다.
 * @example formatBusinessNumber('1234567890') // '123-45-67890'
 */
export function formatBusinessNumber(input: string): string {
  const d = onlyDigits(input).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

/**
 * 사업자등록번호 검증 공식(가중치 1,3,7,1,3,7,1,3,5)으로 확인한다. 실제로 등록된 번호인지는 국세청 조회가 필요하다.
 * @example isValidBusinessNumber('124-81-00998') // true
 */
export function isValidBusinessNumber(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  const digits = [...d].map(Number);
  let sum = weights.reduce((acc, w, i) => acc + w * digits[i]!, 0);
  sum += Math.floor((digits[8]! * 5) / 10);
  return (10 - (sum % 10)) % 10 === digits[9];
}

/**
 * 금액을 만·억·조 단위로 읽기 쉽게 쓴다.
 * @example formatKoreanAmount(125000)     // '12만 5,000원'
 * @example formatKoreanAmount(150000000)  // '1억 5,000만원'
 * @example formatKoreanAmount(0)          // '0원'
 */
export function formatKoreanAmount(amount: number, unit = '원'): string {
  const n = Math.floor(Math.abs(amount));
  if (n === 0) return `0${unit}`;
  const units = [
    { value: 1e12, label: '조' },
    { value: 1e8, label: '억' },
    { value: 1e4, label: '만' },
    { value: 1, label: '' },
  ];
  let rest = n;
  const parts: string[] = [];
  for (const u of units) {
    const q = Math.floor(rest / u.value);
    rest %= u.value;
    if (q > 0) parts.push(`${q.toLocaleString('ko-KR')}${u.label}`);
  }
  return `${amount < 0 ? '-' : ''}${parts.join(' ')}${unit}`;
}
