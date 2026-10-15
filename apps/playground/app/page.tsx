// 서버 컴포넌트: 'use client' 없이 디자인 시스템을 import 해서 렌더링되는지 확인한다.
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Stack, Typography } from '@bestow-ui/react';
import { BellIcon, CircleCheckIcon, SearchIcon, SettingsIcon, UserIcon } from '@bestow-ui/icons';

export default function ServerPage() {
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Typography variant="h1">서버 컴포넌트 페이지</Typography>
        <Typography color="muted">
          이 페이지는 서버 컴포넌트예요. Typography·Stack·Button 은 클라이언트 경계로, 아이콘은 서버에서 바로 렌더링돼요.
        </Typography>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3">아이콘 (서버 렌더링)</Typography>
        <Stack direction="row" gap={4} align="center">
          <SearchIcon />
          <BellIcon />
          <UserIcon />
          <SettingsIcon />
          <CircleCheckIcon title="완료" color="var(--bestow-color-success-text)" />
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3">서버에서 넘긴 아이콘을 받는 클라이언트 컴포넌트</Typography>
        <Stack direction="row" gap={2}>
          <Button startIcon={<SearchIcon size={16} />}>검색</Button>
          <Button variant="soft" endIcon={<BellIcon size={16} />}>
            알림
          </Button>
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3">Badge</Typography>
        {(['primary', 'neutral', 'danger', 'success'] as const).map((color) => (
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
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h3">Card</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {(['outline', 'elevated', 'soft'] as const).map((variant) => (
            <Card key={variant} variant={variant} as="article">
              <CardHeader>
                <Typography variant="h4">{variant}</Typography>
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
    </Stack>
  );
}
