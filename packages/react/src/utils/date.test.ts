import { addMonths, formatKoreanDate, getCalendarWeeks, parseISODate, toISODate } from './date';

describe('date utils', () => {
  it('YYYY-MM-DD 를 읽고 없는 날짜는 null', () => {
    expect(toISODate(parseISODate('2026-10-15')!)).toBe('2026-10-15');
    expect(parseISODate('2026-02-30')).toBeNull();
    expect(parseISODate('2026-13-01')).toBeNull();
    expect(parseISODate('20261015')).toBeNull();
    expect(parseISODate('')).toBeNull();
  });

  it('달을 옮길 때 없는 날은 그 달 마지막 날로', () => {
    expect(toISODate(addMonths(new Date(2026, 0, 31), 1))).toBe('2026-02-28');
    expect(toISODate(addMonths(new Date(2028, 0, 31), 1))).toBe('2028-02-29'); // 윤년
    expect(toISODate(addMonths(new Date(2026, 9, 15), -12))).toBe('2025-10-15');
  });

  it('달력은 일요일부터 시작한다', () => {
    const weeks = getCalendarWeeks(2026, 9); // 2026년 10월 1일은 목요일
    expect(weeks[0]![0]!.getDay()).toBe(0);
    expect(toISODate(weeks[0]![4]!)).toBe('2026-10-01');
  });

  it('한국어 날짜', () => {
    expect(formatKoreanDate(new Date(2026, 9, 15))).toBe('2026년 10월 15일 목요일');
    expect(formatKoreanDate(new Date(2026, 9, 15), false)).toBe('2026년 10월 15일');
  });
});
