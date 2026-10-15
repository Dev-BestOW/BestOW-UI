import * as RadixPopover from '@radix-ui/react-popover';
import { XIcon } from '@bestow-ui/icons';
import { useId, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as styles from './Popover.css';

export interface PopoverProps {
  /** 팝오버 내용 */
  content: ReactNode;
  /** 팝오버를 여는 요소. ref 를 받을 수 있는 요소 하나여야 한다 (보통 Button) */
  children: ReactElement;
  /** 제목. 팝오버(role="dialog")의 접근 가능한 이름이 된다 */
  title?: ReactNode;
  /** title 이 없을 때 스크린리더용 이름 */
  'aria-label'?: string;
  /** 오른쪽 위에 닫기(X) 버튼을 표시한다 */
  showClose?: boolean;
  /** 트리거를 가리키는 화살표를 표시한다 */
  showArrow?: boolean;
  /** 표시 방향 */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 정렬 */
  align?: 'start' | 'center' | 'end';
  /** 열림 상태 (제어 모드) */
  open?: boolean;
  /** 처음 열림 상태 (비제어 모드) */
  defaultOpen?: boolean;
  /** 열림 상태가 바뀔 때 호출된다 */
  onOpenChange?: (open: boolean) => void;
  /** true 이면 열려 있는 동안 바깥 요소와 상호작용할 수 없고 포커스가 팝오버 안에 갇힌다 */
  modal?: boolean;
  /** 팝오버 className */
  className?: string;
  /** 팝오버 style (너비 지정 등) */
  style?: CSSProperties;
}

export function Popover({
  content,
  children,
  title,
  'aria-label': ariaLabel,
  showClose = false,
  showArrow = false,
  side = 'bottom',
  align = 'center',
  open,
  defaultOpen,
  onOpenChange,
  modal,
  className,
  style,
}: PopoverProps) {
  const portal = usePortalProps();
  const titleId = useId();

  return (
    <RadixPopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : ariaLabel}
          className={cx(portal.className, styles.content, className)}
          style={{ ...portal.style, ...style }}
        >
          {(title || showClose) && (
            <div className={styles.header}>
              {title && (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              )}
              {showClose && (
                <RadixPopover.Close className={styles.closeButton} aria-label="닫기">
                  <XIcon size={16} />
                </RadixPopover.Close>
              )}
            </div>
          )}
          {content}
          {showArrow && <RadixPopover.Arrow className={styles.arrow} width={12} height={6} />}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

/**
 * 팝오버 내용 안에서 누르면 팝오버를 닫는 요소.
 * @example <PopoverClose asChild><Button>확인</Button></PopoverClose>
 */
export const PopoverClose = RadixPopover.Close;
