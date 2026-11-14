import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Pagination,
  SearchInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
  type BadgeProps,
  type TableHeadProps,
} from '@bestow-ui/react';

/**
 * Guides "TanStack Table 과 함께 쓰기"(TanStackTable.mdx)의 예시. 상태(정렬·검색·페이지·선택)는 TanStack Table 이,
 * 그리는 것은 BestOW 의 Table·Checkbox·SearchInput·Pagination 이 맡는다. 문서의 코드 조각은 이 파일에서 옮겼다 — 함께 고친다.
 */

// 열마다 정렬(숫자는 오른쪽) — TanStack 의 meta 에 타입을 붙인다
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: 'left' | 'center' | 'right';
  }
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: '결제 완료' | '배송 중' | '취소';
  date: string;
}

const CUSTOMERS = ['김민준', '이서연', '박지호', '최수아', '정예준', '강하은', '조도윤', '윤지우', '장시우', '임하린'];
const STATUSES: Order['status'][] = ['결제 완료', '배송 중', '취소'];
// 화면이 매번 같도록(시각 회귀) 무작위 대신 정해진 규칙으로 만든다
const ORDERS: Order[] = Array.from({ length: 37 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(3, '0')}`,
  customer: CUSTOMERS[(i * 7) % CUSTOMERS.length]!,
  amount: ((i * 37) % 23) * 4500 + 9900,
  status: STATUSES[(i * 5) % 3]!,
  date: `2026-11-${String(28 - (i % 28)).padStart(2, '0')}`,
}));

const STATUS_COLOR: Record<Order['status'], BadgeProps['color']> = {
  '결제 완료': 'success',
  '배송 중': 'info',
  취소: 'neutral',
};

const column = createColumnHelper<Order>();

// TanStack 의 'asc' | 'desc' | false → TableHead 의 sortDirection
const toSortDirection = (sorted: false | 'asc' | 'desc'): TableHeadProps['sortDirection'] =>
  sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';

function OrdersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo(
    () => [
      column.display({
        id: 'select',
        // 이 페이지만 모두 선택 — 일부만 고르면 혼합 상태(indeterminate)
        header: ({ table }) => (
          <Checkbox
            aria-label="이 페이지 모두 선택"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        // 행 체크박스 이름은 "ORD-001 선택" 처럼 행을 구분할 수 있게
        cell: ({ row }) => (
          <Checkbox
            aria-label={`${row.original.id} 선택`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      }),
      column.accessor('id', { header: '주문번호' }),
      column.accessor('customer', { header: '고객' }),
      column.accessor('amount', {
        header: '금액',
        cell: (info) => `${info.getValue().toLocaleString('ko-KR')}원`,
        meta: { align: 'right' },
      }),
      column.accessor('status', {
        header: '상태',
        cell: (info) => (
          <Badge color={STATUS_COLOR[info.getValue()]} variant="soft">
            {info.getValue()}
          </Badge>
        ),
      }),
      column.accessor('date', { header: '주문일' }),
    ],
    [],
  );

  // React Compiler 는 이 hook 이 돌려주는 함수를 메모이즈하지 못해 이 컴포넌트를 건너뛴다(TanStack Table v8 의 알려진 사항, 동작에는 문제없음)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: ORDERS,
    columns,
    state: { sorting, globalFilter, pagination, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    // 선택을 주문번호로 기억한다 — 기본값(원본 데이터의 순서)은 데이터를 다시 불러오면(서버 페이지·새로고침) 다른 행을 가리킨다
    getRowId: (row) => row.id,
    // TanStack 은 숫자 열을 처음 누르면 내림차순부터 — 모든 열을 오름차순부터로 맞춘다
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const total = table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const first = pagination.pageIndex * pagination.pageSize + 1;
  const last = first + rows.length - 1;
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3} align="end" wrap>
        <SearchInput
          label="주문 검색"
          placeholder="주문번호·고객 이름"
          value={globalFilter}
          onValueChange={setGlobalFilter}
        />
        {selectedCount > 0 && (
          <Button variant="outline" color="neutral" onClick={() => table.resetRowSelection()}>
            선택 해제
          </Button>
        )}
      </Stack>
      {/* 결과 수·선택 수는 처음부터 있는 status 영역에 — 바뀌면 스크린리더가 읽는다(포커스는 그대로) */}
      <Typography role="status" variant="body-sm" color="muted">
        {total === 0 ? '조건에 맞는 주문이 없어요.' : `${total}건 중 ${first}–${last}`}
        {selectedCount > 0 && ` · ${selectedCount}건 선택됨`}
      </Typography>

      <Table caption="주문 목록">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                // 정렬할 수 있는 열만 버튼이 되고 aria-sort 가 붙는다
                const sortProps = header.column.getCanSort()
                  ? {
                      sortDirection: toSortDirection(header.column.getIsSorted()),
                      onSort: () => header.column.toggleSorting(),
                    }
                  : {};
                return (
                  <TableHead key={header.id} align={header.column.columnDef.meta?.align} {...sortProps}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            // TableEmpty 는 행(tr)까지 그린다
            <TableEmpty colSpan={columns.length}>
              <EmptyState
                size="sm"
                titleAs="p"
                title="조건에 맞는 주문이 없어요."
                description="검색어를 바꾸거나 지워 보세요."
                action={
                  <Button variant="outline" color="neutral" onClick={() => setGlobalFilter('')}>
                    검색 지우기
                  </Button>
                }
              />
            </TableEmpty>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} align={cell.column.columnDef.meta?.align}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {table.getPageCount() > 1 && (
        <Pagination
          totalPages={table.getPageCount()}
          page={pagination.pageIndex + 1}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      )}
    </Stack>
  );
}

const meta = {
  title: 'Guides/TanStack Table 과 함께 쓰기',
  component: OrdersTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OrdersTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OrdersExample: Story = {
  name: '주문 목록 (정렬·검색·페이지·선택)',
};

/** 정렬 → 선택 → 다음 페이지 → 검색 → 결과 없음 → 검색 지우기. 선택이 주문번호로 유지되는지까지 확인한다 */
export const Interactions: Story = {
  name: '상호작용 확인',
  tags: ['no-visual'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('37건 중 1–10');
    // 선택 열은 정렬 버튼이 아니다(체크박스가 버튼 안에 들어가면 안 된다)
    await expect(canvas.getByRole('checkbox', { name: '이 페이지 모두 선택' }).closest('button')).toBeNull();

    // 금액 정렬: 오름차순 → aria-sort, 첫 행이 가장 싼 주문
    await userEvent.click(canvas.getByRole('button', { name: '금액' }));
    await expect(canvas.getByRole('columnheader', { name: '금액' })).toHaveAttribute('aria-sort', 'ascending');
    const firstAmount = canvas.getAllByRole('row')[1]!.querySelectorAll('td')[3]!.textContent;
    await expect(firstAmount).toBe('9,900원');

    // 이 페이지 모두 선택 → 10건, 다음 페이지에서는 혼합이 아닌 빈 상태
    await userEvent.click(canvas.getByRole('checkbox', { name: '이 페이지 모두 선택' }));
    await expect(status).toHaveTextContent('10건 선택됨');
    await userEvent.click(canvas.getByRole('button', { name: /^2/ }));
    await expect(status).toHaveTextContent('37건 중 11–20');
    await expect(canvas.getByRole('checkbox', { name: '이 페이지 모두 선택' })).not.toBeChecked();

    // 검색으로 결과가 바뀌면 첫 페이지로, 선택은 그대로
    await userEvent.type(canvas.getByRole('searchbox', { name: '주문 검색' }), '김민준');
    await waitFor(() => expect(status).toHaveTextContent(/^\d+건 중 1–\d+ · 10건 선택됨$/));

    await userEvent.clear(canvas.getByRole('searchbox', { name: '주문 검색' }));
    await userEvent.type(canvas.getByRole('searchbox', { name: '주문 검색' }), '없는 고객');
    await expect(status).toHaveTextContent('조건에 맞는 주문이 없어요.');
    await userEvent.click(canvas.getByRole('button', { name: '검색 지우기' }));
    await expect(status).toHaveTextContent('37건 중 1–10 · 10건 선택됨');
  },
};
