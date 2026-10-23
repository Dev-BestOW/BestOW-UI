'use client';

import {
  Button,
  createIntentColors,
  createTheme,
  IconButton,
  Link,
  SkipLink,
  Stack,
  ThemeProvider,
  ToastProvider,
  Typography,
  useTheme,
  type ThemeMode,
} from '@bestow-ui/react';
import { MoonIcon, SunIcon } from '@bestow-ui/icons';
import NextLink from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

const purple = createTheme(createIntentColors('primary', '#7c3aed'), { common: { radius: { md: '12px' } } });

export function Providers({ children }: { children: ReactNode }) {
  // 처음에는 OS 설정을 따른다(서버 렌더링도 CSS 미디어쿼리로 그려 깜빡이지 않음). 토글을 누르면 그 모드로 고정
  const [mode, setMode] = useState<ThemeMode>('system');
  const [branded, setBranded] = useState(false);
  // hydration 이 끝났다는 표시 — E2E(fixtures.ts)가 page.goto 뒤에 기다린다. 그 전의 클릭·입력은 이벤트 핸들러가 없어 사라진다
  useEffect(() => {
    document.documentElement.dataset.hydrated = '';
  }, []);

  return (
    <ThemeProvider theme={mode} overrides={branded ? purple : undefined} style={{ minHeight: '100vh' }}>
      <ToastProvider>
        {/* 페이지 맨 앞: 첫 Tab 에 나타나 머리글·메뉴를 건너뛰고 본문(#main)으로 간다 */}
        <SkipLink />
        <Stack
          as="header"
          direction="row"
          align="center"
          justify="between"
          gap={4}
          wrap
          style={{ padding: '16px 24px', borderBottom: '1px solid var(--bestow-color-border-default)' }}
        >
          <Stack direction="row" align="center" gap={4} wrap>
            <Typography variant="h4" as="span">
              BestOW UI Playground
            </Typography>
            {/* 클라이언트 컴포넌트라 as 로 라우터 링크를 넘길 수 있다 (서버 컴포넌트에서는 asChild) */}
            <Link as={NextLink} href="/" underline="hover">
              서버 컴포넌트
            </Link>
            <Link as={NextLink} href="/interactive" underline="hover">
              상호작용
            </Link>
            <Link as={NextLink} href="/navigation" underline="hover">
              탐색·오버레이
            </Link>
            <Link as={NextLink} href="/orders" underline="hover">
              주문 관리
            </Link>
            <Link as={NextLink} href="/signup" underline="hover">
              회원가입
            </Link>
          </Stack>
          <Stack direction="row" gap={2}>
            <Button variant="outline" color="neutral" size="sm" onClick={() => setBranded((b) => !b)}>
              브랜드: {branded ? '보라' : '기본'}
            </Button>
            <ThemeToggle onChange={setMode} />
          </Stack>
        </Stack>
        <main id="main" style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
          {children}
        </main>
      </ToastProvider>
    </ThemeProvider>
  );
}

/** 지금 보이는 모드(system 이면 OS 설정)의 반대로 바꾼다. useTheme 은 ThemeProvider 안에서 불러야 해서 따로 둔다 */
function ThemeToggle({ onChange }: { onChange: (mode: ThemeMode) => void }) {
  const theme = useTheme();
  return (
    <IconButton
      size="sm"
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      onClick={() => onChange(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}
