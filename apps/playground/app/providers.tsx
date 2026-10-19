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
  type ThemeName,
} from '@bestow-ui/react';
import { MoonIcon, SunIcon } from '@bestow-ui/icons';
import NextLink from 'next/link';
import { useState, type ReactNode } from 'react';

const purple = createTheme(createIntentColors('primary', '#7c3aed'), { common: { radius: { md: '12px' } } });

export function Providers({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeName>('light');
  const [branded, setBranded] = useState(false);

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
          </Stack>
          <Stack direction="row" gap={2}>
            <Button variant="outline" color="neutral" size="sm" onClick={() => setBranded((b) => !b)}>
              브랜드: {branded ? '보라' : '기본'}
            </Button>
            <IconButton
              size="sm"
              aria-label={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
              onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
            >
              {mode === 'light' ? <MoonIcon /> : <SunIcon />}
            </IconButton>
          </Stack>
        </Stack>
        <main id="main" style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
          {children}
        </main>
      </ToastProvider>
    </ThemeProvider>
  );
}
