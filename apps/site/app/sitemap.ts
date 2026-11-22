import type { MetadataRoute } from 'next';
import { kitPages } from './components/kit';
import { guides } from './korean-utils/guides';
import { basePath, siteOrigin } from './links';

// 정적 export 로 out/sitemap.xml 을 만든다
export const dynamic = 'force-static';

/**
 * 검색 엔진에 제출하는 주소 목록(Search Console·네이버 서치어드바이저). 함수 문서는 guides, 컴포넌트 문서는 kitPages 에서 만든다.
 * Storybook 은 이 Next.js 앱 밖이라 주소를 직접 적는다. playground 는 예제 앱(제목이 같은 쪽 여럿)이라 넣지 않는다 —
 * 네이버 웹마스터 가이드: 검색 대상이 아닌 데모·중복 쪽은 사이트맵에서 뺀다(playground 는 noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = `${siteOrigin}${basePath}`;
  const paths = [
    '/',
    '/korean-utils/',
    ...guides.map(({ slug }) => `/korean-utils/${slug}/`),
    '/components/',
    '/compare/',
    '/changelog/',
    ...kitPages.map(({ slug }) => `/components/${slug}/`),
    '/storybook/',
  ];
  return paths.map((path) => ({ url: `${site}${path}` }));
}
