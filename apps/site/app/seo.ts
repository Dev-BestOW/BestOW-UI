import type { Metadata } from 'next';
import { basePath } from './links';

/** 링크 미리보기 이미지 — public/og.png(scripts/generate-og.mjs). 하위 쪽은 openGraph 를 통째로 덮어쓰므로 쪽마다 다시 넣는다 */
const ogImage = {
  url: `${basePath}/og.png`,
  width: 1200,
  height: 630,
  alt: 'BestOW UI — 한국 서비스를 위한 접근성 검증 React 디자인 시스템. 회원가입 화면의 휴대폰 번호·약관 동의 입력',
};

/**
 * 하위 쪽의 제목·설명·canonical·링크 미리보기. `path` 는 basePath 뒤의 경로(예: '/korean-utils/phone-number/').
 * metadataBase(layout.tsx) 가 있어 상대 주소가 절대 주소로 바뀐다.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${basePath}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', siteName: 'BestOW UI', locale: 'ko_KR', url, title, description, images: [ogImage] },
    twitter: { card: 'summary_large_image' },
  };
}
