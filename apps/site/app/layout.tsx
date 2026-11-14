import '@bestow-ui/react/styles.css';
import './site.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { Analytics } from './analytics';
import { basePath, siteOrigin } from './links';
import { Providers } from './providers';

const title = 'BestOW UI — 한국 서비스를 위한 접근성 검증 React 디자인 시스템';
const description =
  '한국 서비스를 만들 때 바로 쓰는, 접근성이 검증된 React 디자인 시스템. 약관 동의·인증번호·전화번호·사업자등록번호·금액·주소 입력, KWCAG 2.2 대응 근거, 대표색 하나로 다크·브랜드 테마.';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title,
  description,
  alternates: { canonical: `${basePath}/` },
  openGraph: {
    type: 'website',
    siteName: 'BestOW UI',
    locale: 'ko_KR',
    url: `${basePath}/`,
    title,
    description:
      '약관 동의·인증번호·전화번호·사업자등록번호·금액·주소 입력을 기본으로. KWCAG 2.2 대응 근거, 대표색 하나로 다크·브랜드 테마.',
    // public/og.png — scripts/generate-og.mjs 가 만든다. Storybook·playground 도 이 이미지를 쓴다
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1200,
        height: 630,
        alt: 'BestOW UI — 한국 서비스를 위한 접근성 검증 React 디자인 시스템. 회원가입 화면의 휴대폰 번호·약관 동의 입력',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  // 검색 엔진 소유 확인(URL 접두어 속성 https://dev-bestow.github.io/BestOW-UI/). 지우면 확인이 풀린다
  verification: { google: 'fjhHTSTn5cz8gnw_LCEgdNw4vawqPE4__ZqF4UQp9lo' },
};

/**
 * 옛 주소 넘겨주기 — 2026-11 까지 Pages 루트가 Storybook 이었다. README·npm·블로그·GeekNews 에 남은
 * `…/BestOW-UI/?path=/docs/…` 링크를 같은 쿼리·해시 그대로 `…/BestOW-UI/storybook/` 로 보낸다.
 * 정적 호스팅이라 서버 리다이렉트가 없어 스크립트로 한다(e2e/redirect.spec.ts 가 확인).
 */
const redirectOldStorybookLinks = `(function(){var b=${JSON.stringify(basePath)};var p=location.pathname;if((p===b+'/'||p===b)&&/[?&](path|id|viewMode)=/.test(location.search)){location.replace(b+'/storybook/'+location.search+location.hash)}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Script id="old-storybook-links" strategy="beforeInteractive">
          {redirectOldStorybookLinks}
        </Script>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
