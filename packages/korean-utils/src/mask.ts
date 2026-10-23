// 화면에 보여 줄 때 일부를 가리는 함수. 저장·전송하는 값은 원래 값을 쓰고, 표시만 가린다.
import { formatPhoneNumber } from './koreanFormat';
import { formatResidentNumber } from './resident';

const MASK = '*';

/**
 * 이름 가운데를 가린다. 두 글자면 끝 글자를 가린다.
 * @example maskName('홍길동')   // '홍*동'
 * @example maskName('남궁민수') // '남**수'
 * @example maskName('이산')     // '이*'
 */
export function maskName(name: string): string {
  const chars = Array.from(name.trim());
  if (chars.length <= 1) return chars.join('');
  if (chars.length === 2) return `${chars[0]}${MASK}`;
  return `${chars[0]}${MASK.repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

/**
 * 숫자 중 앞 `start` 개·뒤 `end` 개만 남기고 가린다. 하이픈·공백 같은 구분 글자는 그대로 둔다(계좌번호 등 형식이 제각각인 번호).
 * @example maskDigits('110-123-456789', { end: 4 })        // '***-***-**6789'
 * @example maskDigits('1234 5678 9012 3456', { start: 4, end: 4 }) // '1234 **** **** 3456'
 */
export function maskDigits(input: string, { start = 0, end = 0 }: { start?: number; end?: number } = {}): string {
  const total = input.replace(/\D/g, '').length;
  let index = 0;
  return input.replace(/\d/g, (digit) => {
    const i = index++;
    return i < start || i >= total - end ? digit : MASK;
  });
}

/**
 * 전화번호 가운데 자리를 가린다(하이픈이 없으면 넣는다).
 * @example maskPhoneNumber('01012345678') // '010-****-5678'
 * @example maskPhoneNumber('02-123-4567') // '02-***-4567'
 */
export function maskPhoneNumber(input: string): string {
  const formatted = formatPhoneNumber(input);
  const parts = formatted.split('-');
  if (parts.length !== 3) return formatted;
  return `${parts[0]}-${MASK.repeat(parts[1]!.length)}-${parts[2]}`;
}

/**
 * 주민·외국인등록번호의 뒤 6자리를 가린다(생년월일과 성별 자리는 보인다). 하이픈이 없으면 넣는다.
 * @example maskResidentNumber('9001011234567') // '900101-1******'
 */
export function maskResidentNumber(input: string): string {
  return maskDigits(formatResidentNumber(input), { start: 7 });
}

/**
 * 카드번호의 앞 4자리·뒤 4자리만 남긴다.
 * @example maskCardNumber('1234-5678-9012-3456') // '1234-****-****-3456'
 */
export function maskCardNumber(formatted: string): string {
  return maskDigits(formatted, { start: 4, end: 4 });
}
