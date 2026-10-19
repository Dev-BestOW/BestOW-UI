import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card, CardBody } from '../Card';
import { Checkbox } from '../Checkbox';
import { TextField } from '../Input';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { VisuallyHidden } from '../VisuallyHidden';
import { useTableSelection } from './useTableSelection';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from './Table';

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

function ListPattern() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const selection = useTableSelection<string>();
  const rows = invoices.filter((row) => !query || row.customer.includes(query) || row.id.includes(query.toUpperCase()));
  const pageIds = rows.map((row) => row.id);
  return (
    <Stack gap={3} style={{ maxWidth: 560 }}>
      <Stack direction="row" gap={2} align="end" wrap>
        <TextField label="검색" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline" color="neutral" onClick={() => setLoading((v) => !v)}>
          {loading ? '불러오기 끝' : '불러오는 중 보기'}
        </Button>
      </Stack>
      {selection.selected.length > 0 && (
        <Card as="section" aria-label="선택한 결제">
          <CardBody>
            <Stack direction="row" gap={3} align="center" wrap>
              <Typography role="status">{selection.selected.length}건 선택됨</Typography>
              <Button size="sm" variant="ghost" color="neutral" onClick={selection.clear}>
                선택 해제
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}
      <Table aria-label="결제 내역" aria-busy={loading || undefined}>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 48 }}>
              <Checkbox aria-label="이 페이지 모두 선택" {...selection.selectAllProps(pageIds)} />
            </TableHead>
            <TableHead>번호</TableHead>
            <TableHead>고객</TableHead>
            <TableHead align="right">금액</TableHead>
            <TableHead style={{ width: 48 }}>
              <VisuallyHidden>상태</VisuallyHidden>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableSkeleton rows={3} columns={5} />
          ) : rows.length === 0 ? (
            <TableEmpty colSpan={5}>
              조건에 맞는 결제가 없어요.
              <Button size="sm" variant="outline" color="neutral" onClick={() => setQuery('')}>
                검색 초기화
              </Button>
            </TableEmpty>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} selected={selection.isSelected(row.id)}>
                <TableCell>
                  <Checkbox aria-label={`${row.id} 선택`} {...selection.rowProps(row.id)} />
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell align="right">{won(row.amount)}</TableCell>
                <TableCell>
                  <Badge color={statusColor[row.status]}>{row.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Typography variant="body-sm" color="muted" role="status">
        {loading ? '불러오는 중…' : `${rows.length}건`}
      </Typography>
    </Stack>
  );
}

/**
 * 목록 화면 패턴 — `useTableSelection`(이 페이지 모두 선택·혼합 상태·페이지 넘어 유지), 선택하면 나타나는 일괄 작업 바,
 * `TableEmpty`(결과 없음), `TableSkeleton` + `aria-busy`(불러오는 중), 결과 개수는 role="status" 로 알린다.
 * 실제 화면 예: 예제 앱의 [주문 관리](https://dev-bestow.github.io/BestOW-UI/playground/orders).
 */
export const ListPatternStory: Story = { name: '목록 화면 패턴', render: () => <ListPattern /> };
