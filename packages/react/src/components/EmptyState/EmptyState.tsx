import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './EmptyState.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 — 무엇이 없는지 (예: "검색 결과가 없어요") */
  title: ReactNode;
  /** 설명 — 왜 없는지, 무엇을 하면 되는지 */
  description?: ReactNode;
  /** 위의 아이콘 (장식용 — 스크린리더에서 숨긴다) */
  icon?: ReactNode;
  /** 아래 행동 버튼들 (조건 초기화, 처음 만들기 등) */
  action?: ReactNode;
  /**
   * 제목 요소 — 기본 h3. 페이지 구조에 맞는 수준을 준다. 표 안(TableEmpty)이나 카드처럼 제목이 어울리지 않는 곳은 "p".
   */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  /** 크기 — sm 은 표·카드 안, md 는 페이지 본문 */
  size?: 'sm' | 'md';
}

/**
 * 보여 줄 것이 없을 때의 안내 (검색 결과 없음, 아직 만든 것 없음, 불러오기 실패 후 등).
 * hook 이 없는 표시용이라 서버 컴포넌트에서도 쓴다. 검색·필터로 결과가 바뀌어 나타나면 결과 수를 role="status" 로 따로 알린다.
 */
export const EmptyState = /* @__PURE__ */ forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, action, titleAs: Title = 'h3', size, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.root({ size }), className)} {...rest}>
      {icon && (
        <span className={styles.icon({ size })} aria-hidden>
          {icon}
        </span>
      )}
      <Title className={styles.title({ size })}>{title}</Title>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
});
