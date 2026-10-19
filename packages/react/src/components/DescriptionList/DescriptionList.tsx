import { assignInlineVars } from '@vanilla-extract/dynamic';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './DescriptionList.css';

export interface DescriptionListItem {
  /** 이름 (dt) */
  term: ReactNode;
  /** 값 (dd) */
  description: ReactNode;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** 이름–값 목록 */
  items: DescriptionListItem[];
  /** horizontal(기본): 이름 왼쪽·값 오른쪽. vertical: 이름 위·값 아래(좁은 곳·긴 값) */
  layout?: 'horizontal' | 'vertical';
  /** horizontal 일 때 이름 열의 폭 (기본 30%) — 예: "8rem" */
  termWidth?: string;
  /** 항목 사이에 구분선 */
  divided?: boolean;
}

/**
 * 이름–값 목록(주문 상세의 고객·연락처·금액 등). `<dl>` 안에 항목마다 `<div><dt/><dd/></div>` 로 그려 스크린리더가 쌍으로 읽는다.
 * hook 이 없어 서버 컴포넌트로도 렌더링된다.
 */
export const DescriptionList = /* @__PURE__ */ forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList({ items, layout = 'horizontal', termWidth, divided, className, style, ...rest }, ref) {
    return (
      <dl
        ref={ref}
        className={cx(styles.root, className)}
        style={termWidth ? { ...assignInlineVars({ [styles.termWidth]: termWidth }), ...style } : style}
        {...rest}
      >
        {items.map((item, index) => (
          <div key={index} className={styles.item({ layout, divided })}>
            <dt className={styles.term}>{item.term}</dt>
            <dd className={styles.description}>{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
