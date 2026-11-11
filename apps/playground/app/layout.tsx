import '@bestow-ui/react/styles.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'BestOW UI Playground',
  description: 'Next.js(App Router)에서 @bestow-ui/* 를 실제 설치한 것처럼 확인하는 예제 앱',
  // 링크 미리보기 — 이미지는 Pages 루트(Storybook public)의 것을 함께 쓴다. 절대 주소여야 미리보기가 뜬다.
  openGraph: {
    type: 'website',
    siteName: 'BestOW UI',
    locale: 'ko_KR',
    title: 'BestOW UI Playground — 한국 서비스 화면 예제',
    description: '회원가입·주문 관리 등 한국 서비스 화면을 @bestow-ui/react 로 만든 Next.js(App Router) 예제 앱',
    images: [{ url: 'https://dev-bestow.github.io/BestOW-UI/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
