import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ReactElement, ReactNode } from 'react';
import { usePortalClassName } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as styles from './Tooltip.css';

export interface TooltipProps {
  /** 툴팁 내용 */
  content: ReactNode;
  /** 툴팁을 띄울 요소. ref 를 받을 수 있는 요소 하나여야 한다 */
  children: ReactElement;
  /** 표시 방향 */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 정렬 */
  align?: 'start' | 'center' | 'end';
  /** 마우스를 올린 뒤 표시까지 지연 시간(ms) */
  delay?: number;
  /** 열림 상태 (제어 모드) */
  open?: boolean;
  /** 처음 열림 상태 (비제어 모드) */
  defaultOpen?: boolean;
  /** 열림 상태가 바뀔 때 호출된다 */
  onOpenChange?: (open: boolean) => void;
  /** true 이면 툴팁을 띄우지 않고 children 만 렌더링한다 */
  disabled?: boolean;
  /** 툴팁 className */
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
}: TooltipProps) {
  const portalClassName = usePortalClassName();

  if (disabled || content == null || content === '') return children;

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={6}
            collisionPadding={8}
            className={cx(portalClassName, styles.content, className)}
          >
            {content}
            <RadixTooltip.Arrow className={styles.arrow} width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
