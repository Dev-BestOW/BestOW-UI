import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, MinusIcon } from '@bestow-ui/icons';
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

export interface DropdownMenuCheckboxItemProps extends ComponentPropsWithoutRef<typeof RadixMenu.CheckboxItem> {
  /** 켜짐 여부. `'indeterminate'` 는 일부만 선택된 상태(− 표시) */
  checked?: boolean | 'indeterminate';
  /** 상태가 바뀔 때 */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * 켜고 끄는 항목 (role="menuitemcheckbox" + aria-checked). 기본으로 고르면 메뉴가 닫힌다 —
 * 여러 개를 이어서 바꾸게 하려면 `onSelect={(e) => e.preventDefault()}` 로 열어 둔다.
 */
export const DropdownMenuCheckboxItem = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem({ className, children, ...rest }, ref) {
    return (
      <RadixMenu.CheckboxItem ref={ref} className={cx(styles.item, className)} {...rest}>
        <span className={styles.indicator} aria-hidden>
          <RadixMenu.ItemIndicator className={styles.indicatorInner}>
            {rest.checked === 'indeterminate' ? <MinusIcon size={16} /> : <CheckIcon size={16} />}
          </RadixMenu.ItemIndicator>
        </span>
        {children}
      </RadixMenu.CheckboxItem>
    );
  },
);

/**
 * 하나만 고르는 항목 묶음 (role="group"). 안에 `DropdownMenuRadioItem` 을 둔다.
 * 선택 상태를 스스로 갖지 않는다 — 항상 `value` + `onValueChange` 로 제어한다.
 */
export const DropdownMenuRadioGroup = RadixMenu.RadioGroup;
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<typeof RadixMenu.RadioGroup>;

export interface DropdownMenuRadioItemProps extends ComponentPropsWithoutRef<typeof RadixMenu.RadioItem> {
  /** 이 항목을 고르면 RadioGroup 의 value 가 된다 */
  value: string;
}

/** 묶음 안에서 하나만 고르는 항목 (role="menuitemradio" + aria-checked) */
export const DropdownMenuRadioItem = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem({ className, children, ...rest }, ref) {
    return (
      <RadixMenu.RadioItem ref={ref} className={cx(styles.item, className)} {...rest}>
        <span className={styles.indicator} aria-hidden>
          <RadixMenu.ItemIndicator className={styles.indicatorInner}>
            <span className={styles.radioDot} />
          </RadixMenu.ItemIndicator>
        </span>
        {children}
      </RadixMenu.RadioItem>
    );
  },
);

/** 하위 메뉴 루트. `open`/`defaultOpen`/`onOpenChange` 를 받는다 */
export const DropdownMenuSub = RadixMenu.Sub;
export type DropdownMenuSubProps = ComponentPropsWithoutRef<typeof RadixMenu.Sub>;

export interface DropdownMenuSubTriggerProps extends ComponentPropsWithoutRef<typeof RadixMenu.SubTrigger> {
  /** 텍스트 앞 아이콘 (장식용) */
  icon?: ReactNode;
}

/** 하위 메뉴를 여는 항목. → 또는 Enter·Space 로 열고 ← 로 닫는다 (오른쪽 화살표 표시는 장식) */
export const DropdownMenuSubTrigger = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  function DropdownMenuSubTrigger({ icon, className, children, ...rest }, ref) {
    return (
      <RadixMenu.SubTrigger ref={ref} className={cx(styles.item, styles.subTrigger, className)} {...rest}>
        {icon && (
          <span className={styles.icon} aria-hidden>
            {icon}
          </span>
        )}
        {children}
        <span className={styles.subChevron} aria-hidden>
          <ChevronRightIcon size={16} />
        </span>
      </RadixMenu.SubTrigger>
    );
  },
);

export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<typeof RadixMenu.SubContent>;

/** 하위 메뉴 목록. 부모 메뉴처럼 portal 로 그리고 테마를 이어받는다 */
export const DropdownMenuSubContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  function DropdownMenuSubContent(
    { className, style, sideOffset = 4, alignOffset = -5, collisionPadding = 8, ...rest },
    ref,
  ) {
    const portal = usePortalProps();
    return (
      <RadixMenu.Portal>
        <RadixMenu.SubContent
          ref={ref}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={cx(portal.className, styles.content, className)}
          style={{ ...portal.style, ...style }}
          {...rest}
        />
      </RadixMenu.Portal>
    );
  },
);
