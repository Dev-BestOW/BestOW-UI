import * as Popover from '@radix-ui/react-popover';
import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDownIcon, XIcon } from '@bestow-ui/icons';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { useMessages } from '../../i18n/LocaleProvider';
import * as fieldStyles from '../Input/Input.css';
import { Tag } from '../Tag/Tag';
import * as comboboxStyles from './Combobox.css';
import * as styles from './MultiCombobox.css';
import type { ComboboxOption } from './Combobox';
import { ComboboxListbox } from './ComboboxListbox';
import { defaultComboboxFilter, isComposingKey, useComboboxList } from './useComboboxList';

/** 포커스를 옮긴 뒤 알림을 넣기까지 — 포커스 이동과 같은 순간이면 VoiceOver 가 버린다(TagGroup 과 같은 값) */
const ANNOUNCE_AFTER_FOCUS = 500;
/** 칩 삭제를 누른 뒤 이 시간 안에 값이 줄어야 포커스를 옮긴다 (제어 모드에서 지우지 않았을 때 나중에 엉뚱하게 옮기지 않게) */
const PENDING_TIMEOUT = 1000;

const sameValues = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

export interface MultiComboboxProps {
  /** 선택지 목록 */
  options: ComboboxOption[];
  /** 고른 값들 (제어 모드). 칩은 이 순서대로 보인다. options 에 없는 값은 값 그대로 이름이 된다 */
  value?: string[];
  /** 처음 고른 값들 (비제어 모드) */
  defaultValue?: string[];
  /** 고른 값이 바뀔 때 호출된다 */
  onValueChange?: (values: string[]) => void;
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
  /** form 제출 시 사용할 이름 — 고른 값마다 하나씩 제출된다 (`name=a&name=b`) */
  name?: string;
  id?: string;
  /** label 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 고를 수 있는 최대 개수. 다 고르면 고르지 않은 항목은 비활성이 되고 칸 아래에 안내가 보인다 */
  maxSelected?: number;
  /** 칩 삭제 버튼 이름 — 기본 "<이름> 삭제" */
  removeLabel?: (label: string) => string;
  /** 목록 열기 버튼의 이름 */
  toggleLabel?: string;
  /** 고른 값이 있을 때 "모두 지우기" 버튼을 보여 준다(마우스용 — 키보드는 Backspace·칩 삭제 버튼). 지우면 `onValueChange([])` */
  clearable?: boolean;
  /** "모두 지우기" 버튼의 이름 */
  clearLabel?: string;
  /** 입력창 래퍼 className */
  className?: string;
}

/**
 * 입력해서 거르며 여러 개를 고르는 선택 상자 (WAI-ARIA combobox + 다중 선택 listbox).
 * 고른 값은 입력창 안에 칩으로 보인다. ↓/↑ 로 목록을 열고 이동, Enter 로 고르기·풀기(목록은 열린 채), Esc 로 닫는다.
 * 빈 입력창에서 Backspace 는 마지막 칩을 지운다. 칩 삭제 버튼은 Tab 순서에 있다.
 */
export const MultiCombobox = /* @__PURE__ */ forwardRef<HTMLInputElement, MultiComboboxProps>(
  function MultiCombobox(props, ref) {
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
      maxSelected,
      removeLabel,
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
    const chipsRef = useRef<HTMLUListElement>(null);

    // value 를 넘기면 undefined 여도 제어 모드로 둔다
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState<string[]>(defaultValue ?? []);
    const values = (isControlled ? value : innerValue) ?? [];
    const limitReached = maxSelected !== undefined && values.length >= maxSelected;
    const limitMessage =
      maxSelected === undefined ? '' : (m.maxSelected?.(maxSelected) ?? `최대 ${maxSelected}개까지 고를 수 있어요`);
    const isSelected = (option: ComboboxOption) => values.includes(option.value);
    const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

    const list = useComboboxList({
      id,
      options,
      filter,
      disabled,
      isSelected,
      isDisabled: (option) => Boolean(option.disabled) || (limitReached && !values.includes(option.value)),
    });
    const { inputId, listId, optionId, open, query, activeIndex, filtered, hasOptions, reset } = list;
    const labelId = `${inputId}-label`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const limitId = limitReached ? `${inputId}-limit` : undefined;
    const describedBy = [helperId, limitId].filter(Boolean).join(' ') || undefined;

    // 삭제·최대 개수 알림 — 처음부터 있는 status 영역에 잠시 뒤 넣는다(같은 글자가 다시 와도 읽히게 먼저 비운다)
    const [announcement, setAnnouncement] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const announce = (text: string) => {
      clearTimeout(timer.current);
      setAnnouncement('');
      timer.current = setTimeout(() => setAnnouncement(text), ANNOUNCE_AFTER_FOCUS);
    };

    const update = (next: string[]) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    };

    useFormReset(inputRef, () => {
      reset();
      if (isControlled) return;
      const initial = defaultValue ?? [];
      setInnerValue(initial);
      if (!sameValues(initial, values)) onValueChange?.(initial);
    });

    const toggle = (option: ComboboxOption) => {
      if (list.isDisabled(option)) return;
      const next = isSelected(option) ? values.filter((v) => v !== option.value) : [...values, option.value];
      update(next);
      // 목록은 열어 둔 채 검색어만 비운다 — 이어서 고르기 쉽게. 활성 항목은 전체 목록에서 같은 항목
      list.setQuery(null);
      list.setActiveIndex(options.indexOf(option));
      if (maxSelected !== undefined && next.length === maxSelected) announce(limitMessage);
    };

    const removeAt = (index: number) => {
      const removed = values[index];
      if (removed === undefined) return;
      update(values.filter((_, i) => i !== index));
      announce(m.tagRemoved?.(labelOf(removed)) ?? `${labelOf(removed)} 삭제됨`);
    };

    // 칩 삭제 버튼으로 지운 뒤: 같은 자리(다음 칩) → 앞 칩 → 입력창 순서로 포커스
    const pendingFocus = useRef<{ index: number; count: number; at: number } | null>(null);
    useIsomorphicLayoutEffect(() => {
      const target = pendingFocus.current;
      if (!target) return;
      if (Date.now() - target.at > PENDING_TIMEOUT) {
        pendingFocus.current = null;
        return;
      }
      if (values.length >= target.count) return;
      pendingFocus.current = null;
      const buttons = chipsRef.current?.querySelectorAll<HTMLElement>('[data-tag-remove]:not(:disabled)');
      const button = buttons?.[Math.min(target.index, values.length - 1)];
      (button ?? inputRef.current)?.focus();
    });

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
            event.preventDefault(); // 목록이 열려 있을 때는 form 제출 대신 고르기
            const option = filtered[activeIndex];
            if (option) toggle(option);
            else reset();
          }
          break;
        case 'Escape':
          if (open || query) {
            event.preventDefault();
            reset();
          }
          break;
        case 'Tab':
          if (open) reset();
          break;
        case 'Backspace': {
          // 빈 입력창의 맨 앞에서 — 마지막 칩을 지운다 (포커스는 입력창에 그대로)
          const input = event.currentTarget;
          if (!query && values.length > 0 && input.selectionStart === 0 && input.selectionEnd === 0) {
            event.preventDefault();
            pendingFocus.current = null;
            removeAt(values.length - 1);
          }
          break;
        }
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
        <Popover.Root open={open && !disabled} onOpenChange={(next) => (next ? list.openList() : reset())}>
          <Popover.Anchor asChild>
            <div
              ref={anchorRef}
              className={cx(fieldStyles.root({ size, fullWidth }), styles.root({ size }), className)}
              data-invalid={error || undefined}
              data-disabled={disabled || undefined}
            >
              <div className={styles.body}>
                {values.length > 0 && (
                  <ul ref={chipsRef} className={styles.chips} aria-label={m.selectedOptions ?? '고른 항목'}>
                    {values.map((v, index) => (
                      <li key={v}>
                        <Tag
                          size={size === 'sm' ? 'sm' : 'md'}
                          disabled={disabled}
                          // 비활성이면 칸 전체가 흐려진다 — 칩 글자도 "비활성 컴포넌트"(대비 기준 예외, 1.4.3)임을 알린다
                          aria-disabled={disabled || undefined}
                          removeLabel={removeLabel?.(labelOf(v))}
                          onRemove={() => {
                            pendingFocus.current = { index, count: values.length, at: Date.now() };
                            removeAt(index);
                          }}
                        >
                          {labelOf(v)}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                )}
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
                  aria-describedby={describedBy}
                  autoComplete="off"
                  placeholder={values.length > 0 ? undefined : placeholder}
                  disabled={disabled}
                  value={query ?? ''}
                  onChange={(event) => list.changeQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    // 목록 항목을 누르는 중에는 닫지 않는다 (항목의 mousedown 에서 blur 를 막는다)
                    if (open || query !== null) reset();
                  }}
                  className={cx(fieldStyles.input, styles.input({ size }))}
                />
              </div>
              <div className={styles.actions({ size })}>
                {clearable && values.length > 0 && !disabled && (
                  <button
                    type="button"
                    // 키보드는 Backspace·칩 삭제 버튼으로 지울 수 있어 Tab 순서에 넣지 않는다 (Combobox 와 같음)
                    tabIndex={-1}
                    aria-label={clearLabel}
                    className={comboboxStyles.clear}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      update([]);
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
                  className={comboboxStyles.toggle}
                  // 입력창 포커스를 유지한다
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (open) reset();
                    else list.openList(options);
                    inputRef.current?.focus();
                  }}
                >
                  <ChevronDownIcon size={16} />
                </button>
              </div>
            </div>
          </Popover.Anchor>
          <ComboboxListbox
            listId={listId}
            optionId={optionId}
            options={filtered}
            activeIndex={activeIndex}
            onActiveIndexChange={list.setActiveIndex}
            onSelect={toggle}
            isSelected={isSelected}
            isDisabled={list.isDisabled}
            emptyMessage={emptyMessage}
            labelledBy={label ? labelId : undefined}
            ariaLabel={ariaLabel}
            multiselectable
            anchorRef={anchorRef}
          />
        </Popover.Root>
        {/* 결과 없음·삭제·최대 개수 알림 — 처음부터 있는 빈 영역에 글자만 넣는다 */}
        <span role="status" className={visuallyHidden}>
          {list.announceNoResults ? emptyMessage : announcement}
        </span>
        {name && values.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
        {helperText && (
          <p id={helperId} className={fieldStyles.helperText({ error })}>
            {helperText}
          </p>
        )}
        {limitReached && (
          <p id={limitId} className={fieldStyles.helperText({})}>
            {limitMessage}
          </p>
        )}
      </div>
    );
  },
);
