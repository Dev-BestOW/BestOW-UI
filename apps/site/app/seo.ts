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
 * 검색 결과 제목·설명 길이 — 네이버 서치어드바이저 권장(제목 40자, 설명 80자, OG 도 같음). 넘으면 잘려 보인다.
 * e2e/landing.spec.ts 가 모든 쪽을 검사한다. 화면의 h1·머리말은 길어도 되고, 메타만 짧게 둔다.
 */
export const titleLimit = 40;
export const descriptionLimit = 80;

/** 쪽 제목 — 사이트 이름(" — BestOW UI")은 40자 안에 들어갈 때만 붙인다 */
export function pageTitle(title: string) {
  const withSite = `${title} — BestOW UI`;
  return withSite.length <= titleLimit ? withSite : title;
}

/**
 * 하위 쪽의 제목·설명·canonical·링크 미리보기. `path` 는 basePath 뒤의 경로(예: '/korean-utils/phone-number/'),
 * `title` 은 사이트 이름 없이(pageTitle 이 붙인다), `description` 은 80자 이내.
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
  title = pageTitle(title);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', siteName: 'BestOW UI', locale: 'ko_KR', url, title, description, images: [ogImage] },
    twitter: { card: 'summary_large_image' },
  };
}
