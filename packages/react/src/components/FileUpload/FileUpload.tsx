import { forwardRef, useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { FileIcon, UploadIcon, XIcon } from '@bestow-ui/icons';
import { useMessages } from '../../i18n/LocaleProvider';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import * as fieldStyles from '../Input/Input.css';
import * as styles from './FileUpload.css';

export type FileRejectionReason = 'type' | 'size' | 'count';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

export interface FileUploadProps {
  /** 선택한 파일 (제어 모드) */
  value?: File[];
  /** 처음 파일 (비제어 모드) */
  defaultValue?: File[];
  /** 선택한 파일이 바뀔 때 (조건에 맞는 파일만) */
  onValueChange?: (files: File[]) => void;
  /** 조건(accept·maxSize·maxFiles)에 맞지 않아 빠진 파일. 이유는 화면에도 보여 준다 */
  onReject?: (rejections: FileRejection[]) => void;
  /** 받을 형식 — input accept 와 같다 (예: ".pdf,image/*") */
  accept?: string;
  /** 여러 개 선택 (기본 false — 새로 고르면 바꾼다) */
  multiple?: boolean;
  /** 파일 하나의 최대 크기 (바이트) */
  maxSize?: number;
  /** 최대 개수 (multiple 일 때) */
  maxFiles?: number;
  /** 위에 표시할 레이블 */
  label?: ReactNode;
  /** 아래 도움말 (받는 형식·크기 안내 등). error 일 때는 에러 메시지로 표시된다 */
  helperText?: ReactNode;
  /** 에러 상태 */
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** form 제출 시 사용할 이름 — 네이티브 input 의 files 를 맞춰 두어 그대로 제출된다 */
  name?: string;
  id?: string;
  /** 바깥 래퍼 className */
  className?: string;
}

/**
 * 삭제 알림을 포커스를 옮긴 뒤 이만큼 늦게 넣는다 (ms). 같은 순간에 넣으면 VoiceOver 가 새 포커스(다음 삭제 버튼)를 읽으며
 * 알림을 버렸다(스크린리더 수동 점검 2026-10-21).
 */
const REMOVED_ANNOUNCE_DELAY = 500;

/** 1000 이 아니라 1024 단위 — 운영체제 파일 크기 표시와 맞춘다 */
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** input accept 규칙: ".pdf"(확장자) · "image/*"(종류) · "application/pdf"(MIME) */
function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) =>
      token.startsWith('.')
        ? name.endsWith(token)
        : token.endsWith('/*')
          ? type.startsWith(token.slice(0, -1))
          : type === token,
    );
}

/** value 가 없을 때 쓰는 빈 목록 — 렌더마다 새 배열을 만들면 files 에 걸린 effect 가 매번 다시 돈다 */
const NO_FILES: File[] = [];
const sameFile = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

/**
 * 파일 첨부. "파일 선택" 버튼(또는 끌어다 놓기)으로 고르고, 선택한 파일을 이름·크기·삭제 버튼 목록으로 보여 준다.
 * 끌어다 놓기는 덤이고 버튼으로 모두 할 수 있다(KWCAG 2.5.7). 조건에 맞지 않는 파일은 이유를 보여 주고 스크린리더에 알린다.
 * 업로드(서버 전송)는 하지 않는다 — onValueChange 로 받은 File 을 직접 보낸다.
 */
export const FileUpload = /* @__PURE__ */ forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(props, ref) {
  const {
    value,
    defaultValue,
    onValueChange,
    onReject,
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    label,
    helperText,
    error,
    required,
    disabled,
    name,
    id,
    className,
  } = props;
  const m = useMessages();
  const isControlled = 'value' in props;
  const [innerFiles, setInnerFiles] = useState<File[]>(defaultValue ?? []);
  const files = isControlled ? (value ?? NO_FILES) : innerFiles;
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [dragging, setDragging] = useState(false);
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = label ? `${baseId}-label` : undefined;
  const helperId = helperText ? `${baseId}-helper` : undefined;
  const errorsId = rejections.length > 0 ? `${baseId}-errors` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusAfterRemove = useRef<number | null>(null);
  const announceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(announceTimer.current), []);

  const selectLabel = m.fileSelect ?? '파일 선택';
  const reasonText = (rejection: FileRejection) => {
    const fileName = rejection.file.name;
    if (rejection.reason === 'size')
      return (
        m.fileTooLarge?.(fileName, formatSize(maxSize ?? 0)) ??
        `${fileName}: ${formatSize(maxSize ?? 0)} 이하만 올릴 수 있어요.`
      );
    if (rejection.reason === 'type') return m.fileTypeNotAllowed?.(fileName) ?? `${fileName}: 올릴 수 없는 형식이에요.`;
    return m.fileTooMany?.(maxFiles ?? 0) ?? `파일은 ${maxFiles}개까지 올릴 수 있어요.`;
  };

  const announce = (message: string, delay = 0) => {
    clearTimeout(announceTimer.current);
    if (delay === 0) return setAnnouncement(message);
    setAnnouncement('');
    announceTimer.current = setTimeout(() => setAnnouncement(message), delay);
  };

  const commit = (next: File[], message: string, delay = 0) => {
    if (!isControlled) setInnerFiles(next);
    onValueChange?.(next);
    announce(message, delay);
  };

  const addFiles = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const base = multiple ? files : [];
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type' });
      else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
      else if (!multiple && accepted.length >= 1) rejected.push({ file, reason: 'count' });
      else if (maxFiles !== undefined && base.length + accepted.length >= maxFiles)
        rejected.push({ file, reason: 'count' });
      else if (![...base, ...accepted].some((existing) => sameFile(existing, file))) accepted.push(file);
    }
    setRejections(rejected);
    if (rejected.length > 0) onReject?.(rejected);
    const next = [...base, ...accepted];
    const summary = m.filesSelected?.(next.length) ?? `파일 ${next.length}개 선택됨`;
    const errors = [...new Set(rejected.map(reasonText))].join(' ');
    if (accepted.length > 0) commit(next, [summary, errors].filter(Boolean).join(' '));
    else announce(errors);
  };

  const removeAt = (index: number) => {
    const removed = files[index]!;
    const next = files.filter((_, i) => i !== index);
    // 지운 자리의 다음 삭제 버튼(없으면 앞, 그것도 없으면 "파일 선택")으로 포커스를 옮긴다
    focusAfterRemove.current = Math.min(index, next.length - 1);
    setRejections([]);
    commit(next, m.fileRemoved?.(removed.name) ?? `${removed.name} 삭제됨`, REMOVED_ANNOUNCE_DELAY);
  };

  useEffect(() => {
    if (focusAfterRemove.current === null) return;
    const target = focusAfterRemove.current;
    focusAfterRemove.current = null;
    (target >= 0 ? removeButtonRefs.current[target] : selectButtonRef.current)?.focus();
  }, [files]);

  // form 제출용: 네이티브 input 의 files 를 지금 목록과 맞춘다 (DataTransfer 가 없는 오래된 환경에서는 건너뜀)
  useEffect(() => {
    const input = inputRef.current;
    if (!name || !input || typeof DataTransfer === 'undefined') return;
    try {
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    } catch {
      // 일부 테스트 환경(jsdom)에는 DataTransfer 생성자가 없거나 files 를 바꿀 수 없다
    }
  }, [files, name]);

  const onDrag = (event: DragEvent<HTMLDivElement>, over: boolean) => {
    if (disabled) return;
    event.preventDefault();
    setDragging(over);
  };

  return (
    <div ref={ref} className={cx(fieldStyles.field, styles.root, className)}>
      {label && (
        <span id={labelId} className={fieldStyles.label}>
          {label}
          {required && (
            <span className={fieldStyles.requiredMark} aria-hidden>
              *
            </span>
          )}
        </span>
      )}
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={cx(helperId, errorsId) || undefined}
        className={styles.dropzone}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        data-invalid={error || rejections.length > 0 || undefined}
        onDragEnter={(event) => onDrag(event, true)}
        onDragOver={(event) => onDrag(event, true)}
        onDragLeave={(event) => {
          // 안쪽 요소로 옮겨 갈 때는 유지한다
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          onDrag(event, false);
          if (!disabled) addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <span className={styles.dropIcon} aria-hidden>
          <UploadIcon size={24} />
        </span>
        <Button
          ref={selectButtonRef}
          type="button"
          variant="outline"
          color="neutral"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {selectLabel}
        </Button>
        <span className={styles.dropHint}>{m.fileDropHint ?? '또는 여기로 끌어다 놓으세요'}</span>
        <input
          ref={inputRef}
          type="file"
          id={baseId}
          name={name}
          accept={accept}
          multiple={multiple}
          required={required && files.length === 0}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          className={visuallyHidden}
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            // 같은 파일을 지운 뒤 다시 고를 수 있게 비운다 (name 이 있으면 위 effect 가 다시 채운다)
            if (!name) event.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <ul aria-label={m.fileList ?? '선택한 파일'} className={styles.list}>
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.item}>
              <span className={styles.fileIcon} aria-hidden>
                <FileIcon size={16} />
              </span>
              <span className={styles.fileName}>{file.name}</span>
              {/* 크기는 삭제 버튼의 설명으로도 잇는다 — Tab 은 삭제 버튼에만 가서 크기를 들을 수 없었다 */}
              <span id={`${baseId}-size-${index}`} className={styles.fileSize}>
                {formatSize(file.size)}
              </span>
              <IconButton
                ref={(node) => {
                  removeButtonRefs.current[index] = node;
                }}
                size="sm"
                aria-label={m.fileRemove?.(file.name) ?? `${file.name} 삭제`}
                aria-describedby={`${baseId}-size-${index}`}
                disabled={disabled}
                onClick={() => removeAt(index)}
              >
                <XIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      {rejections.length > 0 && (
        <ul id={errorsId} className={styles.errors}>
          {/* "개수 초과" 처럼 여러 파일이 같은 이유면 한 번만 */}
          {[...new Set(rejections.map(reasonText))].map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
      {helperText && (
        <p id={helperId} className={fieldStyles.helperText({ error })}>
          {helperText}
        </p>
      )}
      <div role="status" className={visuallyHidden}>
        {announcement}
      </div>
    </div>
  );
});
