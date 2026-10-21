import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@bestow-ui/icons';
import { KOREAN_WEEKDAYS } from '@bestow-ui/korean-utils';
import { cx } from '../../utils/cx';
import {
  addDays,
  addMonths,
  compareDays,
  getCalendarWeeks,
  isSameDay,
  isSameMonth,
  parseISODate,
  toISODate,
} from '../../utils/date';
import { useIsClient } from '../../utils/useIsClient';
import { IconButton } from '../IconButton';
import * as styles from './Calendar.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface CalendarProps {
  /** 선택된 날짜 'YYYY-MM-DD' (제어 모드) */
  value?: string;
  /** 처음 선택된 날짜 (비제어 모드) */
  defaultValue?: string;
  /** 날짜를 고를 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 고를 수 있는 가장 이른 날짜 'YYYY-MM-DD' */
  min?: string;
  /** 고를 수 있는 가장 늦은 날짜 'YYYY-MM-DD' */
  max?: string;
  /** 고를 수 없는 날짜 (예: 주말 제외) */
  isDateDisabled?: (date: Date) => boolean;
  /** 공휴일. 일요일처럼 빨갛게 표시하고 스크린리더에 "공휴일" 을 덧붙인다 */
  isHoliday?: (date: Date) => boolean;
  /**
   * 오늘 날짜 'YYYY-MM-DD'. 기본은 브라우저의 오늘 — 테스트·스크린샷에서 고정할 때 쓴다.
   * 서버 렌더링에서는 서버와 브라우저의 날짜(시간대)가 다를 수 있어, 없으면 hydration 이 끝난 뒤에 정한다
   * (선택된 날짜도 없으면 그 전까지 날짜 칸을 비워 둔다).
   */
  today?: string;
  /** 처음 그릴 때 날짜(선택된 날짜, 없으면 오늘)로 포커스를 옮긴다 — 팝업 안에서 쓸 때 */
  initialFocus?: boolean;
  /** 이전·다음 달 버튼 이름 */
  prevMonthLabel?: string;
  nextMonthLabel?: string;
  className?: string;
}

/**
 * 달력 (WAI-ARIA grid). 일요일부터 시작하고 일요일·공휴일은 빨강, 토요일은 파랑으로 표시한다.
 * 키보드: ←→ 하루, ↑↓ 일주일, Home/End 주의 처음·끝, PageUp/PageDown 한 달(Shift 와 함께 1년), Enter/Space 선택.
 */
export const Calendar = /* @__PURE__ */ forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    isDateDisabled,
    isHoliday,
    today: todayProp,
    initialFocus,
    prevMonthLabel: prevMonthLabelProp,
    nextMonthLabel: nextMonthLabelProp,
    className,
  } = props;
  const m = useMessages();
  const prevMonthLabel = prevMonthLabelProp ?? m.previousMonth ?? '이전 달';
  const nextMonthLabel = nextMonthLabelProp ?? m.nextMonth ?? '다음 달';
  const weekdaysShort = m.weekdaysShort ?? KOREAN_WEEKDAYS;
  const weekdaysLong = m.weekdaysLong ?? KOREAN_WEEKDAYS.map((name) => `${name}요일`);
  const headingId = useId();
  const gridRef = useRef<HTMLTableElement>(null);

  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const selected = parseISODate(isControlled ? value : innerValue);
  // 서버(UTC 등)와 브라우저(KST)의 "오늘" 이 달라 hydration 이 어긋나지 않게, today prop 이 없으면 브라우저에서만 정한다
  const isClient = useIsClient();
  const today = parseISODate(todayProp) ?? (isClient ? new Date() : null);
  const minDate = parseISODate(min);
  const maxDate = parseISODate(max);

  const clamp = (date: Date) => {
    if (minDate && compareDays(date, minDate) < 0) return minDate;
    if (maxDate && compareDays(date, maxDate) > 0) return maxDate;
    return date;
  };
  const isDisabled = (date: Date) =>
    (minDate !== null && compareDays(date, minDate) < 0) ||
    (maxDate !== null && compareDays(date, maxDate) > 0) ||
    !!isDateDisabled?.(date);

  // 키보드 포커스가 있는(또는 다음에 받을) 날짜. 보이는 달은 이 날짜를 따른다.
  // 아직 기준 날짜가 없으면(서버 렌더링 중, 선택값·today 없음) null — 정해지면 그 날짜의 달을 보여 준다
  const [focusedState, setFocused] = useState<Date | null>(null);
  const base = selected ?? today;
  const focused = focusedState ?? (base ? clamp(base) : null);
  const moveFocus = useRef(initialFocus ?? false);

  // 바깥에서 값이 바뀌면(제어 모드, 입력창에 직접 입력 등) 그 날짜의 달을 보여 준다
  const selectedIso = selected ? toISODate(selected) : '';
  useEffect(() => {
    const date = parseISODate(selectedIso);
    if (date) setFocused((prev) => (isSameDay(prev, date) ? prev : date));
  }, [selectedIso]);

  useEffect(() => {
    if (!moveFocus.current || !focused) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISODate(focused)}"]`)?.focus();
  }, [focused]);

  const focusDate = (date: Date) => {
    moveFocus.current = true;
    setFocused(clamp(date));
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    const iso = toISODate(date);
    if (!isControlled) setInnerValue(iso);
    onValueChange?.(iso);
    setFocused(date);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (!focused) return;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -focused.getDay()),
      End: () => addDays(focused, 6 - focused.getDay()),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      focusDate(move());
    }
  };

  const visible = focused;
  const weeks = visible
    ? getCalendarWeeks(visible.getFullYear(), visible.getMonth()).filter((week) =>
        week.some((date) => isSameMonth(date, visible)),
      )
    : [];
  const canPrev =
    !!visible && (!minDate || compareDays(new Date(visible.getFullYear(), visible.getMonth(), 0), minDate) >= 0);
  const canNext =
    !!visible && (!maxDate || compareDays(new Date(visible.getFullYear(), visible.getMonth() + 1, 1), maxDate) <= 0);

  return (
    <div ref={ref} className={cx(styles.root, className)}>
      <div className={styles.header}>
        <IconButton
          aria-label={prevMonthLabel}
          size="sm"
          disabled={!canPrev}
          onClick={() => visible && setFocused(clamp(addMonths(visible, -1)))}
        >
          <ChevronLeftIcon />
        </IconButton>
        {/* 달이 바뀌면 스크린리더가 새 달을 읽는다 */}
        <div id={headingId} className={styles.heading} aria-live="polite">
          {visible &&
            (m.monthTitle?.(visible.getFullYear(), visible.getMonth() + 1) ??
              `${visible.getFullYear()}년 ${visible.getMonth() + 1}월`)}
        </div>
        <IconButton
          aria-label={nextMonthLabel}
          size="sm"
          disabled={!canNext}
          onClick={() => visible && setFocused(clamp(addMonths(visible, 1)))}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={headingId} className={styles.grid} onKeyDown={handleKeyDown}>
        <thead>
          <tr>
            {weekdaysShort.map((name, index) => (
              <th key={index} scope="col" abbr={weekdaysLong[index]} className={styles.weekday} data-weekday={index}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toISODate(week[0]!)}>
              {week.map((date) => {
                const iso = toISODate(date);
                if (!visible || !isSameMonth(date, visible))
                  return <td key={iso} role="gridcell" className={styles.cell} />;
                const isSelected = isSameDay(date, selected);
                const isToday = isSameDay(date, today);
                const holiday = !!isHoliday?.(date);
                const disabled = isDisabled(date);
                // 이름은 화면에 보이는 숫자로 시작해야 한다 (WCAG 2.5.3 / KWCAG 2.2 "레이블과 네임") — "15일 …" 이면
                // 보이는 "15" 가 낱말로 들어 있지 않아 음성 명령("15 누르기")으로 찾을 수 없다
                const label = [
                  m.dayLabel?.(date, weekdaysLong[date.getDay()]!) ??
                    `${date.getDate()}, ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekdaysLong[date.getDay()]}`,
                  holiday && (m.holiday ?? '공휴일'),
                  isToday && (m.today ?? '오늘'),
                ]
                  .filter(Boolean)
                  .join(', ');
                return (
                  <td key={iso} role="gridcell" aria-selected={isSelected} className={styles.cell}>
                    <button
                      type="button"
                      className={styles.day}
                      data-date={iso}
                      data-weekday={date.getDay()}
                      data-holiday={holiday || undefined}
                      data-selected={isSelected || undefined}
                      tabIndex={isSameDay(date, focused) ? 0 : -1}
                      aria-label={label}
                      aria-current={isToday ? 'date' : undefined}
                      aria-disabled={disabled || undefined}
                      onClick={() => select(date)}
                      onFocus={() => !isSameDay(date, focused) && setFocused(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
