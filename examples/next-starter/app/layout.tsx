import '@bestow-ui/react/styles.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'BestOW 스타터', template: '%s · BestOW 스타터' },
  description:
    '회원가입·본인 확인·정산 정보·로그인이 들어 있는 Next.js 템플릿(@bestow-ui/react + react-hook-form + zod)',
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
