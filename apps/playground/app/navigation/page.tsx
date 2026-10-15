'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Pagination,
  Popover,
  PopoverClose,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Typography,
  useToast,
} from '@bestow-ui/react';
import { CopyIcon, EllipsisIcon, PencilIcon, TrashIcon } from '@bestow-ui/icons';

const posts = Array.from({ length: 48 }, (_, i) => `게시글 ${i + 1}`);
const PAGE_SIZE = 5;

export default function NavigationPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<string>();

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Typography variant="h1">탐색·오버레이 페이지</Typography>
        <Typography color="muted">
          Tabs·DropdownMenu·Popover·Accordion·Pagination 을 확인해요. 메뉴와 팝오버는 portal 이라 테마를 따라가는지 함께 봐요.
        </Typography>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          Tabs
        </Typography>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList aria-label="계정 설정">
            <TabsTrigger value="account">계정</TabsTrigger>
            <TabsTrigger value="password">비밀번호</TabsTrigger>
            <TabsTrigger value="billing">결제</TabsTrigger>
          </TabsList>
          <TabsContent value="account">계정 탭 내용</TabsContent>
          <TabsContent value="password">비밀번호 탭 내용</TabsContent>
          <TabsContent value="billing">결제 탭 내용</TabsContent>
        </Tabs>
        <Typography variant="caption" color="muted">
          제어 모드(useState 초기값 없음) — 선택: {tab ?? '없음'}
        </Typography>
        <Tabs defaultValue="week" variant="soft" size="sm">
          <TabsList aria-label="기간">
            <TabsTrigger value="day">일</TabsTrigger>
            <TabsTrigger value="week">주</TabsTrigger>
            <TabsTrigger value="month">월</TabsTrigger>
          </TabsList>
        </Tabs>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          DropdownMenu · Popover
        </Typography>
        <Stack direction="row" gap={2} align="center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" color="neutral" aria-label="문서 메뉴">
                <EllipsisIcon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>문서</DropdownMenuLabel>
              <DropdownMenuItem icon={<PencilIcon size={16} />} shortcut="⌘E" onSelect={() => toast({ title: '편집' })}>
                편집
              </DropdownMenuItem>
              <DropdownMenuItem icon={<CopyIcon size={16} />} shortcut="⌘D" onSelect={() => toast({ title: '복제했어요' })}>
                복제
              </DropdownMenuItem>
              <DropdownMenuItem disabled>공유 (권한 없음)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon={<TrashIcon size={16} />}
                color="danger"
                onSelect={() => toast({ title: '삭제했어요', variant: 'danger' })}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover
            title="공유 설정"
            showClose
            content={
              <Stack gap={3}>
                <TextField label="이메일" type="email" fullWidth />
                <PopoverClose asChild>
                  <Button size="sm" onClick={() => toast({ title: '초대했어요', variant: 'success' })}>
                    초대
                  </Button>
                </PopoverClose>
              </Stack>
            }
          >
            <Button variant="outline">공유</Button>
          </Popover>

          <Popover aria-label="요금 안내" showArrow side="top" content="Pro 플랜은 사용자당 월 9,900원이에요.">
            <Button variant="ghost">요금</Button>
          </Popover>
        </Stack>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          Accordion
        </Typography>
        <Accordion type="single" collapsible style={{ maxWidth: 560 }}>
          <AccordionItem value="refund" title="환불은 어떻게 하나요?">
            결제 후 7일 이내라면 설정 &gt; 결제에서 바로 환불할 수 있어요.
          </AccordionItem>
          <AccordionItem value="plan" title="플랜을 바꿀 수 있나요?">
            언제든 바꿀 수 있어요. 남은 기간은 일할 계산해요.
          </AccordionItem>
          <AccordionItem value="beta" title="베타 기능 (준비 중)" disabled>
            준비 중이에요.
          </AccordionItem>
        </Accordion>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          Pagination
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((post) => (
            <li key={post}>
              <Typography variant="body-sm">{post}</Typography>
            </li>
          ))}
        </ul>
        <Pagination totalPages={Math.ceil(posts.length / PAGE_SIZE)} page={page} onPageChange={setPage} />
      </Stack>
    </Stack>
  );
}
