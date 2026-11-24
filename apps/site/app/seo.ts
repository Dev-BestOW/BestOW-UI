import type { Metadata } from 'next';
import { basePath } from './links';

/**
 * 문서 쪽의 링크 미리보기 이미지 경로(basePath 뒤, 앞 `/` 없음) — '/components/amount-input/' → 'og/components-amount-input.png'.
 * 쪽마다 다른 이미지다(네이버: 여러 쪽에 되풀이되는 이미지는 대표 이미지로 쓰이지 않을 수 있음). scripts/generate-og.mjs 가 빌드된 쪽의
 * h1·이동 경로로 찍어 public/og/ 에 커밋한다 — 쪽을 더하거나 제목을 바꾸면 다시 실행(E2E 가 apps/site/og-manifest.json 과 h1 을 비교).
 * 첫 화면은 public/og.png(layout.tsx). 같은 규칙이 generate-og.mjs 의 ogImageFile 에도 있다.
 */
export function ogImagePath(path: string) {
  return `og/${path.replace(/^\/|\/$/g, '').replaceAll('/', '-')}.png`;
}

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
    // 하위 쪽은 openGraph 를 통째로 덮어쓰므로 이미지도 여기서 넣는다
    openGraph: {
      type: 'article',
      siteName: 'BestOW UI',
      locale: 'ko_KR',
      url,
      title,
      description,
      images: [{ url: `${basePath}/${ogImagePath(path)}`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image' },
  };
}
