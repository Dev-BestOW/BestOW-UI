import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { CalendarIcon } from '@bestow-ui/icons';
import { compareDays, parseISODate } from '../../utils/date';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { Calendar } from '../Calendar';
import { IconButton } from '../IconButton';
import { TextField } from '../Input';
import { Popover } from '../Popover';

export interface DatePickerProps {
  /** 날짜 'YYYY-MM-DD' (제어 모드). 비어 있으면 '' */
  value?: string;
  /** 처음 날짜 (비제어 모드) */
  defaultValue?: string;
  /** 올바른 날짜를 다 입력하거나 달력에서 고르면 'YYYY-MM-DD', 지우거나 잘못되면 '' 로 호출된다 */
  onValueChange?: (value: string) => void;
  /** 고를 수 있는 가장 이른·늦은 날짜 'YYYY-MM-DD' */
  min?: string;
  max?: string;
  /** 고를 수 없는 날짜 */
  isDateDisabled?: (date: Date) => boolean;
  /** 공휴일 (달력에 빨갛게 표시) */
  isHoliday?: (date: Date) => boolean;
  /** 오늘 날짜 'YYYY-MM-DD' (테스트·스크린샷 고정용) */
  today?: string;
  label?: ReactNode;
  /** 아래 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  /** 달력 버튼·달력 창 이름 */
  calendarLabel?: string;
  /** 자동 검증 문구 */
  invalidText?: string;
  unavailableText?: string;
  incompleteText?: string;
  /** form 제출 시 이름 ('YYYY-MM-DD' 가 제출된다) */
  name?: string;
  id?: string;
  className?: string;
}

const sanitize = (input: string) => input.replace(/\D/g, '').slice(0, 8);
const format = (digits: string) =>
  digits.length <= 4
    ? digits
    : digits.length <= 6
      ? `${digits.slice(0, 4)}-${digits.slice(4)}`
      : `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
const isDigit = (char: string) => /\d/.test(char);

/**
 * 날짜 입력. `YYYY-MM-DD` 로 직접 입력하거나(숫자만 쳐도 하이픈이 들어간다) 달력 버튼으로 고른다.
 * 달력은 일요일부터 시작하고, 열면 선택된 날짜(없으면 오늘)로 포커스가 간다. 값은 시간대 문제가 없는 'YYYY-MM-DD' 문자열이다.
 */
export const DatePicker = /* @__PURE__ */ forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      isDateDisabled,
      isHoliday,
      today,
      label = '날짜',
      helperText,
      error,
      required,
      disabled,
      fullWidth,
      placeholder = 'YYYY-MM-DD',
      calendarLabel = '달력 열기',
      invalidText = '올바른 날짜가 아니에요.',
      unavailableText = '고를 수 없는 날짜예요.',
      incompleteText = '날짜를 YYYY-MM-DD 형식으로 입력해 주세요.',
      name,
      id,
      className,
    } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [touched, setTouched] = useState(false);
    const isControlled = 'value' in props;
    const lastEmitted = useRef(isControlled ? (value ?? '') : (defaultValue ?? ''));

    const minDate = parseISODate(min);
    const maxDate = parseISODate(max);
    const toIso = (digits: string) =>
      digits.length === 8 ? `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}` : '';
    const isUnavailable = (date: Date) =>
      (minDate !== null && compareDays(date, minDate) < 0) ||
      (maxDate !== null && compareDays(date, maxDate) > 0) ||
      !!isDateDisabled?.(date);

    const emit = (iso: string) => {
      if (iso === lastEmitted.current) return;
      lastEmitted.current = iso;
      onValueChange?.(iso);
    };

    // 입력 중인 글자는 항상 안에서 들고 있고, 확정된 날짜만 바깥으로 알린다
    const field = useFormattedInput({
      isControlled: false,
      value: undefined,
      defaultValue: (isControlled ? value : defaultValue)?.replace(/\D/g, ''),
      onValueChange: (digits) => {
        const date = parseISODate(toIso(digits));
        emit(date && !isUnavailable(date) ? toIso(digits) : '');
      },
      sanitize,
      format,
      isMeaningful: isDigit,
      inputRef,
    });

    // 제어 모드: 바깥 값이 바뀌면 입력창을 맞춘다. 단 바깥이 '' 가 된 것이 우리가 알린 '' (입력 중이거나 잘못된 날짜) 때문이면
    // 입력창을 비우지 않는다 — 치던 글자를 지우면 오류 메시지 대신 빈칸이 보인다.
    const textIso = toIso(field.raw);
    const { setRaw } = field;
    useEffect(() => {
      if (!isControlled) return;
      const next = value ?? '';
      lastEmitted.current = next;
      if (next === textIso) return;
      const textDate = parseISODate(textIso);
      const textIsValid = textDate !== null && !isUnavailable(textDate);
      if (next === '' && !textIsValid) return;
      setRaw(next.replace(/\D/g, ''));
      // eslint-disable-next-line react-hooks/exhaustive-deps -- 바깥 값이 바뀔 때만 맞춘다
    }, [value]);

    const date = parseISODate(textIso);
    const complete = field.raw.length === 8;
    const autoError = complete
      ? !date
        ? invalidText
        : isUnavailable(date)
          ? unavailableText
          : null
      : touched && field.raw.length > 0
        ? incompleteText
        : null;
    const showAuto = autoError !== null && error === undefined;
    const selectedIso = date && !isUnavailable(date) ? textIso : '';

    return (
      <>
        <TextField
          ref={mergeRefs(ref, inputRef)}
          id={id}
          label={label}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="off"
          value={field.display}
          onChange={field.onChange}
          onKeyDown={field.onKeyDown}
          onBlur={() => setTouched(true)}
          error={error ?? autoError !== null}
          helperText={showAuto ? autoError : helperText}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          rootClassName={className}
          endAdornment={
            <Popover
              open={open}
              onOpenChange={setOpen}
              modal
              align="end"
              aria-label={calendarLabel.replace(/ 열기$/, '')}
              // 달력이 선택된 날짜(없으면 오늘)로 직접 포커스를 옮긴다
              onOpenAutoFocus={(event) => event.preventDefault()}
              content={
                <Calendar
                  value={selectedIso}
                  onValueChange={(iso) => {
                    setRaw(iso.replace(/\D/g, ''));
                    emit(iso);
                    setOpen(false);
                  }}
                  min={min}
                  max={max}
                  isDateDisabled={isDateDisabled}
                  isHoliday={isHoliday}
                  today={today}
                  initialFocus
                />
              }
            >
              <IconButton aria-label={calendarLabel} size="sm" disabled={disabled}>
                <CalendarIcon />
              </IconButton>
            </Popover>
          }
        />
        {name && <input type="hidden" name={name} value={selectedIso} />}
      </>
    );
  },
);
