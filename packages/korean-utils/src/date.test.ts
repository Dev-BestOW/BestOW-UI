import { formatKoreanDate, KOREAN_WEEKDAYS } from './date';

describe('formatKoreanDate', () => {
  it('요일까지 한국어로 쓴다', () => {
    expect(formatKoreanDate(new Date(2026, 9, 15))).toBe('2026년 10월 15일 목요일');
    expect(formatKoreanDate(new Date(2026, 0, 4))).toBe('2026년 1월 4일 일요일');
  });

  it('요일을 뺄 수 있다', () => {
    expect(formatKoreanDate(new Date(2026, 9, 15), false)).toBe('2026년 10월 15일');
  });

  it('요일은 일요일부터', () => {
    expect(KOREAN_WEEKDAYS).toEqual(['일', '월', '화', '수', '목', '금', '토']);
  });
});
