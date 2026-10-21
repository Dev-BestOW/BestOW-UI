import {
  formatBusinessNumber,
  formatKoreanAmount,
  formatPhoneNumber,
  isValidBusinessNumber,
  phoneNumberMaxDigits,
} from './koreanFormat';

describe('formatPhoneNumber', () => {
  it.each([
    ['010', '010'],
    ['0101', '010-1'],
    ['0101234', '010-123-4'],
    ['01012345678', '010-1234-5678'],
    ['010123456789', '010-1234-5678'], // 11자리를 넘으면 자른다
    ['0311234567', '031-123-4567'],
    ['07012345678', '070-1234-5678'],
    ['02', '02'],
    ['02123', '02-123'],
    ['021234567', '02-123-4567'],
    ['0212345678', '02-1234-5678'],
    ['15881234', '1588-1234'],
    ['158812345', '1588-1234'], // 대표번호는 8자리
    ['010-1234-5678', '010-1234-5678'],
  ])('%s → %s', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });
});

describe('phoneNumberMaxDigits', () => {
  it.each([
    ['02', 10],
    ['1588', 8],
    ['1644', 8],
    ['1800', 8],
    ['010', 11],
    ['031', 11],
    ['070', 11],
  ])('%s → %d', (digits, max) => {
    expect(phoneNumberMaxDigits(digits)).toBe(max);
  });
});

describe('사업자등록번호', () => {
  it('하이픈을 3-2-5 로 넣는다', () => {
    expect(formatBusinessNumber('12')).toBe('12');
    expect(formatBusinessNumber('12345')).toBe('123-45');
    expect(formatBusinessNumber('1248100998')).toBe('124-81-00998');
  });

  it('검증 공식으로 확인한다', () => {
    expect(isValidBusinessNumber('124-81-00998')).toBe(true);
    expect(isValidBusinessNumber('1248100999')).toBe(false);
    expect(isValidBusinessNumber('1234567890')).toBe(false);
    expect(isValidBusinessNumber('12481')).toBe(false);
  });
});

describe('formatKoreanAmount', () => {
  it.each([
    [0, '0원'],
    [5000, '5,000원'],
    [10000, '1만원'],
    [125000, '12만 5,000원'],
    [150000000, '1억 5,000만원'],
    [1234567890123, '1조 2,345억 6,789만 123원'],
    [-30000, '-3만원'],
  ])('%d → %s', (amount, expected) => {
    expect(formatKoreanAmount(amount)).toBe(expected);
  });

  it('단위를 바꿀 수 있다', () => {
    expect(formatKoreanAmount(20000, '포인트')).toBe('2만포인트');
  });
});
