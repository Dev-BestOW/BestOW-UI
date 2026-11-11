import type { MetadataRoute } from 'next';
import { guides } from './korean-utils/guides';
import { basePath, siteOrigin } from './links';

// 정적 export 로 out/sitemap.xml 을 만든다
export const dynamic = 'force-static';

/**
 * 검색 엔진에 제출하는 주소 목록(Search Console·네이버 서치어드바이저). 함수 문서는 guides 에서 만든다.
 * Storybook·playground 는 이 Next.js 앱 밖이라 주소를 직접 적는다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = `${siteOrigin}${basePath}`;
  const paths = [
    '/',
    '/korean-utils/',
    ...guides.map(({ slug }) => `/korean-utils/${slug}/`),
    '/storybook/',
    '/playground/',
    '/playground/signup/',
    '/playground/interactive/',
    '/playground/navigation/',
    '/playground/orders/',
  ];
  return paths.map((path) => ({ url: `${site}${path}` }));
}
