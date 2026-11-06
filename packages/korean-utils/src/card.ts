const onlyDigits = (input: string) => input.replace(/\D/g, '');

/** 아메리칸 익스프레스(34·37 로 시작) 는 15자리 4-6-5, 나머지는 16자리 4-4-4-4 */
const isAmex = (digits: string) => /^3[47]/.test(digits);

/**
 * 카드번호의 자릿수 — 아메리칸 익스프레스(34·37 로 시작)는 15, 나머지는 16. 입력 중에 최대 자릿수를 정할 때 쓴다.
 * @example cardNumberLength('3782') // 15
 */
export function cardNumberLength(input: string): 15 | 16 {
  return isAmex(onlyDigits(input)) ? 15 : 16;
}

/**
 * 카드번호에 하이픈을 넣는다. 16자리는 4-4-4-4, 아메리칸 익스프레스(15자리)는 4-6-5. 자릿수를 넘는 숫자는 버린다.
 * @example formatCardNumber('1234567890123456') // '1234-5678-9012-3456'
 * @example formatCardNumber('378282246310005')  // '3782-822463-10005'
 */
export function formatCardNumber(input: string): string {
  const d = onlyDigits(input).slice(0, cardNumberLength(input));
  const groups = isAmex(d) ? [4, 6, 5] : [4, 4, 4, 4];
  const parts: string[] = [];
  let at = 0;
  for (const size of groups) {
    if (at >= d.length) break;
    parts.push(d.slice(at, at + size));
    at += size;
  }
  return parts.join('-');
}

/**
 * 카드번호를 자릿수(15·16)와 검사 공식(Luhn)으로 확인한다 — 오타를 거르는 용도이고, 실제로 쓸 수 있는 카드인지는 결제사가 확인한다.
 * @example isValidCardNumber('4111-1111-1111-1111') // true
 */
export function isValidCardNumber(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== cardNumberLength(d) || /^0+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i += 1) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}
