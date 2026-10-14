import '@bestow-ui/react/styles.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'BestOW UI Playground',
  description: 'Next.js(App Router)에서 @bestow-ui/* 를 실제 설치한 것처럼 확인하는 예제 앱',
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
