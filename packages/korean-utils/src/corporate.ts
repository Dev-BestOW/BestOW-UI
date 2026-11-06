const onlyDigits = (input: string) => input.replace(/\D/g, '');

/**
 * 법인등록번호(13자리)에 하이픈을 넣는다 — 앞 6자리(등기관서·법인 종류) - 뒤 7자리.
 * @example formatCorporateNumber('1301110006246') // '130111-0006246'
 */
export function formatCorporateNumber(input: string): string {
  const d = onlyDigits(input).slice(0, 13);
  return d.length <= 6 ? d : `${d.slice(0, 6)}-${d.slice(6)}`;
}

/**
 * 법인등록번호 검증 공식(앞 12자리에 가중치 1,2 를 번갈아 곱한 합)으로 마지막 숫자를 확인한다.
 * 오타를 거르는 용도이고, 실제로 등기된 법인인지는 등기소 조회가 필요하다.
 * @example isValidCorporateNumber('130111-0006246') // true
 */
export function isValidCorporateNumber(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== 13 || /^0+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i += 1) sum += Number(d[i]) * (i % 2 === 0 ? 1 : 2);
  return (10 - (sum % 10)) % 10 === Number(d[12]);
}
