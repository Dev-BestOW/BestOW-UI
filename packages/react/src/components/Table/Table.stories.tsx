import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Checkbox } from '../Checkbox';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table';

interface Invoice {
  id: string;
  customer: string;
  status: '결제 완료' | '대기' | '환불';
  amount: number;
}

const invoices: Invoice[] = [
  { id: 'INV-001', customer: '김하늘', status: '결제 완료', amount: 125000 },
  { id: 'INV-002', customer: '이바다', status: '대기', amount: 48000 },
  { id: 'INV-003', customer: '박구름', status: '결제 완료', amount: 310000 },
  { id: 'INV-004', customer: '최별', status: '환불', amount: 22000 },
  { id: 'INV-005', customer: '정노을', status: '결제 완료', amount: 89000 },
];

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
const statusColor = { '결제 완료': 'success', 대기: 'warning', 환불: 'neutral' } as const;

function InvoiceRows({ rows }: { rows: Invoice[] }) {
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.id}</TableCell>
          <TableCell>{row.customer}</TableCell>
          <TableCell>
            <Badge color={statusColor[row.status]}>{row.status}</Badge>
          </TableCell>
          <TableCell align="right">{won(row.amount)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { caption: '최근 결제', size: 'md', striped: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    caption: { control: 'text' },
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>번호</TableHead>
          <TableHead>고객</TableHead>
          <TableHead>상태</TableHead>
          <TableHead align="right">금액</TableHead>
        </TableRow>
      </TableHeader>
      <InvoiceRows rows={invoices} />
      <TableFooter>
        <TableRow>
          <TableHead colSpan={3}>합계</TableHead>
          <TableCell align="right">{won(invoices.reduce((sum, r) => sum + r.amount, 0))}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Striped: Story = { args: { striped: true, size: 'sm' } };

type SortKey = 'customer' | 'amount';

function SortableTable() {
  const [sort, setSort] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
    key: 'amount',
    direction: 'descending',
  });
  const rows = useMemo(() => {
    const sorted = [...invoices].sort((a, b) =>
      sort.key === 'amount' ? a.amount - b.amount : a.customer.localeCompare(b.customer, 'ko'),
    );
    return sort.direction === 'ascending' ? sorted : sorted.reverse();
  }, [sort]);
  const toggle = (key: SortKey) =>
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  const directionOf = (key: SortKey) => (sort.key === key ? sort.direction : 'none');

  return (
    <Table caption="결제 내역 (머리 셀을 눌러 정렬)">
      <TableHeader>
        <TableRow>
          <TableHead>번호</TableHead>
          <TableHead sortDirection={directionOf('customer')} onSort={() => toggle('customer')}>
            고객
          </TableHead>
          <TableHead>상태</TableHead>
          <TableHead align="right" sortDirection={directionOf('amount')} onSort={() => toggle('amount')}>
            금액
          </TableHead>
        </TableRow>
      </TableHeader>
      <InvoiceRows rows={rows} />
    </Table>
  );
}

export const Sortable: Story = { name: '정렬', render: () => <SortableTable /> };

function SelectableTable() {
  const [selected, setSelected] = useState<string[]>(['INV-002']);
  const allChecked = selected.length === invoices.length;
  return (
    <Table aria-label="선택할 수 있는 결제 내역">
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: 48 }}>
            <Checkbox
              aria-label="모두 선택"
              checked={allChecked}
              indeterminate={!allChecked && selected.length > 0}
              onChange={() => setSelected(allChecked ? [] : invoices.map((r) => r.id))}
            />
          </TableHead>
          <TableHead>번호</TableHead>
          <TableHead>고객</TableHead>
          <TableHead align="right">금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => {
          const isSelected = selected.includes(row.id);
          return (
            <TableRow key={row.id} selected={isSelected}>
              <TableCell>
                <Checkbox
                  aria-label={`${row.id} 선택`}
                  checked={isSelected}
                  onChange={(event) =>
                    setSelected((prev) =>
                      event.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id),
                    )
                  }
                />
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell align="right">{won(row.amount)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const Selectable: Story = { name: '행 선택', render: () => <SelectableTable /> };

export const ScrollAndStickyHeader: Story = {
  name: '스크롤 · 머리 행 고정',
  render: () => (
    // 칸을 좁히는 대신 가로로 스크롤되게 표에 최소 너비를 준다
    <Table
      aria-label="많은 열과 행"
      stickyHeader
      size="sm"
      containerStyle={{ maxHeight: 240, maxWidth: 480 }}
      style={{ minWidth: 760 }}
    >
      <TableHeader>
        <TableRow>
          {['번호', '고객', '상태', '결제 수단', '요청일', '처리일', '담당자', '금액'].map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 12 }, (_, i) => invoices[i % invoices.length]!).map((row, i) => (
          <TableRow key={i}>
            <TableCell>{`${row.id}-${i}`}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>카드</TableCell>
            <TableCell>2026-10-0{(i % 9) + 1}</TableCell>
            <TableCell>2026-10-1{i % 9}</TableCell>
            <TableCell>운영팀</TableCell>
            <TableCell align="right">{won(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
