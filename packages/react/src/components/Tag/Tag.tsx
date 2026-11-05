import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { CheckIcon, XIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { warnOnce } from '../../utils/warnOnce';
import { useMessages } from '../../i18n/LocaleProvider';
import * as styles from './Tag.css';

/** TagGroup 이 안의 Tag 에 주는 것 — 삭제 직전에 불러 포커스 옮길 자리와 알림 글자를 맡긴다 */
export interface TagGroupContextValue {
  beforeRemove: (element: HTMLElement, label: string) => void;
}
export const TagGroupContext = /* @__PURE__ */ createContext<TagGroupContextValue | null>(null);

export interface TagProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'onSelect'> {
  /** 글자 */
  children: ReactNode;
  /** 시각적 스타일 (표시·삭제용) */
  variant?: 'soft' | 'outline';
  /** 의미 색상. 고르는 칩에서는 켜졌을 때의 색 */
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info';
  /** 크기 — md 는 높이 32px(누르기 쉬움), sm 은 24px */
  size?: 'sm' | 'md';
  /** 글자 앞 아이콘 (장식용) */
  startIcon?: ReactNode;
  /**
   * 주면 끝에 삭제 버튼이 생긴다. 목록에서 실제로 지우는 것은 부르는 쪽이 한다.
   * 여러 개를 나열하면 TagGroup 으로 감싼다 — 지운 뒤 포커스를 다음 태그로 옮기고 "… 삭제됨" 을 알린다.
   */
  onRemove?: () => void;
  /** 삭제 버튼 이름 — 기본 "<글자> 삭제". 글자가 문자열이 아니면 직접 준다 */
  removeLabel?: string;
  /** 켜짐 (제어 모드) — selected·defaultSelected·onSelectedChange 중 하나를 주면 고르는 칩(button, aria-pressed)이 된다 */
  selected?: boolean;
  /** 처음 켜짐 (비제어 모드) */
  defaultSelected?: boolean;
  /** 고르는 칩을 눌렀을 때 */
  onSelectedChange?: (selected: boolean) => void;
  disabled?: boolean;
}

/**
 * 짧은 글자 하나를 담는 태그. 세 가지로 쓴다.
 * - 표시: 분류·키워드 (상태 라벨은 Badge).
 * - 삭제: `onRemove` — 고른 필터·입력한 키워드를 보여 주고 지운다. 삭제 버튼 위에서 Delete·Backspace 로도 지운다.
 * - 고르기: `selected`·`onSelectedChange` — 필터 칩. button 이고 켜짐을 aria-pressed 와 체크 아이콘으로 보인다.
 */
export const Tag = /* @__PURE__ */ forwardRef<HTMLElement, TagProps>(function Tag(props, ref) {
  const {
    children,
    variant,
    color,
    size,
    startIcon,
    onRemove,
    removeLabel,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    disabled,
    className,
    ...rest
  } = props;
  const m = useMessages();
  const group = useContext(TagGroupContext);
  const rootRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const isToggle = 'selected' in props || 'defaultSelected' in props || onSelectedChange !== undefined;
  const isControlled = 'selected' in props;
  const [innerSelected, setInnerSelected] = useState(defaultSelected);
  const selected = isControlled ? Boolean(selectedProp) : innerSelected;

  const content = (
    <>
      {isToggle && selected ? (
        <span className={styles.icon}>
          <CheckIcon size={size === 'sm' ? 12 : 14} />
        </span>
      ) : (
        startIcon && <span className={styles.icon}>{startIcon}</span>
      )}
      <span ref={labelRef} className={styles.label}>
        {children}
      </span>
    </>
  );

  if (isToggle) {
    if (onRemove) warnOnce('Tag: 고르는 칩(selected)과 삭제(onRemove)는 함께 쓸 수 없어요. onRemove 는 무시돼요.');
    return (
      <button
        ref={mergeRefs(ref, rootRef) as Ref<HTMLButtonElement>}
        type="button"
        aria-pressed={selected}
        disabled={disabled}
        className={cx(styles.tag({ variant: 'outline', color: color ?? 'primary', size }), styles.toggle, className)}
        {...rest}
        onClick={(event) => {
          rest.onClick?.(event);
          if (event.defaultPrevented) return;
          if (!isControlled) setInnerSelected(!selected);
          onSelectedChange?.(!selected);
        }}
      >
        {content}
      </button>
    );
  }

  const remove = () => {
    if (disabled) return;
    const root = rootRef.current;
    if (group && root) group.beforeRemove(root, labelRef.current?.textContent ?? '');
    onRemove?.();
  };
  if (onRemove && removeLabel === undefined && typeof children !== 'string') {
    warnOnce('Tag: 글자가 문자열이 아니면 삭제 버튼 이름을 removeLabel 로 주세요.');
  }
  const buttonLabel =
    removeLabel ??
    (typeof children === 'string' ? (m.removeTag?.(children) ?? `${children} 삭제`) : (m.removeTag?.('') ?? '삭제'));

  return (
    <span ref={mergeRefs(ref, rootRef)} className={cx(styles.tag({ variant, color, size }), className)} {...rest}>
      {content}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={buttonLabel}
          disabled={disabled}
          data-tag-remove=""
          onClick={remove}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
              event.preventDefault();
              remove();
            }
          }}
        >
          <XIcon size={size === 'sm' ? 12 : 14} />
        </button>
      )}
    </span>
  );
});
