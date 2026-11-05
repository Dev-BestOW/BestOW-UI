import { forwardRef, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { SearchIcon, XIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import { useMessages } from '../../i18n/LocaleProvider';
import { TextField, type TextFieldProps } from '../Input';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './SearchInput.css';

export interface SearchInputProps extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'type' | 'endAdornment'> {
  /** 검색어 (제어 모드) */
  value?: string;
  /** 처음 검색어 (비제어 모드) */
  defaultValue?: string;
  /** 검색어가 바뀔 때 (입력·지우기·form reset) */
  onValueChange?: (value: string) => void;
  /**
   * Enter 를 눌렀을 때 — 한글 조합 중 Enter 는 무시한다.
   * form 안에서는 Enter 가 form 도 제출하므로, form 이 있으면 form 의 onSubmit 하나만 쓰는 편이 낫다.
   */
  onSearch?: (value: string) => void;
  /** 지우기 버튼 이름 — 기본 "검색어 지우기" */
  clearLabel?: string;
  /** 앞의 돋보기 아이콘을 바꾼다. null 이면 없앤다 */
  startAdornment?: ReactNode;
  // ── 아래는 TextFieldProps 에서 물려받는 prop 중 자주 쓰는 것. 타입은 같고, Storybook 자동 문서(react-docgen 이
  //    Omit 으로 물려받은 prop 을 풀지 못함)에 보이도록 다시 적는다.
  /** 입력창 위에 표시할 레이블. 없으면 접근 가능한 이름으로 "검색" 을 쓴다(aria-label 로 바꿀 수 있음) */
  label?: ReactNode;
  /** 입력창 아래에 표시할 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  placeholder?: string;
  /** form 제출 시 사용할 이름 */
  name?: string;
}

/**
 * 검색 입력. 앞에 돋보기, 글자가 있으면 끝에 지우기 버튼이 생긴다. Enter 는 onSearch, Escape 는 검색어를 지운다.
 * 지우기 버튼은 Tab 순서에 넣지 않는다(키보드는 Escape) — Combobox 의 지우기와 같다.
 */
export const SearchInput = /* @__PURE__ */ forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    const {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onSearch,
      clearLabel: clearLabelProp,
      startAdornment,
      label,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      onChange,
      onKeyDown,
      className,
      disabled,
      readOnly,
      ...rest
    } = props;
    const m = useMessages();
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState(defaultValue);
    const value = isControlled ? (valueProp ?? '') : innerValue;

    const update = (next: string) => {
      if (!isControlled) setInnerValue(next);
      if (next !== value) onValueChange?.(next);
    };

    useFormReset(inputRef, () => {
      if (isControlled) return;
      setInnerValue(defaultValue);
      if (defaultValue !== innerValue) onValueChange?.(defaultValue);
    });

    const clear = () => {
      update('');
      inputRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      // 한글 조합을 끝내는 Enter 는 검색이 아니다. Safari 는 조합을 끝낸 뒤 isComposing=false 로 보내 keyCode 229 로도 확인한다.
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      if (event.key === 'Enter') onSearch?.(value);
      // 브라우저마다 다른 type="search" 의 Escape 동작(Firefox 는 지우지 않음)을 맞춘다. 빈 칸이면 그대로 둔다(Modal 닫기 등)
      if (event.key === 'Escape' && value !== '' && !readOnly) {
        event.preventDefault();
        update('');
      }
    };

    return (
      <TextField
        ref={mergeRefs(ref, inputRef)}
        label={label}
        aria-label={label || ariaLabelledby ? ariaLabel : (ariaLabel ?? m.search ?? '검색')}
        aria-labelledby={ariaLabelledby}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange?.(event);
          update(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={cx(styles.input, className)}
        disabled={disabled}
        readOnly={readOnly}
        startAdornment={startAdornment === undefined ? <SearchIcon size={18} /> : startAdornment}
        endAdornment={
          value !== '' &&
          !disabled &&
          !readOnly && (
            <button
              type="button"
              tabIndex={-1}
              className={fieldStyles.inputAction}
              aria-label={clearLabelProp ?? m.clearSearch ?? '검색어 지우기'}
              onMouseDown={(event) => event.preventDefault()}
              onClick={clear}
            >
              <XIcon size={16} />
            </button>
          )
        }
        {...rest}
      />
    );
  },
);
