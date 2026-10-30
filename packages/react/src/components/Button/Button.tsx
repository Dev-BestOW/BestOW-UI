import {
  Children,
  cloneElement,
  forwardRef,
  version,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { Spinner } from '../Spinner/Spinner';
import * as styles from './Button.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 시각적 스타일 */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  /** 의미 색상 */
  color?: 'primary' | 'neutral' | 'danger';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 부모 너비를 꽉 채운다 */
  fullWidth?: boolean;
  /** 레이블 앞에 표시할 아이콘 */
  startIcon?: ReactNode;
  /** 레이블 뒤에 표시할 아이콘 */
  endIcon?: ReactNode;
  /**
   * 진행 중 상태. `startIcon` 자리에 스피너를 보여 주고 `aria-busy` 를 붙이며 클릭(폼 제출 포함)을 막는다.
   * `disabled` 와 달리 포커스는 유지된다.
   */
  loading?: boolean;
  /**
   * 자식 요소(라우터 링크 등)에 버튼 모양과 속성을 입혀 그대로 렌더링한다. 서버 컴포넌트에서도 쓸 수 있다.
   * 페이지를 이동하는 주요 동작에 쓰고, 자식은 요소 하나여야 한다.
   * `disabled` 면 `aria-disabled` 를 붙이고 Tab 순서에서 빼며 클릭을 막는다. 휠 클릭은 막지 못하니 링크는 되도록 비활성으로 두지 않는다.
   * @example <Button asChild><NextLink href="/signup">시작하기</NextLink></Button>
   */
  asChild?: boolean;
}

interface SlotChildProps {
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
}
type SlotChild = ReactElement<SlotChildProps> & { ref?: Ref<HTMLButtonElement> };

export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    color,
    size,
    fullWidth,
    startIcon,
    endIcon,
    loading,
    asChild,
    disabled,
    className,
    type = 'button',
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  const leading = loading ? <Spinner size="sm" label="" /> : startIcon;
  const buttonClassName = cx(styles.button({ variant, color, size, fullWidth }), className);
  const content = (label: ReactNode) => (
    <>
      {leading && <span className={styles.icon}>{leading}</span>}
      {label}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </>
  );

  // Radix Slot 을 쓰면 Button 하나가 1.2 kB 늘어 앱 전체가 부담한다 — 이 경우에 필요한 것만 직접 합친다
  if (asChild) {
    const child = Children.only(children) as SlotChild;
    const { props } = child;
    return cloneElement(
      child,
      {
        ...rest,
        ...props,
        className: cx(buttonClassName, props.className),
        style: { ...rest.style, ...props.style },
        // React 19 는 ref 가 props 에 있고, element.ref 를 읽으면 경고한다. 18 은 element.ref 에만 있다
        ref: mergeRefs(ref, parseInt(version) >= 19 ? props.ref : child.ref),
        tabIndex: disabled ? -1 : props.tabIndex,
        'aria-busy': loading || undefined,
        'aria-disabled': loading || disabled || undefined,
        'data-disabled': disabled ? '' : undefined,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          handleClick(event);
          if (!loading && !disabled) props.onClick?.(event);
        },
      } as SlotChildProps,
      content(props.children),
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={buttonClassName}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {content(children)}
    </button>
  );
});
