import * as RadixSlider from '@radix-ui/react-slider';
import { forwardRef, useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Slider.css';

export interface SliderProps {
  /** 값 (제어 모드). 손잡이 하나면 `[50]`, 범위면 `[20, 80]` */
  value?: number[];
  /** 처음 값 (비제어 모드) */
  defaultValue?: number[];
  /** 값이 바뀌는 동안 계속 호출된다 */
  onValueChange?: (value: number[]) => void;
  /** 드래그·키 입력이 끝났을 때 한 번 호출된다 (서버 저장 등) */
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 범위 슬라이더에서 두 손잡이 사이 최소 간격(step 개수) */
  minStepsBetweenThumbs?: number;
  /** 위에 표시하는 레이블. 손잡이(slider)의 이름이 된다 */
  label?: ReactNode;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 아래에 표시하는 보조 설명 (aria-describedby 로 연결) */
  helperText?: ReactNode;
  /** 오른쪽 위에 현재 값을 보여 준다 */
  showValue?: boolean;
  /** 값 텍스트 형식. 화면 표시와 스크린리더(aria-valuetext)에 함께 쓴다 (예: v => `${v.toLocaleString()}원`) */
  formatValue?: (value: number) => string;
  /**
   * 범위 슬라이더에서 손잡이마다 덧붙일 이름 (기본 ["최소", "최대"]).
   * 스크린리더는 "가격 최소", "가격 최대" 처럼 레이블과 함께 읽는다
   */
  thumbLabels?: string[];
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** form 제출 시 사용할 이름 */
  name?: string;
  id?: string;
  className?: string;
}

/**
 * 범위 안에서 값을 고르는 슬라이더. 손잡이를 끌거나 키보드(←→↑↓, PageUp/Down, Home/End)로 조절한다.
 * Radix Slider 기반이라 손잡이마다 role="slider" 와 aria-valuemin/max/now 가 붙는다.
 */
export const Slider = /* @__PURE__ */ forwardRef<HTMLSpanElement, SliderProps>(function Slider(props, ref) {
  const {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    label,
    'aria-label': ariaLabel,
    helperText,
    showValue,
    formatValue = String,
    thumbLabels = ['최소', '최대'],
    size,
    id,
    className,
    disabled,
    ...rest
  } = props;
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = `${baseId}-label`;
  const helperId = `${baseId}-helper`;

  // 화면의 값 표시와 손잡이 개수를 알기 위해 비제어 모드에서도 현재 값을 따라간다
  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState<number[]>(defaultValue ?? [min]);
  // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
  const current = isControlled ? (value ?? [min]) : innerValue;
  const isRange = current.length > 1;

  const handleChange = (next: number[]) => {
    if (!isControlled) setInnerValue(next);
    onValueChange?.(next);
  };

  const valueText = current.map(formatValue).join(' – ');

  return (
    <div className={cx(styles.field, className)}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && (
            <span id={labelId} className={styles.label}>
              {label}
            </span>
          )}
          {/* 스크린리더는 손잡이의 aria-valuetext 로 읽으므로 화면용 텍스트는 숨긴다 */}
          {showValue && (
            <span className={styles.value} aria-hidden>
              {valueText}
            </span>
          )}
        </div>
      )}
      <RadixSlider.Root
        ref={ref}
        id={baseId}
        min={min}
        max={max}
        disabled={disabled}
        value={current}
        onValueChange={handleChange}
        className={styles.root({ size })}
        {...rest}
      >
        <RadixSlider.Track className={styles.track({ size })}>
          <RadixSlider.Range className={styles.range} />
        </RadixSlider.Track>
        {current.map((thumbValue, index) => {
          const thumbLabelId = `${baseId}-thumb-${index}`;
          return (
            <RadixSlider.Thumb
              key={index}
              className={styles.thumb({ size })}
              aria-labelledby={
                label ? (isRange ? `${labelId} ${thumbLabelId}` : labelId) : isRange ? thumbLabelId : undefined
              }
              aria-label={label ? undefined : isRange ? undefined : ariaLabel}
              aria-valuetext={formatValue(thumbValue)}
              aria-describedby={helperText ? helperId : undefined}
            />
          );
        })}
      </RadixSlider.Root>
      {/* 범위 손잡이 이름: label 이 없으면 aria-label 과 합쳐 읽히도록 앞에 붙인다 */}
      {isRange &&
        current.map((_, index) => (
          <span key={index} id={`${baseId}-thumb-${index}`} hidden>
            {label ? '' : ariaLabel ? `${ariaLabel} ` : ''}
            {thumbLabels[index] ?? `${index + 1}`}
          </span>
        ))}
      {helperText && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
});
