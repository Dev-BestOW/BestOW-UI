import { forwardRef, useId, useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import * as fieldStyles from '../Input/Input.css';
import { cx } from '../../utils/cx';
import { toISODate } from '../../utils/date';
import { useIsClient } from '../../utils/useIsClient';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { presetRange, type DateRange, type DateRangePreset } from './presets';
import * as styles from './DateRangePicker.css';

export interface DateRangePickerProps {
  /** 기간 (제어 모드) */
  value?: DateRange;
  /** 처음 기간 (비제어 모드) */
  defaultValue?: DateRange;
  /** 시작일·종료일이 바뀔 때. 비었거나 고를 수 없는 날짜면 '' */
  onValueChange?: (range: DateRange) => void;
  /** 묶음 이름 (legend) — 예: "조회 기간" */
  label?: ReactNode;
  /** 시작일 칸 레이블 (기본 "시작일") */
  startLabel?: string;
  /** 종료일 칸 레이블 (기본 "종료일") */
  endLabel?: string;
  /** 빠른 선택 버튼 — 오늘에서 거슬러 올라간 기간 (`dateRangePresets` 를 그대로 넘겨도 된다) */
  presets?: DateRangePreset[];
  /** 고를 수 있는 가장 이른 날 */
  min?: string;
  /** 고를 수 있는 가장 늦은 날 */
  max?: string;
  isDateDisabled?: (date: Date) => boolean;
  isHoliday?: (date: Date) => boolean;
  /** "오늘" 을 고정한다 (빠른 선택의 기준, 달력의 오늘 표시 — 테스트·시각 회귀용) */
  today?: string;
  /** 묶음 아래 도움말 */
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** form 제출용 이름 — 시작일·종료일 */
  startName?: string;
  endName?: string;
  /** fieldset 의 id (시작·종료 칸은 `${id}-start`, `${id}-end`) — ErrorSummary 링크가 가리키면 시작일로 간다 */
  id?: string;
  className?: string;
}

/**
 * 기간 선택 (조회 기간, 예약 기간). 시작일·종료일 DatePicker 두 개를 묶고, 시작일은 종료일보다 늦을 수 없게 서로 제한한다.
 * 빠른 선택(오늘·1주일·1개월…)은 현재 기간과 같으면 눌린 상태(aria-pressed)로 보인다.
 */
export const DateRangePicker = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, DateRangePickerProps>(
  function DateRangePicker(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      label,
      startLabel: startLabelProp,
      endLabel: endLabelProp,
      presets,
      min,
      max,
      isDateDisabled,
      isHoliday,
      today,
      helperText,
      error,
      required,
      disabled,
      startName,
      endName,
      id,
      className,
    } = props;
    const m = useMessages();
    const generatedId = useId();
    const baseId = id ?? generatedId;
    const helperId = helperText ? `${baseId}-helper` : undefined;
    const isClient = useIsClient();
    const isControlled = 'value' in props;
    const [inner, setInner] = useState<DateRange>(defaultValue ?? { start: '', end: '' });
    const range = isControlled ? (value ?? { start: '', end: '' }) : inner;

    const update = (next: DateRange) => {
      if (next.start === range.start && next.end === range.end) return;
      if (!isControlled) setInner(next);
      onValueChange?.(next);
    };
    const todayIso = () => today ?? toISODate(new Date());

    const startLabel = startLabelProp ?? m.dateRangeStart ?? '시작일';
    const endLabel = endLabelProp ?? m.dateRangeEnd ?? '종료일';
    const common = { isDateDisabled, isHoliday, today, disabled, required, fullWidth: true } as const;

    return (
      <fieldset
        ref={ref}
        id={id}
        className={cx(styles.fieldset, className)}
        aria-describedby={helperId}
        data-invalid={error || undefined}
      >
        {label && (
          <legend className={styles.legend}>
            {label}
            {required && (
              <span className={fieldStyles.requiredMark} aria-hidden>
                *
              </span>
            )}
          </legend>
        )}
        <div className={styles.fields}>
          <div className={styles.field}>
            <DatePicker
              {...common}
              id={`${baseId}-start`}
              label={startLabel}
              value={range.start}
              onValueChange={(start) => update({ ...range, start })}
              min={min}
              max={range.end || max}
              name={startName}
              error={error || undefined}
            />
          </div>
          <span className={styles.separator} aria-hidden>
            ~
          </span>
          <div className={styles.field}>
            <DatePicker
              {...common}
              id={`${baseId}-end`}
              label={endLabel}
              value={range.end}
              onValueChange={(end) => update({ ...range, end })}
              min={range.start || min}
              max={max}
              name={endName}
              error={error || undefined}
            />
          </div>
        </div>
        {presets && presets.length > 0 && (
          <div role="group" aria-label={m.dateRangePresets ?? '빠른 선택'} className={styles.presets}>
            {presets.map((preset) => {
              // "오늘" 이 서버와 브라우저에서 다를 수 있어 눌린 상태는 hydration 뒤에 정한다
              const target = isClient ? presetRange(preset, todayIso()) : null;
              const pressed = !!target && target.start === range.start && target.end === range.end;
              return (
                <Button
                  key={preset.label}
                  type="button"
                  size="sm"
                  variant={pressed ? 'soft' : 'outline'}
                  color={pressed ? 'primary' : 'neutral'}
                  aria-pressed={pressed}
                  disabled={disabled}
                  onClick={() => update(presetRange(preset, todayIso()))}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
        )}
        {helperText && (
          <p id={helperId} className={fieldStyles.helperText({ error })}>
            {helperText}
          </p>
        )}
      </fieldset>
    );
  },
);
