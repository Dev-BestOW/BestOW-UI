'use client';

// 파일럿(ROADMAP P14-1): 실제 서비스에서 흔한 "주문 관리" 관리자 화면을 디자인 시스템만으로 만든다.
// 목록(검색·필터·정렬·선택·일괄 작업·페이지) → 상세(Drawer) → 등록(Modal 폼, 검증·오류 요약).
// 만들면서 막힌 점·직접 짜야 했던 부분은 docs/PILOT-FINDINGS.md 에 모은다.
import { useMemo, useState, type FormEvent } from 'react';
import {
  AmountInput,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  DescriptionList,
  DatePicker,
  Divider,
  Drawer,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ErrorSummary,
  IconButton,
  Modal,
  NumberInput,
  Pagination,
  PhoneNumberInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  Textarea,
  Typography,
  VisuallyHidden,
  formatKoreanAmount,
  formatPhoneNumber,
  useToast,
} from '@bestow-ui/react';
import { EllipsisIcon, PlusIcon, SearchIcon } from '@bestow-ui/icons';

type Status = 'paid' | 'shipping' | 'delivered' | 'cancelled';
interface Order {
  id: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  amount: number;
  status: Status;
  orderedAt: string; // YYYY-MM-DD
  memo?: string;
}

const STATUS: Record<Status, { label: string; color: 'primary' | 'warning' | 'success' | 'neutral' }> = {
  paid: { label: '결제 완료', color: 'primary' },
  shipping: { label: '배송 중', color: 'warning' },
  delivered: { label: '배송 완료', color: 'success' },
  cancelled: { label: '취소', color: 'neutral' },
};
const PRODUCTS = ['무선 이어폰', '보조 배터리', '노트북 거치대', '기계식 키보드', '모니터 받침대'];
const CUSTOMERS = ['김하늘', '이바다', '박구름', '최별', '정노을', '한솔', '윤슬', '서준'];
const STATUSES = Object.keys(STATUS) as Status[];

// 예제 데이터 — 서버 렌더링과 브라우저가 같은 값이 되도록 무작위 대신 규칙으로 만든다
const INITIAL: Order[] = Array.from({ length: 37 }, (_, i) => ({
  id: `ORD-${String(2400 + i).padStart(5, '0')}`,
  customer: CUSTOMERS[i % CUSTOMERS.length]!,
  phone: `0101234${String(1000 + i).slice(-4)}`,
  product: PRODUCTS[i % PRODUCTS.length]!,
  quantity: (i % 3) + 1,
  amount: (((i * 7919) % 90) + 10) * 1000,
  status: STATUSES[i % STATUSES.length]!,
  orderedAt: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
}));

const PAGE_SIZE = 10;
type SortKey = 'orderedAt' | 'amount';

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(INITIAL);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [sort, setSort] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
    key: 'orderedAt',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim();
    const list = orders.filter(
      (o) =>
        (status === 'all' || o.status === status) &&
        (!q || o.id.includes(q.toUpperCase()) || o.customer.includes(q) || o.product.includes(q)),
    );
    const sign = sort.direction === 'ascending' ? 1 : -1;
    return [...list].sort((a, b) =>
      sort.key === 'amount' ? (a.amount - b.amount) * sign : a.orderedAt.localeCompare(b.orderedAt) * sign,
    );
  }, [orders, query, status, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = pageRows.map((o) => o.id);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someOnPage = pageIds.some((id) => selected.includes(id));

  const sortBy = (key: SortKey) =>
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'descending' ? 'ascending' : 'descending',
    }));
  const sortDirection = (key: SortKey) => (sort.key === key ? sort.direction : 'none');

  const cancelOrders = (ids: string[]) => {
    setOrders((prev) => prev.map((o) => (ids.includes(o.id) ? { ...o, status: 'cancelled' } : o)));
    setSelected([]);
    toast({ title: `주문 ${ids.length}건을 취소했어요`, color: 'danger' });
  };

  return (
    <Stack gap={6}>
      <Stack direction="row" justify="between" align="center" gap={3} wrap>
        <Stack gap={1}>
          <Typography variant="h1">주문 관리</Typography>
          <Typography color="muted">
            전체 {orders.length}건 · 검색·필터·정렬하고, 여러 건을 골라 한 번에 처리해요.
          </Typography>
        </Stack>
        <Button startIcon={<PlusIcon size={16} />} onClick={() => setCreating(true)}>
          주문 등록
        </Button>
      </Stack>

      <Stack as="section" aria-label="검색·필터" direction="row" gap={3} align="end" wrap>
        <TextField
          label="검색"
          placeholder="주문번호·고객·상품"
          startAdornment={<SearchIcon size={16} />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          label="상태"
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[{ value: 'all', label: '전체' }, ...STATUSES.map((s) => ({ value: s, label: STATUS[s].label }))]}
        />
      </Stack>

      {selected.length > 0 && (
        <Card as="section" aria-label="선택한 주문">
          <CardBody>
            <Stack direction="row" gap={3} align="center" wrap>
              <Typography role="status">{selected.length}건 선택됨</Typography>
              <Button size="sm" variant="outline" color="danger" onClick={() => cancelOrders(selected)}>
                선택한 주문 취소
              </Button>
              <Button size="sm" variant="ghost" color="neutral" onClick={() => setSelected([])}>
                선택 해제
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}

      <Table aria-label="주문 목록" size="sm" containerStyle={{ maxWidth: '100%' }} style={{ minWidth: 720 }}>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 44 }}>
              <Checkbox
                aria-label="이 페이지 모두 선택"
                checked={allOnPage}
                indeterminate={!allOnPage && someOnPage}
                onChange={() =>
                  setSelected((prev) =>
                    allOnPage ? prev.filter((id) => !pageIds.includes(id)) : [...new Set([...prev, ...pageIds])],
                  )
                }
              />
            </TableHead>
            <TableHead>주문번호</TableHead>
            <TableHead>고객</TableHead>
            <TableHead>상품</TableHead>
            <TableHead>상태</TableHead>
            <TableHead sortDirection={sortDirection('orderedAt')} onSort={() => sortBy('orderedAt')}>
              주문일
            </TableHead>
            <TableHead align="right" sortDirection={sortDirection('amount')} onSort={() => sortBy('amount')}>
              금액
            </TableHead>
            <TableHead style={{ width: 56 }}>
              <VisuallyHidden>작업</VisuallyHidden>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Stack gap={2} align="center" style={{ padding: '24px 0' }}>
                  <Typography>조건에 맞는 주문이 없어요.</Typography>
                  <Button
                    size="sm"
                    variant="outline"
                    color="neutral"
                    onClick={() => {
                      setQuery('');
                      setStatus('all');
                    }}
                  >
                    검색·필터 초기화
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map((o) => {
              const isSelected = selected.includes(o.id);
              return (
                <TableRow key={o.id} selected={isSelected}>
                  <TableCell>
                    <Checkbox
                      aria-label={`${o.id} 선택`}
                      checked={isSelected}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, o.id] : prev.filter((id) => id !== o.id)))
                      }
                    />
                  </TableCell>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell>
                    <Badge color={STATUS[o.status].color} variant="soft">
                      {STATUS[o.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{o.orderedAt}</TableCell>
                  <TableCell align="right">{o.amount.toLocaleString('ko-KR')}원</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton size="sm" aria-label={`${o.id} 작업`}>
                          <EllipsisIcon />
                        </IconButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDetail(o)}>상세 보기</DropdownMenuItem>
                        <DropdownMenuItem
                          color="danger"
                          disabled={o.status === 'cancelled' || o.status === 'delivered'}
                          onSelect={() => cancelOrders([o.id])}
                        >
                          주문 취소
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Stack direction="row" justify="between" align="center" gap={3} wrap>
        <Typography variant="body-sm" color="muted" role="status">
          {filtered.length}건 중 {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)}
        </Typography>
        <Pagination totalPages={totalPages} page={Math.min(page, totalPages)} onPageChange={setPage} />
      </Stack>

      <Drawer
        title={detail ? `주문 ${detail.id}` : '주문'}
        open={detail !== null}
        onOpenChange={(open) => !open && setDetail(null)}
      >
        {detail && (
          <Stack gap={3}>
            <Badge color={STATUS[detail.status].color} variant="soft" style={{ alignSelf: 'start' }}>
              {STATUS[detail.status].label}
            </Badge>
            <Divider />
            <DescriptionList
              aria-label="주문 정보"
              termWidth="5rem"
              items={[
                { term: '고객', description: detail.customer },
                { term: '연락처', description: formatPhoneNumber(detail.phone) },
                { term: '상품', description: `${detail.product} × ${detail.quantity}` },
                {
                  term: '금액',
                  description: `${detail.amount.toLocaleString('ko-KR')}원 (${formatKoreanAmount(detail.amount)})`,
                },
                { term: '주문일', description: detail.orderedAt },
              ]}
            />
          </Stack>
        )}
      </Drawer>

      <OrderForm
        open={creating}
        onOpenChange={setCreating}
        onCreate={(order) => {
          setOrders((prev) => [order, ...prev]);
          setSort({ key: 'orderedAt', direction: 'descending' });
          setPage(1);
          toast({ title: `주문 ${order.id}을 등록했어요`, color: 'success' });
        }}
        nextId={`ORD-${String(2400 + orders.length).padStart(5, '0')}`}
      />
    </Stack>
  );
}

interface Draft {
  customer: string;
  phone: string;
  product: string;
  quantity: number | null;
  amount: number | null;
  deliveryDate: string;
  memo: string;
}
const EMPTY: Draft = { customer: '', phone: '', product: '', quantity: 1, amount: null, deliveryDate: '', memo: '' };
const FIELD_ID: Record<keyof Draft, string> = {
  customer: 'order-customer',
  phone: 'order-phone',
  product: 'order-product',
  quantity: 'order-quantity',
  amount: 'order-amount',
  deliveryDate: 'order-delivery-date',
  memo: 'order-memo',
};

function validate(d: Draft): Partial<Record<keyof Draft, string>> {
  const errors: Partial<Record<keyof Draft, string>> = {};
  if (!d.customer.trim()) errors.customer = '고객 이름을 입력해 주세요.';
  if (d.phone.length < 10) errors.phone = '연락처를 끝까지 입력해 주세요.';
  if (!d.product) errors.product = '상품을 골라 주세요.';
  if (!d.amount) errors.amount = '금액을 입력해 주세요.';
  return errors;
}

function OrderForm({
  open,
  onOpenChange,
  onCreate,
  nextId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (order: Order) => void;
  nextId: string;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const errorEntries = Object.entries(errors) as [keyof Draft, string][];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validate(draft);
    setErrors(next);
    setSubmitCount((count) => count + 1); // 다시 제출해도 오류가 남아 있으면 ErrorSummary 가 다시 포커스를 받는다
    if (Object.keys(next).length > 0) return;
    onCreate({
      id: nextId,
      customer: draft.customer.trim(),
      phone: draft.phone,
      product: draft.product,
      quantity: draft.quantity ?? 1,
      amount: draft.amount!,
      status: 'paid',
      orderedAt: draft.deliveryDate || '2026-10-28',
      memo: draft.memo,
    });
    setDraft(EMPTY);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Modal
      title="주문 등록"
      description="* 표시는 꼭 입력해야 해요."
      size="md"
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setErrors({});
      }}
      footer={
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost" color="neutral" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button type="submit" form="order-form">
            등록
          </Button>
        </Stack>
      }
    >
      <form id="order-form" noValidate onSubmit={submit}>
        <Stack gap={4}>
          <ErrorSummary
            errors={errorEntries.map(([key, message]) => ({ id: FIELD_ID[key], message }))}
            focusKey={submitCount}
          />
          <TextField
            id={FIELD_ID.customer}
            label="고객 이름"
            required
            fullWidth
            value={draft.customer}
            onChange={(e) => set('customer', e.target.value)}
            error={!!errors.customer}
            helperText={errors.customer}
          />
          <PhoneNumberInput
            id={FIELD_ID.phone}
            label="연락처"
            required
            fullWidth
            value={draft.phone}
            onValueChange={(v) => set('phone', v)}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <Select
            id={FIELD_ID.product}
            label="상품"
            required
            fullWidth
            placeholder="상품을 고르세요"
            value={draft.product}
            onValueChange={(v) => set('product', v)}
            options={PRODUCTS.map((p) => ({ value: p, label: p }))}
            error={!!errors.product}
            helperText={errors.product}
          />
          <Stack direction="row" gap={3} wrap>
            <NumberInput
              id={FIELD_ID.quantity}
              label="수량"
              unit="개"
              min={1}
              max={99}
              value={draft.quantity}
              onValueChange={(v) => set('quantity', v)}
            />
            <AmountInput
              id={FIELD_ID.amount}
              label="결제 금액"
              required
              value={draft.amount}
              onValueChange={(v) => set('amount', v)}
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Stack>
          <DatePicker
            id={FIELD_ID.deliveryDate}
            label="배송 희망일"
            fullWidth
            value={draft.deliveryDate}
            onValueChange={(v) => set('deliveryDate', v)}
          />
          <Textarea
            id={FIELD_ID.memo}
            label="메모"
            fullWidth
            autoResize
            rows={2}
            value={draft.memo}
            onChange={(e) => set('memo', e.target.value)}
          />
        </Stack>
      </form>
    </Modal>
  );
}
