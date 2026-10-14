import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { CloseIcon } from '../../icons';
import { usePortalClassName } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as styles from './Modal.css';

export interface ModalProps {
  /** 열림 상태 (제어 모드) */
  open?: boolean;
  /** 처음 열림 상태 (비제어 모드) */
  defaultOpen?: boolean;
  /** 열림 상태가 바뀔 때 호출된다 */
  onOpenChange?: (open: boolean) => void;
  /** 클릭하면 모달을 여는 요소. 버튼 등 포커스 가능한 요소 하나여야 한다 */
  trigger?: ReactNode;
  /** 제목 (스크린리더가 모달 이름으로 읽는다) */
  title: ReactNode;
  /** 제목 아래 설명 */
  description?: ReactNode;
  /** 본문 */
  children?: ReactNode;
  /** 하단 버튼 영역. 닫기 버튼은 ModalClose 로 감싼다 */
  footer?: ReactNode;
  /** 너비 */
  size?: 'sm' | 'md' | 'lg';
  /** 오른쪽 위 닫기(X) 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 바깥 영역 클릭으로 닫기 (기본 true) */
  closeOnOverlayClick?: boolean;
  /** 내용 영역 className */
  className?: string;
}

export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const portalClassName = usePortalClassName();

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={cx(portalClassName, styles.overlay)} />
        <Dialog.Content
          className={cx(portalClassName, styles.content({ size }), className)}
          onPointerDownOutside={closeOnOverlayClick ? undefined : (event) => event.preventDefault()}
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <div className={styles.header}>
            <div className={styles.headings}>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
            </div>
            {!hideCloseButton && (
              <Dialog.Close className={styles.closeButton} aria-label="닫기">
                <CloseIcon />
              </Dialog.Close>
            )}
          </div>
          {children && <div className={styles.body}>{children}</div>}
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * 감싼 요소를 클릭하면 모달이 닫힌다.
 * @example <ModalClose asChild><Button>취소</Button></ModalClose>
 */
export const ModalClose = Dialog.Close;
