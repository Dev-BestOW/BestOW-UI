'use client';

import {
  Button,
  createIntentColors,
  createTheme,
  Stack,
  ThemeProvider,
  ToastProvider,
  Typography,
  type ThemeName,
} from '@bestow-ui/react';
import { MoonIcon, SunIcon } from '@bestow-ui/icons';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

// 디자인 시스템의 CSS 변수(--bestow-*)는 앱 코드에서도 그대로 쓸 수 있다.
const linkStyle = { color: 'var(--bestow-color-primary-text)', textDecoration: 'none', fontWeight: 500 };

const purple = createTheme(createIntentColors('primary', '#7c3aed'), { common: { radius: { md: '12px' } } });

export function Providers({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeName>('light');
  const [branded, setBranded] = useState(false);

  return (
    <ThemeProvider theme={mode} overrides={branded ? purple : undefined} style={{ minHeight: '100vh' }}>
      <ToastProvider>
        <Stack
          as="header"
          direction="row"
          align="center"
          justify="between"
          gap={4}
          style={{ padding: '16px 24px', borderBottom: '1px solid var(--bestow-color-border-default)' }}
        >
          <Stack direction="row" align="center" gap={4}>
            <Typography variant="h4" as="span">
              BestOW UI Playground
            </Typography>
            <Link href="/" style={linkStyle}>
              서버 컴포넌트
            </Link>
            <Link href="/interactive" style={linkStyle}>
              상호작용
            </Link>
            <Link href="/navigation" style={linkStyle}>
              탐색·오버레이
            </Link>
          </Stack>
          <Stack direction="row" gap={2}>
            <Button variant="outline" color="neutral" size="sm" onClick={() => setBranded((b) => !b)}>
              브랜드: {branded ? '보라' : '기본'}
            </Button>
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
              onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
            >
              {mode === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </Button>
          </Stack>
        </Stack>
        <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>{children}</main>
      </ToastProvider>
    </ThemeProvider>
  );
}
