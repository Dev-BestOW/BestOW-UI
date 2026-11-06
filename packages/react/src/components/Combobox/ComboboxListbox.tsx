import * as Popover from '@radix-ui/react-popover';
import type { ReactNode, RefObject } from 'react';
import { CheckIcon } from '@bestow-ui/icons';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as selectStyles from '../Select/Select.css';
import * as styles from './Combobox.css';
import type { ComboboxOption } from './Combobox';

interface ComboboxListboxProps {
  listId: string;
  optionId: (index: number) => string;
  options: ComboboxOption[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (option: ComboboxOption) => void;
  isSelected: (option: ComboboxOption) => boolean;
  isDisabled: (option: ComboboxOption) => boolean;
  emptyMessage: ReactNode;
  /** 화면 레이블의 id — 없으면 ariaLabel */
  labelledBy?: string;
  ariaLabel?: string;
  multiselectable?: boolean;
  /** 입력창을 감싼 요소 — 여기를 눌러도 닫지 않는다 */
  anchorRef: RefObject<HTMLElement | null>;
}

/** Combobox·MultiCombobox 의 펼친 목록 (내부용). Popover.Root 안에서 쓴다 */
export function ComboboxListbox({
  listId,
  optionId,
  options,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  isSelected,
  isDisabled,
  emptyMessage,
  labelledBy,
  ariaLabel,
  multiselectable,
  anchorRef,
}: ComboboxListboxProps) {
  const portal = usePortalProps();
  return (
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
        {options.length > 0 ? (
          <div
            id={listId}
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : ariaLabel}
            aria-multiselectable={multiselectable || undefined}
          >
            {options.map((option, index) => {
              const selected = isSelected(option);
              const disabled = isDisabled(option);
              return (
                // aria-activedescendant 패턴: 포커스·키보드는 입력창이 맡고 항목은 포커스를 받지 않는다 (WAI-ARIA combobox)
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                <div
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={disabled || undefined}
                  // Select 항목 스타일을 그대로 쓰기 위한 상태 속성
                  data-highlighted={index === activeIndex ? '' : undefined}
                  data-state={selected ? 'checked' : 'unchecked'}
                  data-disabled={disabled ? '' : undefined}
                  className={selectStyles.item}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => !disabled && onActiveIndexChange(index)}
                  onClick={() => !disabled && onSelect(option)}
                >
                  {option.label}
                  {selected && (
                    <span className={selectStyles.itemIndicator} aria-hidden>
                      <CheckIcon size={16} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // 스크린리더 알림은 컴포넌트의 항상 있는 status 영역이 맡는다 (여기는 화면 표시만)
          <div className={styles.empty}>{emptyMessage}</div>
        )}
      </Popover.Content>
    </Popover.Portal>
  );
}
