import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { XIcon } from '@bestow-ui/icons';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import { useReturnFocus } from '../../utils/useReturnFocus';
import { IconButton } from '../IconButton';
import * as styles from './Drawer.css';

export interface DrawerProps {
  /** 열림 상태 (제어 모드) */
  open?: boolean;
  /** 처음 열림 상태 (비제어 모드) */
  defaultOpen?: boolean;
  /** 열림 상태가 바뀔 때 호출된다 */
  onOpenChange?: (open: boolean) => void;
  /** 클릭하면 패널을 여는 요소. 버튼 등 포커스 가능한 요소 하나여야 한다 */
  trigger?: ReactNode;
  /** 제목 (스크린리더가 패널 이름으로 읽는다) */
  title: ReactNode;
  /** 제목 아래 설명 */
  description?: ReactNode;
  /** 본문. 길면 본문 영역만 스크롤된다 */
  children?: ReactNode;
  /** 하단 고정 버튼 영역. 닫기 버튼은 DrawerClose 로 감싼다 */
  footer?: ReactNode;
  /** 나타나는 방향 (기본 right) */
  side?: 'right' | 'left' | 'top' | 'bottom';
  /** 크기. 좌우는 너비 320/420/640px, 위아래는 높이 30/50/80vh */
  size?: 'sm' | 'md' | 'lg';
  /** 오른쪽 위 닫기(X) 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 바깥 영역 클릭으로 닫기 (기본 true) */
  closeOnOverlayClick?: boolean;
  /** 패널 className */
  className?: string;
}

/**
 * 화면 가장자리에서 밀려 나오는 패널(시트). 필터·상세 보기·모바일 메뉴 등에 쓴다.
 * Modal 과 같은 Radix Dialog 기반이라 포커스 가두기, Esc 로 닫기, 닫힌 뒤 trigger 로 포커스 복귀를 지원한다.
 */
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side,
  size,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  className,
}: DrawerProps) {
  const portal = usePortalProps();
  const focus = useReturnFocus(Boolean(trigger));

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={cx(portal.className, styles.overlay)} style={portal.style} />
        <Dialog.Content
          className={cx(portal.className, styles.content({ side, size }), className)}
          style={portal.style}
          data-side={side ?? 'right'}
          onPointerDownOutside={closeOnOverlayClick ? undefined : (event) => event.preventDefault()}
          onOpenAutoFocus={focus.onOpenAutoFocus}
          onCloseAutoFocus={focus.onCloseAutoFocus}
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <div className={styles.header}>
            <div className={styles.headings}>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
            </div>
            {!hideCloseButton && (
              <Dialog.Close asChild>
                <IconButton aria-label="닫기" size="sm" className={styles.closeButton}>
                  <XIcon />
                </IconButton>
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
 * 감싼 요소를 클릭하면 패널이 닫힌다.
 * @example <DrawerClose asChild><Button>취소</Button></DrawerClose>
 */
export const DrawerClose = Dialog.Close;
