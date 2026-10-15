import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import * as styles from './Table.css';

type TableSize = 'sm' | 'md';

// 셀 여백(size)과 footer 여부를 하위 셀에 전달한다
const TableSizeContext = /* @__PURE__ */ createContext<TableSize>('md');
const TableSectionContext = /* @__PURE__ */ createContext<'header' | 'body' | 'footer'>('body');

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** 셀 여백 */
  size?: TableSize;
  /** 짝수 행 배경을 칠한다 */
  striped?: boolean;
  /** 세로로 스크롤할 때 머리 행을 위에 고정한다 (containerStyle 등으로 높이를 제한해 쓴다) */
  stickyHeader?: boolean;
  /** 표 위에 보이는 제목. 표의 이름이 되고, 스크롤 영역의 이름으로도 쓰인다 */
  caption?: ReactNode;
  /** caption 이 없을 때 표의 이름 (스크린리더용) */
  'aria-label'?: string;
  /** 바깥 스크롤 영역의 className (높이 제한 등) */
  containerClassName?: string;
  /** 바깥 스크롤 영역의 style */
  containerStyle?: CSSProperties;
}

/**
 * 데이터 표. 네이티브 `<table>` 에 스타일을 입힌다.
 * 표가 넘치면 바깥 영역이 스크롤되고, 키보드로도 스크롤할 수 있도록 그 영역이 포커스를 받는다.
 */
export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    size = 'md',
    striped,
    stickyHeader,
    caption,
    'aria-label': ariaLabel,
    containerClassName,
    containerStyle,
    className,
    children,
    ...rest
  },
  ref,
) {
  const captionId = useId();
  return (
    <TableSizeContext.Provider value={size}>
      <div
        className={cx(styles.container, containerClassName)}
        style={containerStyle}
        // 스크롤 영역은 키보드 사용자가 화살표로 스크롤할 수 있게 포커스를 받아야 한다 (axe: scrollable-region-focusable).
        // 이름 있는 region + tabIndex 는 WAI 권장 패턴이라 jsx-a11y 규칙을 이 줄만 끈다.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-labelledby={caption ? captionId : undefined}
        aria-label={caption ? undefined : ariaLabel}
      >
        <table
          ref={ref}
          className={cx(styles.table, striped && styles.striped, stickyHeader && styles.stickyHeader, className)}
          aria-label={caption ? undefined : ariaLabel}
          {...rest}
        >
          {caption && (
            <caption id={captionId} className={styles.caption}>
              {caption}
            </caption>
          )}
          {children}
        </table>
      </div>
    </TableSizeContext.Provider>
  );
});

export const TableHeader = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...rest }, ref) {
    return (
      <TableSectionContext.Provider value="header">
        <thead ref={ref} className={cx(styles.header, className)} {...rest} />
      </TableSectionContext.Provider>
    );
  },
);

export const TableBody = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...rest }, ref) {
    return (
      <TableSectionContext.Provider value="body">
        <tbody ref={ref} className={cx(styles.body, className)} {...rest} />
      </TableSectionContext.Provider>
    );
  },
);

export const TableFooter = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter({ className, ...rest }, ref) {
    return (
      <TableSectionContext.Provider value="footer">
        <tfoot ref={ref} className={cx(styles.footer, className)} {...rest} />
      </TableSectionContext.Provider>
    );
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** 선택된 행으로 강조한다 (`aria-selected` 는 grid 등 상호작용 표에서 직접 지정한다) */
  selected?: boolean;
}

export const TableRow = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, className, ...rest },
  ref,
) {
  return (
    <tr ref={ref} className={cx(styles.row, className)} data-state={selected ? 'selected' : undefined} {...rest} />
  );
});

type Align = 'left' | 'center' | 'right';

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** 정렬 */
  align?: Align;
  /**
   * 이 열의 정렬 상태. onSort 와 함께 주면 머리 셀이 정렬 버튼이 되고 `aria-sort` 를 붙인다.
   * 정렬되지 않은 열은 'none'.
   */
  sortDirection?: 'ascending' | 'descending' | 'none';
  /** 정렬 버튼을 눌렀을 때 호출된다. 다음 정렬 상태는 사용하는 쪽이 정한다 */
  onSort?: () => void;
}

export const TableHead = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { align, sortDirection, onSort, scope, className, children, ...rest },
  ref,
) {
  const size = useContext(TableSizeContext);
  const section = useContext(TableSectionContext);
  const sortable = onSort !== undefined;
  const direction = sortDirection ?? 'none';
  const SortIcon = direction === 'descending' ? ArrowDownIcon : ArrowUpIcon;

  return (
    <th
      ref={ref}
      // thead 안의 머리 셀은 열, tbody 안(행 제목)은 행을 가리킨다
      scope={scope ?? (section === 'header' ? 'col' : 'row')}
      aria-sort={sortable && direction !== 'none' ? direction : undefined}
      className={cx(
        styles.cell({ size, align }),
        section === 'header' ? styles.head : section === 'footer' ? styles.footerCell : undefined,
        className,
      )}
      {...rest}
    >
      {sortable ? (
        <button type="button" className={styles.sortButton} onClick={onSort}>
          {children}
          <SortIcon size={14} className={styles.sortIcon} data-active={direction !== 'none'} aria-hidden />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** 정렬 (숫자는 right 권장) */
  align?: Align;
}

export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, className, ...rest },
  ref,
) {
  const size = useContext(TableSizeContext);
  const section = useContext(TableSectionContext);
  return (
    <td
      ref={ref}
      className={cx(styles.cell({ size, align }), section === 'footer' && styles.footerCell, className)}
      {...rest}
    />
  );
});
