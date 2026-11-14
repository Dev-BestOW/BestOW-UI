'use client';

import { Container, Link, SkipLink, Stack, ThemeProvider, ToastProvider, Typography } from '@bestow-ui/react';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

// 대표색을 바꾸려면: const brand = createTheme(createIntentColors('primary', '#7c3aed'));
// 그리고 <ThemeProvider overrides={brand}> — 어떤 색을 골라도 글자 대비 4.5:1 을 맞춰 준다.

export function Providers({ children }: { children: ReactNode }) {
  return (
    // theme="system": OS 의 라이트·다크 설정을 따른다. 서버 렌더링도 CSS 미디어쿼리로 그려 첫 화면이 깜빡이지 않는다
    <ThemeProvider theme="system" style={{ minHeight: '100vh' }}>
      <ToastProvider>
        {/* 첫 Tab 에 나타나 머리글을 건너뛰고 본문(#main)으로 간다 */}
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
          <Link as={NextLink} href="/" underline="hover" color="neutral">
            <Typography as="span" variant="h4">
              BestOW 스타터
            </Typography>
          </Link>
          <Stack as="nav" aria-label="주 메뉴" direction="row" gap={4} wrap>
            <Link as={NextLink} href="/login" underline="hover">
              로그인
            </Link>
            <Link as={NextLink} href="/signup" underline="hover">
              회원가입
            </Link>
            <Link as={NextLink} href="/account" underline="hover">
              내 정보
            </Link>
          </Stack>
        </Stack>
        <Container as="main" id="main" size="sm" style={{ paddingBlock: 32 }}>
          {children}
        </Container>
      </ToastProvider>
    </ThemeProvider>
  );
}
