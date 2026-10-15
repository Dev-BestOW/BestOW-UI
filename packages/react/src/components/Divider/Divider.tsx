import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Divider.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** 방향. vertical 은 flex 행 안에서 부모 높이를 채운다 */
  orientation?: 'horizontal' | 'vertical';
  /** 시각적 구분만 하고 의미가 없으면 true — 스크린리더에서 숨긴다 */
  decorative?: boolean;
  /**
   * 가운데에 표시할 텍스트 (예: "또는"). horizontal 에서만 쓴다.
   * separator 역할의 자식은 스크린리더가 읽지 않으므로, 텍스트가 있으면 선만 숨기고 텍스트는 읽히게 둔다.
   */
  children?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative, className, children, ...rest },
  ref,
) {
  if (children && orientation === 'horizontal') {
    return (
      <div ref={ref} className={cx(styles.labeled, className)} {...rest}>
        <span className={styles.line} aria-hidden />
        {children}
        <span className={styles.line} aria-hidden />
      </div>
    );
  }

  const a11y = decorative
    ? { role: 'none' }
    : { role: 'separator', 'aria-orientation': orientation === 'vertical' ? ('vertical' as const) : undefined };
  return <div ref={ref} className={cx(styles.divider({ orientation }), className)} {...a11y} {...rest} />;
});
