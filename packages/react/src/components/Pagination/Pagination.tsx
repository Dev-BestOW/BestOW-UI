import { ChevronLeftIcon, ChevronRightIcon } from '@bestow-ui/icons';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { getPaginationItems } from './getPaginationItems';
import * as styles from './Pagination.css';

type ItemType = 'previous' | 'next' | 'page';

const defaultItemLabel = (type: ItemType, page: number) =>
  type === 'previous' ? '이전 페이지' : type === 'next' ? '다음 페이지' : `${page} 페이지`;

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 전체 페이지 수. 1 미만이면 아무것도 렌더링하지 않는다 */
  totalPages: number;
  /** 현재 페이지, 1부터 (제어 모드) */
  page?: number;
  /** 처음 페이지 (비제어 모드, 기본 1) */
  defaultPage?: number;
  /** 페이지를 바꿀 때 호출된다 */
  onPageChange?: (page: number) => void;
  /** 현재 페이지 양옆에 항상 보일 페이지 수 (기본 1) */
  siblingCount?: number;
  /** 처음과 끝에 항상 보일 페이지 수 (기본 1) */
  boundaryCount?: number;
  /** 크기 */
  size?: 'sm' | 'md';
  /** 버튼의 스크린리더용 이름 (다국어 대응). 기본: "이전 페이지", "다음 페이지", "3 페이지" */
  getItemLabel?: (type: ItemType, page: number) => string;
}

export const Pagination = /* @__PURE__ */ forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    totalPages,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size,
    getItemLabel = defaultItemLabel,
    className,
    'aria-label': ariaLabel = '페이지 탐색',
    ...rest
  },
  ref,
) {
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  if (totalPages < 1) return null;

  const page = Math.min(Math.max(pageProp ?? uncontrolledPage, 1), totalPages);
  const goTo = (next: number) => {
    if (next === page || next < 1 || next > totalPages) return;
    if (pageProp === undefined) setUncontrolledPage(next);
    onPageChange?.(next);
  };
  const itemClass = styles.item({ size });

  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={itemClass}
            aria-label={getItemLabel('previous', page - 1)}
            disabled={page <= 1}
            onClick={() => goTo(page - 1)}
          >
            <ChevronLeftIcon size={16} />
          </button>
        </li>
        {getPaginationItems(page, totalPages, siblingCount, boundaryCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={itemClass}
                aria-label={getItemLabel('page', item)}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} aria-hidden className={cx(itemClass, styles.ellipsis)}>
              …
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={itemClass}
            aria-label={getItemLabel('next', page + 1)}
            disabled={page >= totalPages}
            onClick={() => goTo(page + 1)}
          >
            <ChevronRightIcon size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
});
