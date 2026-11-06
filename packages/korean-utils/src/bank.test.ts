import { accountNumberDigits, isValidAccountNumber, KOREAN_BANKS } from './bank';

describe('KOREAN_BANKS', () => {
  it('코드는 3자리 숫자이고 코드·이름이 겹치지 않는다', () => {
    for (const bank of KOREAN_BANKS) expect(bank.code).toMatch(/^\d{3}$/);
    expect(new Set(KOREAN_BANKS.map((b) => b.code)).size).toBe(KOREAN_BANKS.length);
    expect(new Set(KOREAN_BANKS.map((b) => b.name)).size).toBe(KOREAN_BANKS.length);
  });

  it.each([
    ['004', 'KB국민은행'],
    ['088', '신한은행'],
    ['090', '카카오뱅크'],
    ['092', '토스뱅크'],
    ['031', 'iM뱅크(대구)'],
    ['071', '우체국'],
  ])('금융결제원 코드 %s 는 %s', (code, name) => {
    expect(KOREAN_BANKS.find((bank) => bank.code === code)?.name).toBe(name);
  });
});

describe('accountNumberDigits', () => {
  it.each([
    ['110-123-456789', '110123456789'],
    ['  3333 01 1234567 ', '3333011234567'],
    ['12345678901234567890', '1234567890123456'],
  ])('%s → %s', (input, expected) => {
    expect(accountNumberDigits(input)).toBe(expected);
  });
});

describe('isValidAccountNumber', () => {
  it.each([
    ['10자리', '1234567890', true],
    ['16자리', '1234567890123456', true],
    ['하이픈 포함', '110-123-456789', true],
    ['9자리', '123456789', false],
    ['17자리', '12345678901234567', false],
    ['모두 0', '0000000000', false],
  ])('%s', (_, input, expected) => {
    expect(isValidAccountNumber(input)).toBe(expected);
  });
});
