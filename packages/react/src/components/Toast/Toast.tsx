import * as RadixToast from '@radix-ui/react-toast';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { XIcon } from '@bestow-ui/icons';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import * as styles from './Toast.css';
import { useMessages } from '../../i18n/LocaleProvider';

export type ToastColor = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

export interface ToastOptions {
  /** 제목 */
  title: ReactNode;
  /** 설명 */
  description?: ReactNode;
  /** 의미 색상 (기본 neutral) — Alert·Badge 의 `color` 와 같은 이름 */
  color?: ToastColor;
  /** 자동으로 닫히기까지 시간(ms). Infinity 면 자동으로 닫히지 않는다 */
  duration?: number;
  /** 실행 버튼 */
  action?: {
    label: string;
    onClick: () => void;
    /** 스크린리더용 대체 설명 (예: "실행 취소하려면 Ctrl+Z") */
    altText?: string;
  };
}

interface ToastItem extends ToastOptions {
  id: number;
  open: boolean;
}

export interface ToastContextValue {
  /** 토스트를 띄우고 id 를 반환한다 */
  toast: (options: ToastOptions) => number;
  /** id 의 토스트를 닫는다. id 가 없으면 모두 닫는다 */
  dismiss: (id?: number) => void;
}

const REMOVE_DELAY = 500;

const ToastContext = /* @__PURE__ */ createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** 기본 표시 시간(ms) */
  duration?: number;
  /** 스크린리더가 토스트 영역을 읽을 때 쓰는 이름 */
  label?: string;
}

/** 앱 최상단(ThemeProvider 안쪽)에 한 번 감싸고, 하위에서 useToast() 로 토스트를 띄운다. */
export function ToastProvider({ children, duration = 5000, label: labelProp }: ToastProviderProps) {
  const m = useMessages();
  const label = labelProp ?? m.notifications ?? '알림';
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const portal = usePortalProps();

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { ...options, id, open: true }]);
    return id;
  }, []);

  const dismiss = useCallback((id?: number) => {
    const isTarget = (t: ToastItem) => id === undefined || t.id === id;
    setToasts((prev) => prev.map((t) => (isTarget(t) ? { ...t, open: false } : t)));
    // 닫힘 애니메이션이 끝날 시간을 준 뒤 목록에서 제거한다.
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.open || !isTarget(t))), REMOVE_DELAY);
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider duration={duration} label={label} swipeDirection="right">
        {children}
        {toasts.map(({ id, open, title, description, color, duration: itemDuration, action }) => (
          <RadixToast.Root
            key={id}
            open={open}
            duration={itemDuration}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) dismiss(id);
            }}
            className={styles.toast({ color })}
          >
            <RadixToast.Title className={styles.title}>{title}</RadixToast.Title>
            {description && (
              <RadixToast.Description className={styles.description}>{description}</RadixToast.Description>
            )}
            {action && (
              <RadixToast.Action asChild altText={action.altText ?? action.label} className={styles.action}>
                <Button size="sm" variant="soft" color="neutral" onClick={action.onClick}>
                  {action.label}
                </Button>
              </RadixToast.Action>
            )}
            <RadixToast.Close className={styles.close} aria-label={m.close ?? '닫기'}>
              <XIcon size={16} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={cx(portal.className, styles.viewport)} style={portal.style} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast 는 ToastProvider 안에서 사용해야 합니다.');
  return context;
}
