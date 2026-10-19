import { addDays, addMonths, parseISODate, toISODate } from '../../utils/date';

export interface DateRange {
  /** 시작일 'YYYY-MM-DD' (없으면 '') */
  start: string;
  /** 종료일 'YYYY-MM-DD' (없으면 '') */
  end: string;
}

/** 빠른 선택 — 오늘에서 거슬러 올라간 기간. `days: 0` 은 오늘 하루 */
export interface DateRangePreset {
  label: string;
  days?: number;
  months?: number;
}

/** 조회 화면에서 흔한 빠른 선택(오늘·1주일·1개월·3개월). 그대로 넘기거나 골라 쓴다 */
export const dateRangePresets: DateRangePreset[] = [
  { label: '오늘', days: 0 },
  { label: '1주일', days: 7 },
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
];

/** 빠른 선택이 가리키는 기간 (오늘 'YYYY-MM-DD' 기준) */
export function presetRange(preset: DateRangePreset, today: string): DateRange {
  const end = parseISODate(today);
  if (!end) return { start: '', end: '' };
  const start = preset.months !== undefined ? addMonths(end, -preset.months) : addDays(end, -(preset.days ?? 0));
  return { start: toISODate(start), end: today };
}
