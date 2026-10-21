// 날짜 계산 유틸. 값은 시간대 문제가 없도록 'YYYY-MM-DD' 문자열로 다루고, 계산할 때만 로컬 Date 로 바꾼다.

const pad = (n: number) => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD' (로컬 기준) */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 'YYYY-MM-DD' → Date (로컬 자정). 형식이 틀리거나 없는 날짜(2월 30일 등)면 null */
export function parseISODate(value: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** 달을 옮긴다. 옮긴 달에 같은 날이 없으면 그 달의 마지막 날 (1월 31일 + 1달 → 2월 28/29일) */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && toISODate(a) === toISODate(b);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** 날짜만 비교 (-1, 0, 1) */
export function compareDays(a: Date, b: Date): number {
  const x = toISODate(a);
  const y = toISODate(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

/** 일요일부터 시작하는 달력의 주 목록 (앞뒤 달 날짜 포함, 항상 6주) */
export function getCalendarWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)));
}
