import { forwardRef, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { MinusIcon, PlusIcon } from '@bestow-ui/icons';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormattedInput } from '../../utils/useFormattedInput';
import { IconButton } from '../IconButton';
import { TextField, type TextFieldProps } from '../Input';
import * as styles from './NumberInput.css';

export interface NumberInputProps extends Omit<
  TextFieldProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'type'
  | 'inputMode'
  | 'startAdornment'
  | 'endAdornment'
  | 'min'
  | 'max'
  | 'step'
  | 'role'
> {
  /** 값 (제어 모드). 비어 있으면 null */
  value?: number | null;
  /** 처음 값 (비제어 모드) */
  defaultValue?: number | null;
  /** 값이 바뀔 때 호출된다. 비우면 null. 입력 중에는 범위를 벗어난 값도 오고, 포커스가 빠질 때 범위 안으로 맞춘 값이 온다 */
  onValueChange?: (value: number | null) => void;
  /** 최솟값. 0 이상이면 "-" 를 입력할 수 없다 */
  min?: number;
  /** 최댓값 */
  max?: number;
  /** ↑/↓·버튼으로 바꾸는 단위 (기본 1) */
  step?: number;
  /** PageUp/PageDown 으로 바꾸는 단위 (기본 step × 10) */
  largeStep?: number;
  /** 소수 자릿수 (기본: step 의 소수 자릿수 — step 0.1 이면 1). 0 이면 정수만 */
  precision?: number;
  /** 단위 (입력창 뒤에 표시, 스크린리더 값에도 붙는다 — 예: "개", "명") */
  unit?: string;
  /** 천 단위 쉼표 (기본 true) */
  thousandSeparator?: boolean;
  /** −/+ 버튼을 숨긴다 (키보드 ↑/↓ 는 그대로) */
  hideStepper?: boolean;
  // ── 아래는 TextFieldProps 에서 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    Omit 으로 물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 입력창 위에 표시할 레이블 */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 필수 입력 (레이블에 * 표시, required 속성) */
  required?: boolean;
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  placeholder?: string;
  /** form 제출 시 사용할 이름 (쉼표 없는 숫자로 제출된다) */
  name?: string;
}

const MAX_DIGITS = 15; // Number.MAX_SAFE_INTEGER 안쪽
const isMeaningful = (char: string) => /[\d.-]/.test(char);
const decimalsOf = (n: number) => (Number.isFinite(n) ? (String(n).split('.')[1]?.length ?? 0) : 0);
/** 입력 중인 원본 문자열 → 숫자. "", "-", "." 처럼 아직 숫자가 아니면 null */
const parse = (raw: string) => (/\d/.test(raw) ? Number(raw) : null);

/**
 * 숫자 입력 (수량·인원·나이 등). −/+ 버튼, ↑/↓·PageUp/PageDown 으로 바꾸고, 천 단위 쉼표를 넣는다.
 * WAI-ARIA spinbutton 패턴 — 스크린리더가 현재 값·최소·최대를 읽는다. 금액은 AmountInput(한글 금액 읽기)을 쓴다.
 */
export const NumberInput = /* @__PURE__ */ forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      largeStep = step * 10,
      precision: precisionProp,
      unit,
      thousandSeparator = true,
      hideStepper,
      size,
      disabled,
      readOnly,
      id,
      name,
      onKeyDown,
      onBlur,
      className,
      ...rest
    } = props;
    const isControlled = 'value' in props;
    const m = useMessages();
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const precision = Math.max(0, precisionProp ?? decimalsOf(step));
    const allowNegative = min === undefined || min < 0;

    const round = (n: number) => Number(n.toFixed(precision));
    const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, round(n)));
    const toRaw = (n: number | null | undefined) =>
      n === null || n === undefined || !Number.isFinite(n) ? '' : String(round(n));

    const sanitize = (input: string) => {
      const negative = allowNegative && input.trimStart().startsWith('-');
      const [intPart = '', ...fracParts] = input.replace(/[^\d.]/g, '').split('.');
      const int = intPart.replace(/^0+(?=\d)/, '').slice(0, MAX_DIGITS);
      const hasDot = precision > 0 && fracParts.length > 0;
      const frac = hasDot ? fracParts.join('').slice(0, precision) : '';
      return `${negative ? '-' : ''}${int}${hasDot ? `.${frac}` : ''}`;
    };
    const format = (raw: string) => {
      if (!thousandSeparator) return raw;
      const [, sign = '', int = '', rest = ''] = raw.match(/^(-?)(\d*)(.*)$/) ?? [];
      return `${sign}${int ? Number(int).toLocaleString('ko-KR') : ''}${rest}`;
    };

    // 마지막으로 바깥에 알린 값 — 같은 값을 거듭 알리지 않고, 제어 모드에서 바깥 값이 바뀐 것만 반영한다
    const lastEmitted = useRef<number | null>(parse(toRaw(isControlled ? value : defaultValue)));
    const emit = (next: number | null) => {
      if (next === lastEmitted.current) return;
      lastEmitted.current = next;
      onValueChange?.(next);
    };

    // 입력 중인 문자열("1.", "-")을 지키려고 원본은 항상 안에서 들고, 제어 모드면 바깥 값이 바뀔 때만 맞춘다
    const field = useFormattedInput({
      isControlled: false,
      value: undefined,
      defaultValue: toRaw(isControlled ? value : defaultValue),
      onValueChange: (raw) => emit(parse(raw)),
      sanitize,
      format,
      isMeaningful,
      inputRef,
    });
    const { setRaw } = field;
    useEffect(() => {
      if (!isControlled) return;
      const next = value ?? null;
      lastEmitted.current = next;
      if (parse(field.raw) !== next) setRaw(toRaw(next));
      // eslint-disable-next-line react-hooks/exhaustive-deps -- 바깥 값이 바뀔 때만 맞춘다
    }, [value]);

    const current = parse(field.raw);
    const setValue = (next: number) => {
      setRaw(toRaw(next));
      emit(next);
    };
    const stepBy = (delta: number) => {
      if (disabled || readOnly) return;
      // 비어 있으면 0(범위 밖이면 가까운 끝)에서 시작한다
      setValue(current === null ? clamp(0) : clamp(current + delta));
    };
    const canDecrement = !disabled && !readOnly && (current === null || min === undefined || current > min);
    const canIncrement = !disabled && !readOnly && (current === null || max === undefined || current < max);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const deltas: Record<string, number> = {
        ArrowUp: step,
        ArrowDown: -step,
        PageUp: largeStep,
        PageDown: -largeStep,
      };
      if (event.key in deltas) {
        event.preventDefault();
        stepBy(deltas[event.key]!);
      } else if (event.key === 'Home' && min !== undefined && !readOnly) {
        event.preventDefault();
        setValue(min);
      } else if (event.key === 'End' && max !== undefined && !readOnly) {
        event.preventDefault();
        setValue(max);
      } else {
        field.onKeyDown(event);
      }
    };

    const stepper = (direction: -1 | 1) => (
      <IconButton
        size="sm"
        aria-label={direction < 0 ? (m.decrement ?? '줄이기') : (m.increment ?? '늘리기')}
        aria-controls={inputId}
        // 키보드는 입력창의 ↑/↓ 로 하므로 Tab 순서에서 뺀다. 누를 때 입력창 포커스를 뺏지 않는다(모바일 키보드가 뜨지 않게)
        tabIndex={-1}
        disabled={direction < 0 ? !canDecrement : !canIncrement}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => stepBy(direction * step)}
        className={styles.stepper({ size })}
      >
        {direction < 0 ? <MinusIcon /> : <PlusIcon />}
      </IconButton>
    );

    return (
      <>
        <TextField
          ref={mergeRefs(ref, inputRef)}
          id={inputId}
          role="spinbutton"
          inputMode={allowNegative ? 'text' : precision > 0 ? 'decimal' : 'numeric'}
          autoComplete="off"
          aria-valuenow={current ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={current === null ? undefined : `${field.display}${unit ?? ''}`}
          value={field.display}
          onChange={field.onChange}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            // 입력이 끝나면 범위·자릿수에 맞춘다 (min 10 에 "1" 처럼 입력 중에만 허용하던 값)
            if (current !== null && clamp(current) !== current) setValue(clamp(current));
            else if (current === null && field.raw !== '') setRaw('');
            onBlur?.(event);
          }}
          size={size}
          disabled={disabled}
          readOnly={readOnly}
          startAdornment={hideStepper ? undefined : stepper(-1)}
          endAdornment={
            unit || !hideStepper ? (
              <span className={styles.end}>
                {unit && <span className={styles.unit}>{unit}</span>}
                {!hideStepper && stepper(1)}
              </span>
            ) : undefined
          }
          className={cx(styles.input, className)}
          {...rest}
        />
        {name && <input type="hidden" name={name} value={current === null ? '' : String(current)} />}
      </>
    );
  },
);
