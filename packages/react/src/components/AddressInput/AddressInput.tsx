import { forwardRef, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import * as fieldStyles from '../Input/Input.css';
import { TextField } from '../Input';
import { Modal } from '../Modal';
import { Spinner } from '../Spinner';
import { kakaoPostcodeProvider, type AddressProvider, type AddressSearchResult } from './addressProviders';
import * as styles from './AddressInput.css';
import { useMessages } from '../../i18n/LocaleProvider';

export interface AddressValue {
  /** 우편번호 */
  zonecode: string;
  /** 기본 주소 */
  address: string;
  /** 참고 항목 (예: " (역삼동, 래미안아파트)") */
  extraAddress?: string;
  /** 상세 주소 (사용자가 입력) */
  detail: string;
}

export interface AddressInputProps {
  /** 주소 값 (제어 모드) */
  value?: AddressValue;
  /** 처음 값 (비제어 모드) */
  defaultValue?: AddressValue;
  /** 주소를 고르거나 상세 주소를 입력할 때 호출된다 */
  onValueChange?: (value: AddressValue) => void;
  /** 그룹 제목 */
  label?: ReactNode;
  required?: boolean;
  /** 아래 도움말. error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** 주소 검색 공급자. 기본은 카카오(다음) 우편번호 서비스 — 처음 검색할 때 스크립트를 불러온다 */
  provider?: AddressProvider;
  /** 검색 버튼·검색 창 제목 */
  searchLabel?: string;
  detailPlaceholder?: string;
  /** 검색 화면을 불러오지 못했을 때 문구 */
  loadErrorText?: string;
  /** form 제출 시 이름. `${name}[zonecode]`, `${name}[address]`, `${name}[detail]` 로 제출된다 */
  name?: string;
  className?: string;
}

const EMPTY: AddressValue = { zonecode: '', address: '', extraAddress: '', detail: '' };

function SearchArea({
  provider,
  onSelect,
  loadErrorText,
  loadingText,
}: {
  provider: AddressProvider;
  onSelect: (result: AddressSearchResult) => void;
  loadErrorText: string;
  loadingText: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  // 공급자에게는 한 번만 넘기고, 최신 onSelect 를 부르도록 ref 로 잇는다
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cleanup: void | (() => void);
    let cancelled = false;
    Promise.resolve()
      .then(() => provider(container, (result) => onSelectRef.current(result)))
      .then((fn) => {
        if (cancelled) fn?.();
        else {
          cleanup = fn;
          setStatus('ready');
        }
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [provider]);

  return (
    <div className={styles.searchArea}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {status !== 'ready' && (
        <div className={styles.searchStatus} role="status">
          {status === 'loading' ? <Spinner label={loadingText} /> : loadErrorText}
        </div>
      )}
    </div>
  );
}

/**
 * 주소 입력 (우편번호 · 기본 주소 · 상세 주소). "주소 검색" 을 누르면 검색 창(Modal)에서 주소를 고르고,
 * 고르면 상세 주소 입력창으로 포커스를 옮긴다.
 */
export const AddressInput = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, AddressInputProps>(
  function AddressInput(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      label: labelProp,
      required,
      helperText,
      error,
      disabled,
      provider = kakaoPostcodeProvider,
      searchLabel: searchLabelProp,
      detailPlaceholder: detailPlaceholderProp,
      loadErrorText: loadErrorTextProp,
      name,
      className,
    } = props;
    const m = useMessages();
    const label = labelProp ?? m.address ?? '주소';
    const searchLabel = searchLabelProp ?? m.addressSearch ?? '주소 검색';
    const detailPlaceholder = detailPlaceholderProp ?? m.detailAddressPlaceholder ?? '상세 주소 (동·호수 등)';
    const loadErrorText =
      loadErrorTextProp ?? m.addressLoadError ?? '주소 검색을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.';
    const baseId = useId();
    const helperId = helperText ? `${baseId}-helper` : undefined;
    const detailRef = useRef<HTMLInputElement>(null);
    const selectedRef = useRef(false);
    const [open, setOpen] = useState(false);

    // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
    const isControlled = 'value' in props;
    const [innerValue, setInnerValue] = useState<AddressValue>(defaultValue ?? EMPTY);
    const current = isControlled ? (value ?? EMPTY) : innerValue;

    const update = (next: AddressValue) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    };

    const openSearch = () => {
      if (disabled) return;
      selectedRef.current = false;
      setOpen(true);
    };

    const handleSelect = (result: AddressSearchResult) => {
      selectedRef.current = true;
      update({
        ...current,
        zonecode: result.zonecode,
        address: result.address,
        extraAddress: result.extraAddress ?? '',
      });
      setOpen(false);
    };

    const fullAddress = `${current.address}${current.extraAddress ?? ''}`;

    return (
      <fieldset ref={ref} className={cx(styles.fieldset, className)} disabled={disabled} aria-describedby={helperId}>
        <legend className={styles.legend}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </legend>
        <div className={styles.row}>
          <TextField
            aria-label={m.postalCode ?? '우편번호'}
            readOnly
            value={current.zonecode}
            placeholder={m.postalCode ?? '우편번호'}
            error={error && !current.zonecode}
            aria-required={required || undefined}
            rootClassName={styles.zonecode}
            onClick={openSearch}
          />
          <Button variant="outline" color="neutral" onClick={openSearch} disabled={disabled}>
            {searchLabel}
          </Button>
        </div>
        <TextField
          aria-label={m.baseAddress ?? '기본 주소'}
          readOnly
          value={fullAddress}
          placeholder={m.baseAddressPlaceholder ?? `${searchLabel}을 눌러 주소를 고르세요`}
          error={error && !current.address}
          aria-required={required || undefined}
          fullWidth
          onClick={openSearch}
        />
        <TextField
          ref={detailRef}
          aria-label={m.detailAddress ?? '상세 주소'}
          value={current.detail}
          placeholder={detailPlaceholder}
          onChange={(event) => update({ ...current, detail: event.target.value })}
          autoComplete="address-line2"
          fullWidth
        />
        {helperText && (
          <p id={helperId} className={fieldStyles.helperText({ error })}>
            {helperText}
          </p>
        )}
        {name && (
          <>
            <input type="hidden" name={`${name}[zonecode]`} value={current.zonecode} />
            <input type="hidden" name={`${name}[address]`} value={fullAddress} />
            <input type="hidden" name={`${name}[detail]`} value={current.detail} />
          </>
        )}
        <Modal
          open={open}
          onOpenChange={setOpen}
          title={searchLabel}
          description={m.addressSearchDescription ?? '도로명, 건물명, 지번으로 검색할 수 있어요.'}
          onCloseAutoFocus={(event) => {
            // 주소를 골랐으면 상세 주소 입력창으로, 그냥 닫았으면 원래 버튼으로 포커스를 보낸다
            if (selectedRef.current) {
              event.preventDefault();
              detailRef.current?.focus();
            }
          }}
        >
          <SearchArea
            provider={provider}
            onSelect={handleSelect}
            loadErrorText={loadErrorText}
            loadingText={m.addressLoading ?? '주소 검색을 불러오는 중'}
          />
        </Modal>
      </fieldset>
    );
  },
);
