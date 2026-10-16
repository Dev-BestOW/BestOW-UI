import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { usePortalProps } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import * as styles from './DropdownMenu.css';

/** 메뉴 루트. `open`/`defaultOpen`/`onOpenChange`/`modal` 을 받는다 */
export const DropdownMenu = RadixMenu.Root;
export type DropdownMenuProps = ComponentPropsWithoutRef<typeof RadixMenu.Root>;

/** 메뉴를 여는 요소. 보통 `asChild` 로 Button 을 감싼다 */
export const DropdownMenuTrigger = RadixMenu.Trigger;
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<typeof RadixMenu.Trigger>;

/** 항목 묶음 (role="group") */
export const DropdownMenuGroup = RadixMenu.Group;

export interface DropdownMenuContentProps extends ComponentPropsWithoutRef<typeof RadixMenu.Content> {
  /** 트리거 기준 표시 방향 */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 정렬 */
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenuContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { className, style, side = 'bottom', align = 'start', sideOffset = 4, collisionPadding = 8, ...rest },
    ref,
  ) {
    const portal = usePortalProps();
    return (
      <RadixMenu.Portal>
        <RadixMenu.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cx(portal.className, styles.content, className)}
          style={{ ...portal.style, ...style }}
          {...rest}
        />
      </RadixMenu.Portal>
    );
  },
);

export interface DropdownMenuItemProps extends Omit<ComponentPropsWithoutRef<typeof RadixMenu.Item>, 'color'> {
  /** 텍스트 앞 아이콘 (장식용) */
  icon?: ReactNode;
  /** 오른쪽에 표시할 단축키 (예: "⌘K"). 표시용이라 항목 이름에는 포함되지 않는다 */
  shortcut?: string;
  /** danger 는 삭제처럼 되돌리기 어려운 동작 */
  color?: 'neutral' | 'danger';
}

export const DropdownMenuItem = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ icon, shortcut, color = 'neutral', className, children, ...rest }, ref) {
    return (
      <RadixMenu.Item ref={ref} className={cx(styles.item, color === 'danger' && styles.danger, className)} {...rest}>
        {icon && (
          <span className={styles.icon} aria-hidden>
            {icon}
          </span>
        )}
        {children}
        {shortcut && (
          <span className={styles.shortcut} aria-hidden>
            {shortcut}
          </span>
        )}
      </RadixMenu.Item>
    );
  },
);

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof RadixMenu.Label>;

/** 항목 묶음의 제목 (선택할 수 없음) */
export const DropdownMenuLabel = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...rest }, ref) {
    return <RadixMenu.Label ref={ref} className={cx(styles.label, className)} {...rest} />;
  },
);

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof RadixMenu.Separator>;

export const DropdownMenuSeparator = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...rest }, ref) {
    return <RadixMenu.Separator ref={ref} className={cx(styles.separator, className)} {...rest} />;
  },
);
