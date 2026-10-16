// 서버 컴포넌트: 'use client' 없이 디자인 시스템을 import 해서 렌더링되는지 확인한다.
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  createIntentColors,
  createTheme,
  Divider,
  formatKoreanAmount,
  formatKoreanDate,
  formatPhoneNumber,
  Link,
  parseISODate,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ThemeProvider,
  Typography,
  vars,
} from '@bestow-ui/react';
import NextLink from 'next/link';
import { BellIcon, CircleCheckIcon, SearchIcon, SettingsIcon, TriangleAlertIcon, UserIcon } from '@bestow-ui/icons';

// 외부 요청 없이 이미지 로딩을 확인하기 위한 data URI
const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#7c3aed"/><circle cx="32" cy="26" r="11" fill="#fff"/><path d="M12 60c2-12 10-18 20-18s18 6 20 18" fill="#fff"/></svg>',
  );

export default function ServerPage() {
  // 함수·값은 "use client" 가 아닌 파일로 배포돼 서버 컴포넌트에서 바로 부를 수 있다 (안 되면 이 페이지 빌드가 실패한다)
  const greenTheme = createTheme(createIntentColors('primary', '#059669'));
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '예제', href: '/' }, { label: '서버 컴포넌트' }]} />
        <Typography variant="h1">서버 컴포넌트 페이지</Typography>
        <Typography color="muted">
          이 페이지는 서버 컴포넌트예요. Typography·Stack·Button 은 클라이언트 경계로, 아이콘은 서버에서 바로
          렌더링돼요.
        </Typography>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          아이콘 (서버 렌더링)
        </Typography>
        <Stack direction="row" gap={4} align="center">
          <SearchIcon />
          <BellIcon />
          <UserIcon />
          <SettingsIcon />
          <CircleCheckIcon title="완료" color="var(--bestow-color-success-text)" />
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          서버에서 넘긴 아이콘을 받는 클라이언트 컴포넌트
        </Typography>
        <Stack direction="row" gap={2}>
          <Button startIcon={<SearchIcon size={16} />}>검색</Button>
          <Button variant="soft" endIcon={<BellIcon size={16} />}>
            알림
          </Button>
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          서버에서 부르는 함수·값
        </Typography>
        <Typography>
          {formatKoreanAmount(1250000)} · {formatPhoneNumber('01012345678')} ·{' '}
          {formatKoreanDate(parseISODate('2026-10-16')!)}
        </Typography>
        <ThemeProvider overrides={greenTheme} style={{ background: 'transparent' }}>
          <Stack direction="row" gap={2} align="center">
            <Button>서버에서 만든 브랜드 테마</Button>
            <span style={{ color: vars.color.primary.text }}>vars 로 칠한 글자</span>
          </Stack>
        </ThemeProvider>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Badge
        </Typography>
        {(['primary', 'neutral', 'danger', 'success', 'warning'] as const).map((color) => (
          <Stack key={color} direction="row" gap={2} align="center">
            {(['solid', 'soft', 'outline'] as const).map((variant) => (
              <Badge key={variant} color={color} variant={variant}>
                {color} {variant}
              </Badge>
            ))}
          </Stack>
        ))}
        <Stack direction="row" gap={2} align="center">
          <Badge size="sm">sm</Badge>
          <Badge size="md">md</Badge>
          <Badge size="lg">lg</Badge>
          <Badge color="success" startIcon={<CircleCheckIcon size={12} />}>
            배포 완료
          </Badge>
          <Badge color="warning" startIcon={<TriangleAlertIcon size={12} />}>
            점검 예정
          </Badge>
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Table
        </Typography>
        <Table caption="최근 결제" size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>고객</TableHead>
              <TableHead>상태</TableHead>
              <TableHead align="right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['INV-001', '김하늘', '결제 완료', 125000],
              ['INV-002', '이바다', '대기', 48000],
              ['INV-003', '박구름', '결제 완료', 310000],
            ].map(([id, customer, status, amount]) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{customer}</TableCell>
                <TableCell>
                  <Badge color={status === '대기' ? 'warning' : 'success'}>{status}</Badge>
                </TableCell>
                <TableCell align="right">{amount.toLocaleString('ko-KR')}원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Link
        </Typography>
        <Typography>
          {/* 서버 컴포넌트에서는 함수(NextLink)를 prop 으로 넘길 수 없으므로 asChild 로 감싼다 */}
          다음으로{' '}
          <Link asChild>
            <NextLink href="/interactive">상호작용 페이지</NextLink>
          </Link>
          를 보거나{' '}
          <Link href="https://github.com/Dev-BestOW/BestOW-UI" external>
            GitHub 저장소
          </Link>
          를 열어 보세요.
        </Typography>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Alert
        </Typography>
        <Alert title="점검 안내">9월 30일 새벽 2시부터 4시까지 서비스 점검이 있어요.</Alert>
        <Alert color="warning" variant="outline" title="저장 공간이 부족해요">
          남은 공간이 10% 미만이에요.
        </Alert>
        <Alert color="danger" variant="solid" title="결제에 실패했어요">
          카드 정보를 확인한 뒤 다시 시도해 주세요.
        </Alert>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Card
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {(['outline', 'elevated', 'soft'] as const).map((variant) => (
            <Card key={variant} variant={variant} as="article">
              <CardHeader>
                <Typography variant="h4" as="h3">
                  {variant}
                </Typography>
                <Typography variant="body-sm" color="muted">
                  서버 컴포넌트에서 렌더링한 카드
                </Typography>
              </CardHeader>
              <CardBody>배경·테두리·여백이 테마를 따라가요.</CardBody>
              <CardFooter>
                <Button size="sm" variant="soft">
                  열기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Divider
        </Typography>
        <Stack direction="row" gap={3} align="center">
          <Typography variant="body-sm">프로필</Typography>
          <Divider orientation="vertical" />
          <Typography variant="body-sm">설정</Typography>
          <Divider orientation="vertical" />
          <Typography variant="body-sm">로그아웃</Typography>
        </Stack>
        <Divider />
        <Divider>또는</Divider>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3" as="h2">
          Avatar
        </Typography>
        <Stack direction="row" gap={3} align="center">
          <Avatar src={photo} name="Jane Doe" size="lg" />
          <Avatar src="/no-such-image.png" name="Jane Doe" size="lg" />
          <Avatar name="홍길동" size="lg" />
          <Avatar size="lg" />
          <Avatar src={photo} name="Jane Doe" shape="square" size="lg" />
          <Avatar name="Bestow UI" size="sm" />
          <Avatar name="Bestow UI" />
        </Stack>
      </Stack>
    </Stack>
  );
}
