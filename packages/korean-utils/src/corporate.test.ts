import { formatCorporateNumber, isValidCorporateNumber } from './corporate';

describe('formatCorporateNumber', () => {
  it.each([
    ['', ''],
    ['130111', '130111'],
    ['1301110', '130111-0'],
    ['1301110006246', '130111-0006246'],
    ['130111-0006246-9', '130111-0006246'],
  ])('%s → %s', (input, expected) => {
    expect(formatCorporateNumber(input)).toBe(expected);
  });
});

describe('isValidCorporateNumber', () => {
  it('검증 공식을 통과한다 (공시된 법인등록번호)', () => {
    expect(isValidCorporateNumber('130111-0006246')).toBe(true);
    expect(isValidCorporateNumber('1301110006246')).toBe(true);
  });

  it.each([
    ['마지막 숫자 오타', '1301110006247'],
    ['앞자리 오타', '1301120006246'],
    ['자릿수 부족', '130111000624'],
    ['모두 0', '0000000000000'],
  ])('실패: %s', (_, input) => {
    expect(isValidCorporateNumber(input)).toBe(false);
  });
});
