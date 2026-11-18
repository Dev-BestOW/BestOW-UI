import { forwardRef, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormReset } from '../../utils/useFormReset';
import { Checkbox } from '../Checkbox';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './AgreementGroup.css';
import { leafValues, type AgreementItem } from './agreements';
import { useMessages } from '../../i18n/LocaleProvider';

export interface AgreementGroupProps {
  items: AgreementItem[];
  /** 동의한 항목의 value 목록 (제어 모드) */
  value?: string[];
  /** 처음 동의한 항목 (비제어 모드) */
  defaultValue?: string[];
  /** 동의 항목이 바뀔 때 호출된다 */
  onValueChange?: (value: string[]) => void;
  /** 그룹 제목 (fieldset 의 legend) */
  label?: ReactNode;
  /** "전체 동의" 문구 */
  allLabel?: ReactNode;
  /** 아래 도움말. error 일 때는 에러 메시지로 표시된다 (예: "필수 약관에 동의해 주세요") */
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** 필수·선택 표시 문구 (다국어) */
  requiredText?: string;
  optionalText?: string;
  /** 약관 내용 펼치기 버튼 문구 */
  showText?: string;
  hideText?: string;
  /** form 제출 시 사용할 이름. 동의한 value 마다 hidden input 이 생긴다 */
  name?: string;
  /** fieldset 의 id — ErrorSummary 링크 등에서 이 묶음을 가리킬 때 */
  id?: string;
  className?: string;
}

/**
 * 약관 동의 묶음. "전체 동의" 와 개별 항목이 서로 맞춰지고(일부만 동의하면 전체 동의는 부분 선택 상태),
 * 항목마다 필수·선택 표시와 약관 내용 펼쳐 보기를 지원한다.
 */
export const AgreementGroup = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, AgreementGroupProps>(
  function AgreementGroup(props, ref) {
    const {
      items,
      value,
      defaultValue,
      onValueChange,
      label,
      allLabel: allLabelProp,
      helperText,
      error,
      disabled,
      requiredText: requiredTextProp,
      optionalText: optionalTextProp,
      showText: showTextProp,
      hideText: hideTextProp,
      name,
      id,
      className,
    } = props;
    const m = useMessages();
    const allLabel = allLabelProp ?? m.agreeAll ?? '전체 동의';
    const requiredText = requiredTextProp ?? m.required ?? '필수';
    const optionalText = optionalTextProp ?? m.optional ?? '선택';
    const showText = showTextProp ?? m.show ?? '보기';
    const hideText = hideTextProp ?? m.hide ?? '접기';
    const baseId = useId();
    const helperId = helperText ? `${baseId}-helper` : undefined;

    // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState<string[]>(defaultValue ?? []);
    const allValues = leafValues(items);
    // 하위 항목이 있는 부모의 value 처럼 동의 값이 될 수 없는 값은 무시한다 (출력에도 넣지 않는다)
    const agreed = (isControlled ? (value ?? []) : innerValue).filter((v) => allValues.includes(v));
    const [expanded, setExpanded] = useState<string[]>([]);

    const rootRef = useRef<HTMLFieldSetElement>(null);
    useFormReset(rootRef, () => {
      if (isControlled) return;
      const next = defaultValue ?? [];
      setInnerValue(next);
      if (next.join() !== agreed.join()) onValueChange?.(next);
    });

    const update = (next: string[]) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    };

    const agreedCount = allValues.filter((v) => agreed.includes(v)).length;
    const allChecked = allValues.length > 0 && agreedCount === allValues.length;

    // 항목(하위 항목이 있으면 그 전부)을 켜거나 끈다
    const toggleValues = (values: string[], checked: boolean) => {
      const rest = agreed.filter((v) => !values.includes(v));
      update(checked ? [...rest, ...values] : rest);
    };

    return (
      <fieldset
        ref={mergeRefs(ref, rootRef)}
        id={id}
        className={cx(styles.fieldset, className)}
        disabled={disabled}
        aria-describedby={helperId}
        data-invalid={error || undefined}
      >
        {label && <legend className={styles.legend}>{label}</legend>}
        <div className={styles.box}>
          <div className={styles.all}>
            <Checkbox
              label={allLabel}
              checked={allChecked}
              indeterminate={agreedCount > 0 && !allChecked}
              onChange={(event) => update(event.target.checked ? allValues : [])}
            />
          </div>
          <ul className={styles.list}>
            {items.map((item) => {
              const labelId = `${baseId}-${item.value}-label`;
              const toggleTextId = `${baseId}-${item.value}-toggle`;
              const contentId = `${baseId}-${item.value}-content`;
              const isOpen = expanded.includes(item.value);
              const values = leafValues([item]);
              const childCount = values.filter((v) => agreed.includes(v)).length;
              const children = item.children?.length ? item.children : null;
              return (
                <li key={item.value} className={styles.item}>
                  <div className={styles.row}>
                    <Checkbox
                      size="sm"
                      checked={childCount === values.length}
                      indeterminate={children ? childCount > 0 && childCount < values.length : undefined}
                      invalid={error && item.required && childCount < values.length}
                      onChange={(event) => toggleValues(values, event.target.checked)}
                      label={
                        <span id={labelId}>
                          <span className={styles.tag} data-required={item.required || undefined}>
                            {item.required ? requiredText : optionalText}
                          </span>
                          {/* 이 공백이 없으면 이름이 "필수서비스 이용약관" 처럼 붙어서 읽힌다 */} {item.label}
                        </span>
                      }
                    />
                    {item.content && (
                      <button
                        type="button"
                        className={styles.toggle}
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        // "필수 서비스 이용약관 동의 보기" 처럼 어떤 약관인지 이름에 넣는다
                        aria-labelledby={`${labelId} ${toggleTextId}`}
                        onClick={() =>
                          setExpanded((prev) => (isOpen ? prev.filter((v) => v !== item.value) : [...prev, item.value]))
                        }
                      >
                        <span id={toggleTextId}>{isOpen ? hideText : showText}</span>
                        <ChevronDownIcon size={14} className={styles.chevron} />
                      </button>
                    )}
                  </div>
                  {children && (
                    <ul aria-labelledby={labelId} className={styles.subList}>
                      {children.map((child) => (
                        <li key={child.value}>
                          <Checkbox
                            size="sm"
                            label={child.label}
                            checked={agreed.includes(child.value)}
                            invalid={error && item.required && !agreed.includes(child.value)}
                            onChange={(event) => toggleValues([child.value], event.target.checked)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.content && isOpen && (
                    // 내용이 길면 스크롤된다 — 키보드로도 스크롤할 수 있게 포커스를 받는 이름 있는 영역으로 둔다
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    <div id={contentId} role="region" aria-labelledby={labelId} tabIndex={0} className={styles.content}>
                      {item.content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {name && agreed.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
        {helperText && (
          <p id={helperId} className={fieldStyles.helperText({ error })}>
            {helperText}
          </p>
        )}
      </fieldset>
    );
  },
);
