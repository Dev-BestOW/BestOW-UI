// 서버 컴포넌트: 'use client' 없이 디자인 시스템을 import 해서 렌더링되는지 확인한다.
import { Button, Stack, Typography } from '@bestow-ui/react';
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
    </Stack>
  );
}
