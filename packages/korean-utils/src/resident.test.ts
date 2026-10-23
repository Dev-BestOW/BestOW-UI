import { formatResidentNumber, isValidResidentNumber, parseResidentNumber } from './resident';

describe('formatResidentNumber', () => {
  it.each([
    ['900101', '900101'],
    ['9001011', '900101-1'],
    ['9001011234567', '900101-1234567'],
    ['900101-1234567-99', '900101-1234567'],
    ['', ''],
  ])('%s → %s', (input, expected) => expect(formatResidentNumber(input)).toBe(expected));
});

describe('parseResidentNumber', () => {
  it.each([
    ['9001011', { birthDate: '1990-01-01', sex: 'male', foreigner: false }],
    ['0502284', { birthDate: '2005-02-28', sex: 'female', foreigner: false }],
    ['8512315', { birthDate: '1985-12-31', sex: 'male', foreigner: true }],
    ['1003048', { birthDate: '2010-03-04', sex: 'female', foreigner: true }],
    ['9912319', { birthDate: '1899-12-31', sex: 'male', foreigner: false }],
    ['000229-3', { birthDate: '2000-02-29', sex: 'male', foreigner: false }],
  ])('%s', (input, expected) => expect(parseResidentNumber(input)).toEqual(expected));

  it('없는 날짜·자릿수 부족이면 null', () => {
    expect(parseResidentNumber('9002301')).toBeNull(); // 2월 30일
    expect(parseResidentNumber('0102293')).toBeNull(); // 2001년은 윤년이 아님
    expect(parseResidentNumber('9013011')).toBeNull(); // 13월
    expect(parseResidentNumber('900101')).toBeNull();
  });
});

describe('isValidResidentNumber', () => {
  it('13자리 + 생년월일·뒷자리 첫 숫자가 맞으면 true — 마지막 검증 숫자는 보지 않는다(2020년 10월 이후 임의 번호)', () => {
    expect(isValidResidentNumber('900101-1234567')).toBe(true);
    expect(isValidResidentNumber('9001011234560')).toBe(true);
  });

  it('자릿수가 다르거나 날짜가 없으면 false', () => {
    expect(isValidResidentNumber('900101-123456')).toBe(false);
    expect(isValidResidentNumber('900230-1234567')).toBe(false);
  });
});
