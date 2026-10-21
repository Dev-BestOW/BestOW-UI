// 한국어 날짜 표기. Date 를 그대로 받으므로 시간대는 그 Date 의 로컬 시간 기준이다.

/** 일요일부터 시작하는 한국어 요일 한 글자 */
export const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 한국어 날짜. 스크린리더용 날짜 이름 등에 쓴다.
 * @example formatKoreanDate(new Date(2026, 9, 15)) // '2026년 10월 15일 목요일'
 * @example formatKoreanDate(new Date(2026, 9, 15), false) // '2026년 10월 15일'
 */
export function formatKoreanDate(date: Date, withWeekday = true): string {
  const base = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  return withWeekday ? `${base} ${KOREAN_WEEKDAYS[date.getDay()]}요일` : base;
}
