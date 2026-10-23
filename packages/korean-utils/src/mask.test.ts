import { maskCardNumber, maskDigits, maskName, maskPhoneNumber, maskResidentNumber } from './mask';

describe('maskName', () => {
  it.each([
    ['홍길동', '홍*동'],
    ['남궁민수', '남**수'],
    ['이산', '이*'],
    ['김', '김'],
    [' 홍길동 ', '홍*동'],
    ['', ''],
  ])('%s → %s', (input, expected) => expect(maskName(input)).toBe(expected));
});

describe('maskDigits', () => {
  it('구분 글자는 두고 숫자만 가린다', () => {
    expect(maskDigits('110-123-456789', { end: 4 })).toBe('***-***-**6789');
    expect(maskDigits('1234 5678 9012 3456', { start: 4, end: 4 })).toBe('1234 **** **** 3456');
    expect(maskDigits('12-34', {})).toBe('**-**');
  });

  it('남길 자리가 전체보다 많으면 가리지 않는다', () => {
    expect(maskDigits('123', { start: 2, end: 2 })).toBe('123');
  });
});

describe('maskPhoneNumber', () => {
  it.each([
    ['01012345678', '010-****-5678'],
    ['010-1234-5678', '010-****-5678'],
    ['021234567', '02-***-4567'],
    ['15881234', '1588-1234'],
  ])('%s → %s', (input, expected) => expect(maskPhoneNumber(input)).toBe(expected));
});

describe('maskResidentNumber · maskCardNumber', () => {
  it('주민번호는 생년월일·성별 자리만, 카드는 앞 4·뒤 4자리만', () => {
    expect(maskResidentNumber('9001011234567')).toBe('900101-1******');
    expect(maskResidentNumber('900101-1234567')).toBe('900101-1******');
    expect(maskCardNumber('1234-5678-9012-3456')).toBe('1234-****-****-3456');
  });
});
