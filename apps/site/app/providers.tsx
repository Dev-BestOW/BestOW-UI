'use client';

import {
  IconButton,
  Link,
  SkipLink,
  ThemeProvider,
  ToastProvider,
  Typography,
  useTheme,
  type ThemeMode,
} from '@bestow-ui/react';
import { MoonIcon, SunIcon } from '@bestow-ui/icons';
import { useEffect, useState, type ReactNode } from 'react';
import { basePath, links } from './links';

export function Providers({ children }: { children: ReactNode }) {
  // 처음에는 OS 설정을 따른다(서버 렌더링도 CSS 미디어쿼리로 그려 깜빡이지 않음). 토글을 누르면 그 모드로 고정
  const [mode, setMode] = useState<ThemeMode>('system');
  // hydration 이 끝났다는 표시 — E2E(fixtures.ts)가 page.goto 뒤에 기다린다
  useEffect(() => {
    document.documentElement.dataset.hydrated = '';
  }, []);

  return (
    <ThemeProvider theme={mode} className="site-root">
      <ToastProvider>
        <SkipLink />
        <header className="site-header">
          <div className="site-inner site-header-row">
            <a className="site-logo" href={`${basePath}/`}>
              {/* 장식용 — 이름은 옆 글자 */}
              <svg aria-hidden="true" viewBox="0 0 32 32" width="28" height="28">
                <rect width="32" height="32" rx="8" fill="var(--bestow-color-primary-solid)" />
                <path
                  d="M10 9h7.5a4.5 4.5 0 0 1 0 9H10zM10 18h8.5a4.5 4.5 0 0 1 0 9H10z"
                  fill="none"
                  stroke="var(--bestow-color-primary-contrast)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
              <Typography as="span" variant="h4">
                BestOW UI
              </Typography>
            </a>
            <nav aria-label="사이트" className="site-nav">
              <Link href={links.introduction} color="neutral" underline="hover">
                문서
              </Link>
              <Link href={links.playground} color="neutral" underline="hover">
                예제 앱
              </Link>
              <Link href={links.github} color="neutral" underline="hover">
                GitHub
              </Link>
              <ThemeToggle onChange={setMode} />
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="site-inner">
            <Typography variant="body-sm" color="muted">
              MIT 라이선스 © Dev-BestOW. 아이콘 그림은 Lucide 기반이라 ISC 예요.
            </Typography>
          </div>
        </footer>
      </ToastProvider>
    </ThemeProvider>
  );
}

/** 지금 보이는 모드(system 이면 OS 설정)의 반대로 바꾼다 */
function ThemeToggle({ onChange }: { onChange: (mode: ThemeMode) => void }) {
  const theme = useTheme();
  return (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      onClick={() => onChange(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}
