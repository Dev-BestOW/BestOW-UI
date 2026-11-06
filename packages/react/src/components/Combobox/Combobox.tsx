import * as Popover from '@radix-ui/react-popover';
import { forwardRef, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDownIcon, XIcon } from '@bestow-ui/icons';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './Combobox.css';
import { useMessages } from '../../i18n/LocaleProvider';
import { ComboboxListbox } from './ComboboxListbox';
import { defaultComboboxFilter, isComposingKey, useComboboxList } from './useComboboxList';

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
  /**
   * 값이 있을 때 "선택 지우기" 버튼을 보여 준다. 버튼이 없어도 입력창 글자를 모두 지우고 닫으면(포커스 이동·Esc·Enter) 선택이 지워진다.
   * 지우면 `onValueChange('')` 가 호출된다.
   */
  clearable?: boolean;
  /** "선택 지우기" 버튼의 이름 */
  clearLabel?: string;
  /** 입력창 래퍼 className */
  className?: string;
}

/**
 * 입력해서 거르며 고르는 선택 상자 (WAI-ARIA combobox + listbox 패턴).
 * ↓/↑ 로 목록을 열고 이동, Enter 로 선택, Esc 로 닫는다. 목록에 없는 값은 입력할 수 없다(선택만).
 * 여러 개를 고르려면 MultiCombobox.
 */
export const Combobox = /* @__PURE__ */ forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const {
    options,
    value,
    defaultValue,
    onValueChange,
    filter = defaultComboboxFilter,
    emptyMessage: emptyMessageProp,
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
    toggleLabel: toggleLabelProp,
    clearable,
    clearLabel: clearLabelProp,
    className,
  } = props;
  const m = useMessages();
  const emptyMessage = emptyMessageProp ?? m.noResults ?? '결과가 없어요';
  const toggleLabel = toggleLabelProp ?? m.openList ?? '목록 열기';
  const clearLabel = clearLabelProp ?? m.clearSelection ?? '선택 지우기';
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : innerValue;
  const selectedOption = options.find((o) => o.value === selectedValue);

  const list = useComboboxList({
    id,
    options,
    filter,
    disabled,
    isSelected: (option) => option.value === selectedValue,
  });
  const { inputId, listId, optionId, open, query, activeIndex, filtered, hasOptions, reset } = list;
  const labelId = `${inputId}-label`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  // 입력 중이 아니면 입력창에 선택된 이름을 보여 준다
  const inputText = query ?? selectedOption?.label ?? '';

  useFormReset(inputRef, () => {
    reset();
    if (isControlled) return;
    setInnerValue(defaultValue);
    if (defaultValue !== selectedValue) onValueChange?.(defaultValue ?? '');
  });

  const clearSelection = () => {
    if (!isControlled) setInnerValue(undefined);
    if (selectedValue) onValueChange?.('');
  };

  /** 고르지 않고 닫는다. 입력창 글자를 모두 지운 채 닫으면 선택도 지운다 */
  const close = () => {
    if (query === '' && selectedValue) clearSelection();
    reset(); // 입력하다 닫으면 선택된 이름으로 되돌린다
  };

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (!isControlled) setInnerValue(option.value);
    if (option.value !== selectedValue) onValueChange?.(option.value);
    reset();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isComposingKey(event)) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) list.openList();
        else list.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) list.openList(filtered, true);
        else list.move(-1);
        break;
      case 'Enter':
        if (open) {
          event.preventDefault(); // 목록이 열려 있을 때는 form 제출 대신 선택
          const option = filtered[activeIndex];
          if (option) select(option);
          else close();
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
      <Popover.Root open={open && !disabled} onOpenChange={(next) => (next ? list.openList() : close())}>
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
              onChange={(event: ChangeEvent<HTMLInputElement>) => list.changeQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                // 목록 항목을 누르는 중에는 닫지 않는다 (항목의 mousedown 에서 blur 를 막는다)
                if (open) close();
              }}
              className={fieldStyles.input}
            />
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                // 키보드는 글자를 지워서 선택을 지울 수 있어 Tab 순서에 넣지 않는다 (목록 열기 버튼과 같음)
                tabIndex={-1}
                aria-label={clearLabel}
                className={styles.clear}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  clearSelection();
                  reset();
                  inputRef.current?.focus();
                }}
              >
                <XIcon size={16} />
              </button>
            )}
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
                else list.openList(options);
                inputRef.current?.focus();
              }}
            >
              <ChevronDownIcon size={16} />
            </button>
          </div>
        </Popover.Anchor>
        <ComboboxListbox
          listId={listId}
          optionId={optionId}
          options={filtered}
          activeIndex={activeIndex}
          onActiveIndexChange={list.setActiveIndex}
          onSelect={select}
          isSelected={(option) => option.value === selectedValue}
          isDisabled={list.isDisabled}
          emptyMessage={emptyMessage}
          labelledBy={label ? labelId : undefined}
          ariaLabel={ariaLabel}
          anchorRef={anchorRef}
        />
      </Popover.Root>
      {/* 결과 없음 알림 — 처음부터 있는 빈 영역에 글자만 넣는다(글자를 담은 채 새로 생긴 live region 은 읽히지 않는다) */}
      <span role="status" className={visuallyHidden}>
        {list.announceNoResults ? emptyMessage : ''}
      </span>
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
    </div>
  );
});
