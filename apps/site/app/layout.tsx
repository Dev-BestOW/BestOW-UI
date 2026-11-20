import '@bestow-ui/react/styles.css';
import './site.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { Analytics } from './analytics';
import { basePath, siteOrigin } from './links';
import { Providers } from './providers';

// 검색 결과에 잘리지 않게 제목 40자·설명 80자 이내(seo.ts — 네이버 권장)
const title = 'BestOW UI — 한국 서비스용 접근성 검증 React UI';
const description =
  '전화번호·사업자등록번호·금액·주소·약관 동의 입력을 갖춘 React 디자인 시스템. KWCAG 2.2 근거, 대표색 하나로 테마.';

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
  // 네이버 웹마스터 가이드 "파비콘": href 는 절대 경로. app/icon.svg(파일 규칙)는 상대 경로로 나와서 public 으로 옮기고 여기서 적는다
  icons: { icon: { url: `${siteOrigin}${basePath}/icon.svg`, type: 'image/svg+xml' } },
  // 검색 엔진 소유 확인(Search Console). 지우면 확인이 풀린다 — 새 주소 https://bestow-ui.com/ 속성에 다른 값을 받으면 바꾼다(E2E landing 도)
  verification: { google: 'fjhHTSTn5cz8gnw_LCEgdNw4vawqPE4__ZqF4UQp9lo' },
};

/**
 * 옛 주소 넘겨주기 — 2026-11 까지 Pages 루트가 Storybook 이었다. README·npm·블로그·GeekNews 에 남은
 * `dev-bestow.github.io/BestOW-UI/?path=/docs/…` 링크는 GitHub 가 사용자 도메인 `bestow-ui.com/?path=…` 로 넘기고,
 * 이 스크립트가 같은 쿼리·해시 그대로 `/storybook/` 으로 보낸다.
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
