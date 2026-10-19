'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  Button,
  Checkbox,
  Drawer,
  DrawerClose,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Pagination,
  SegmentedControl,
  Stepper,
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
import NextLink from 'next/link';
import { CopyIcon, EllipsisIcon, FilterIcon, FolderIcon, PencilIcon, TrashIcon } from '@bestow-ui/icons';

const posts = Array.from({ length: 48 }, (_, i) => `게시글 ${i + 1}`);
const PAGE_SIZE = 5;

export default function NavigationPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<string>();
  const [sort, setSort] = useState('latest');
  const [showHidden, setShowHidden] = useState(false);
  const [showSize, setShowSize] = useState(true);
  const [density, setDensity] = useState('comfortable');
  const [signupStep, setSignupStep] = useState(0);

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Breadcrumb linkAs={NextLink} items={[{ label: '홈', href: '/' }, { label: '탐색·오버레이' }]} />
        <Typography variant="h1">탐색·오버레이 페이지</Typography>
        <Typography color="muted">
          Tabs·DropdownMenu·Popover·Drawer·Accordion·Pagination 을 확인해요. 메뉴와 팝오버는 portal 이라 테마를
          따라가는지 함께 봐요.
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
          <TabsContent value="day">오늘 통계</TabsContent>
          <TabsContent value="week">이번 주 통계</TabsContent>
          <TabsContent value="month">이번 달 통계</TabsContent>
        </Tabs>
        <Tabs defaultValue="profile" orientation="vertical" variant="soft" size="sm">
          <TabsList aria-label="설정 메뉴">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="security">보안·로그인</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">프로필 설정</TabsContent>
          <TabsContent value="notifications">알림 설정</TabsContent>
          <TabsContent value="security">보안·로그인 설정</TabsContent>
        </Tabs>
        {/* 아래 내용(패널)이 바뀌는 게 아니라 값을 고르는 것이면 Tabs 대신 SegmentedControl */}
        <SegmentedControl
          aria-label="정렬"
          options={[
            { value: 'latest', label: '최신순' },
            { value: 'popular', label: '인기순' },
            { value: 'price', label: '낮은 가격순' },
          ]}
          value={sort}
          onValueChange={setSort}
        />
        <Typography variant="caption" color="muted">
          정렬: {sort}
        </Typography>
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
              <DropdownMenuItem
                icon={<CopyIcon size={16} />}
                shortcut="⌘D"
                onSelect={() => toast({ title: '복제했어요' })}
              >
                복제
              </DropdownMenuItem>
              <DropdownMenuItem disabled>공유 (권한 없음)</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={<FolderIcon size={16} />}>이동</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => toast({ title: '받은 문서함으로 옮겼어요' })}>
                    받은 문서함
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast({ title: '보관함으로 옮겼어요' })}>보관함</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon={<TrashIcon size={16} />}
                color="danger"
                onSelect={() => toast({ title: '삭제했어요', color: 'danger' })}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" color="neutral">
                보기 옵션
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>표시</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showHidden}
                onCheckedChange={setShowHidden}
                onSelect={(e) => e.preventDefault()}
              >
                숨긴 파일 표시
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showSize}
                onCheckedChange={setShowSize}
                onSelect={(e) => e.preventDefault()}
              >
                크기 열 표시
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>간격</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                <DropdownMenuRadioItem value="comfortable">넓게</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="compact">좁게</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover
            title="공유 설정"
            showClose
            content={
              <Stack gap={3}>
                <TextField label="이메일" type="email" fullWidth />
                <PopoverClose asChild>
                  <Button size="sm" onClick={() => toast({ title: '초대했어요', color: 'success' })}>
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
        <Typography variant="caption" color="muted">
          보기: 숨긴 파일 {showHidden ? '표시' : '숨김'} · 크기 열 {showSize ? '표시' : '숨김'} · 간격{' '}
          {density === 'compact' ? '좁게' : '넓게'}
        </Typography>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          Stepper
        </Typography>
        <Stepper
          aria-label="회원가입 단계"
          current={signupStep}
          steps={[{ label: '약관 동의' }, { label: '정보 입력' }, { label: '본인 인증' }, { label: '가입 완료' }]}
          style={{ maxWidth: 560 }}
        />
        <Stack direction="row" gap={2}>
          <Button
            variant="outline"
            color="neutral"
            disabled={signupStep === 0}
            onClick={() => setSignupStep((step) => step - 1)}
          >
            이전 단계
          </Button>
          <Button disabled={signupStep === 4} onClick={() => setSignupStep((step) => step + 1)}>
            다음 단계
          </Button>
        </Stack>
      </Stack>

      <Stack gap={3}>
        <Typography variant="h3" as="h2">
          Drawer
        </Typography>
        <Stack direction="row" gap={2}>
          <Drawer
            title="필터"
            description="조건을 고르고 적용을 누르세요."
            trigger={
              <Button variant="outline" color="neutral" startIcon={<FilterIcon size={16} />}>
                필터
              </Button>
            }
            footer={
              <>
                <DrawerClose asChild>
                  <Button variant="ghost" color="neutral">
                    취소
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button onClick={() => toast({ title: '필터를 적용했어요', color: 'success' })}>적용</Button>
                </DrawerClose>
              </>
            }
          >
            <Stack gap={3}>
              <Checkbox label="판매 중" defaultChecked />
              <Checkbox label="예약 중" />
              <Checkbox label="판매 완료" />
            </Stack>
          </Drawer>
          <Drawer
            side="bottom"
            size="sm"
            title="공유하기"
            trigger={
              <Button variant="outline" color="neutral">
                아래에서 열기
              </Button>
            }
          >
            <TextField label="링크" defaultValue="https://example.com/post/42" readOnly />
          </Drawer>
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
