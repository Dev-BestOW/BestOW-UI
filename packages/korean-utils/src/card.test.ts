import { cardNumberLength, formatCardNumber, isValidCardNumber } from './card';

describe('formatCardNumber', () => {
  it.each([
    ['', ''],
    ['1234', '1234'],
    ['12345', '1234-5'],
    ['1234567890123456', '1234-5678-9012-3456'],
    ['1234 5678 9012 3456 789', '1234-5678-9012-3456'],
    ['3782', '3782'],
    ['37828224', '3782-8224'],
    ['378282246310005', '3782-822463-10005'],
    ['3782822463100059', '3782-822463-10005'],
  ])('%s → %s', (input, expected) => {
    expect(formatCardNumber(input)).toBe(expected);
  });
});

describe('cardNumberLength', () => {
  it.each([
    ['34', 15],
    ['37', 15],
    ['35', 16],
    ['4', 16],
    ['', 16],
  ])('%s → %s', (input, expected) => {
    expect(cardNumberLength(input)).toBe(expected);
  });
});

describe('isValidCardNumber', () => {
  it.each([
    '4111111111111111', // Visa 시험 번호
    '4111-1111-1111-1111',
    '5555555555554444', // Mastercard 시험 번호
    '378282246310005', // 아메리칸 익스프레스 시험 번호
  ])('Luhn 통과: %s', (input) => {
    expect(isValidCardNumber(input)).toBe(true);
  });

  it.each([
    ['마지막 숫자 오타', '4111111111111112'],
    ['자릿수 부족', '411111111111111'],
    ['아멕스가 16자리', '3782822463100055'],
    ['모두 0', '0000000000000000'],
  ])('실패: %s', (_, input) => {
    expect(isValidCardNumber(input)).toBe(false);
  });
});
