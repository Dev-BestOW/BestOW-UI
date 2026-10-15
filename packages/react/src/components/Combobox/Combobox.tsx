import * as Popover from '@radix-ui/react-popover';
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { CheckIcon, ChevronDownIcon } from '@bestow-ui/icons';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import * as fieldStyles from '../Input/Input.css';
import * as selectStyles from '../Select/Select.css';
import * as styles from './Combobox.css';

export interface ComboboxOption {
  value: string;
  /** 표시·검색에 쓰는 이름 */
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** 선택지 목록 */
  options: ComboboxOption[];
  /** 선택된 값 (제어 모드). undefined 면 선택 없음 */
  value?: string;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string;
  /** 값이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /** 입력한 글자로 선택지를 거르는 함수 (기본: 대소문자 구분 없이 label 에 포함) */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** 검색 결과가 없을 때 문구 */
  emptyMessage?: ReactNode;
  placeholder?: string;
  /** 위에 표시할 레이블 */
  label?: ReactNode;
  /** 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** form 제출 시 사용할 이름 (선택된 value 가 제출된다) */
  name?: string;
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 목록 열기 버튼의 이름 */
  toggleLabel?: string;
  /** 입력창 래퍼 className */
  className?: string;
}

const defaultFilter = (option: ComboboxOption, query: string) =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

/**
 * 입력해서 거르며 고르는 선택 상자 (WAI-ARIA combobox + listbox 패턴).
 * ↓/↑ 로 목록을 열고 이동, Enter 로 선택, Esc 로 닫는다. 목록에 없는 값은 입력할 수 없다(선택만).
 */
export const Combobox = /* @__PURE__ */ forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const {
    options,
    value,
    defaultValue,
    onValueChange,
    filter = defaultFilter,
    emptyMessage = '결과가 없어요',
    placeholder,
    label,
    helperText,
    error,
    size,
    fullWidth,
    disabled,
    required,
    name,
    id,
    'aria-label': ariaLabel,
    toggleLabel = '목록 열기',
    className,
  } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const listId = `${inputId}-listbox`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const optionId = (index: number) => `${inputId}-option-${index}`;
  const portal = usePortalProps();
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : innerValue;
  const selectedOption = options.find((o) => o.value === selectedValue);

  const [open, setOpen] = useState(false);
  // 사용자가 입력 중일 때만 query 로 거른다. 아니면 입력창에 선택된 이름을 보여 준다
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(() => (query ? options.filter((o) => filter(o, query)) : options), [options, filter, query]);
  const inputText = query ?? selectedOption?.label ?? '';

  const firstEnabled = (list: ComboboxOption[], from = 0, step = 1) => {
    for (let i = from; i >= 0 && i < list.length; i += step) if (!list[i]!.disabled) return i;
    return -1;
  };

  const openList = (list: ComboboxOption[] = filtered, preferLast = false) => {
    setOpen(true);
    const selectedIndex = list.findIndex((o) => o.value === selectedValue);
    setActiveIndex(
      selectedIndex >= 0 && !list[selectedIndex]!.disabled
        ? selectedIndex
        : preferLast
          ? firstEnabled(list, list.length - 1, -1)
          : firstEnabled(list),
    );
  };

  const close = () => {
    setOpen(false);
    setQuery(null); // 입력하다 닫으면 선택된 이름으로 되돌린다
    setActiveIndex(-1);
  };

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (!isControlled) setInnerValue(option.value);
    if (option.value !== selectedValue) onValueChange?.(option.value);
    close();
  };

  const move = (step: 1 | -1) => {
    const start = activeIndex < 0 ? (step === 1 ? 0 : filtered.length - 1) : activeIndex + step;
    const next = firstEnabled(filtered, start, step);
    if (next >= 0) setActiveIndex(next);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;
    const nextList = nextQuery ? options.filter((o) => filter(o, nextQuery)) : options;
    setQuery(nextQuery);
    setOpen(true);
    setActiveIndex(firstEnabled(nextList));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList();
        else move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList(filtered, true);
        else move(-1);
        break;
      case 'Enter':
        if (open) {
          event.preventDefault(); // 목록이 열려 있을 때는 form 제출 대신 선택
          const option = filtered[activeIndex];
          if (option) select(option);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case 'Tab':
        if (open) close();
        break;
    }
  };

  // 키보드로 옮긴 항목이 보이도록 스크롤한다
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // optionId 는 inputId 에서 만들어지므로 의존성에서 뺀다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  const hasOptions = filtered.length > 0;

  return (
    <div className={cx(fieldStyles.field, fullWidth && fieldStyles.fieldFullWidth)}>
      {label && (
        <label id={labelId} htmlFor={inputId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <Popover.Root open={open && !disabled} onOpenChange={(next) => (next ? openList() : close())}>
        <Popover.Anchor asChild>
          <div
            ref={anchorRef}
            className={cx(fieldStyles.root({ size, fullWidth }), className)}
            data-invalid={error || undefined}
            data-disabled={disabled || undefined}
          >
            <input
              ref={mergeRefs(ref, inputRef)}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={open && hasOptions ? listId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
              aria-label={label ? undefined : ariaLabel}
              aria-invalid={error || undefined}
              aria-required={required || undefined}
              aria-describedby={helperId}
              autoComplete="off"
              placeholder={placeholder}
              disabled={disabled}
              value={inputText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                // 목록 항목을 누르는 중에는 닫지 않는다 (항목의 mousedown 에서 blur 를 막는다)
                if (open) close();
              }}
              className={fieldStyles.input}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={toggleLabel}
              aria-expanded={open}
              disabled={disabled}
              className={styles.toggle}
              // 입력창 포커스를 유지한다
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (open) close();
                else openList(options);
                inputRef.current?.focus();
              }}
            >
              <ChevronDownIcon size={16} />
            </button>
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            role="presentation"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            className={cx(portal.className, styles.content)}
            style={portal.style}
            // 포커스는 입력창에 그대로 둔다 (목록은 aria-activedescendant 로 가리킨다)
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            // 목록(스크롤바 포함)을 눌러도 입력창 포커스가 빠지지 않게 한다
            onMouseDown={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (anchorRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
          >
            {hasOptions ? (
              <div
                id={listId}
                role="listbox"
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : ariaLabel}
              >
                {filtered.map((option, index) => {
                  const isSelected = option.value === selectedValue;
                  return (
                    // aria-activedescendant 패턴: 포커스·키보드는 입력창이 맡고 항목은 포커스를 받지 않는다 (WAI-ARIA combobox)
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                    <div
                      key={option.value}
                      id={optionId(index)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      // Select 항목 스타일을 그대로 쓰기 위한 상태 속성
                      data-highlighted={index === activeIndex ? '' : undefined}
                      data-state={isSelected ? 'checked' : 'unchecked'}
                      data-disabled={option.disabled ? '' : undefined}
                      className={selectStyles.item}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseMove={() => !option.disabled && setActiveIndex(index)}
                      onClick={() => select(option)}
                    >
                      {option.label}
                      {isSelected && (
                        <span className={selectStyles.itemIndicator} aria-hidden>
                          <CheckIcon size={16} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty} role="status">
                {emptyMessage}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
