import type { MetadataRoute } from 'next';
import { changelogDates } from './changelog/changelog';
import { compareDates } from './compare/data';
import { kitDatesFor, kitPages } from './components/kit';
import { guideDatesFor, guides } from './korean-utils/guides';
import { basePath, siteOrigin } from './links';

// 정적 export 로 out/sitemap.xml 을 만든다
export const dynamic = 'force-static';

/**
 * 검색 엔진에 제출하는 주소 목록(Search Console·네이버 서치어드바이저). 함수 문서는 guides, 컴포넌트 문서는 kitPages 에서 만든다.
 * Storybook 은 이 Next.js 앱 밖이라 주소를 직접 적는다. playground 는 예제 앱(제목이 같은 쪽 여럿)이라 넣지 않는다 —
 * 네이버 웹마스터 가이드: 검색 대상이 아닌 데모·중복 쪽은 사이트맵에서 뺀다(playground 는 noindex).
 *
 * lastmod 는 쪽 머리·JSON-LD 와 같은 "마지막 수정" 날짜가 있는 문서 쪽에만 단다 — 구글은 부정확한 lastmod 를 믿지 않으므로
 * 빌드한 날이 아니라 글을 실제로 고친 날이다. 배포 뒤 IndexNow(scripts/indexnow.mjs)가 이 값이 바뀐 주소만 검색엔진에 알린다.
 * 날짜가 없는 목록 쪽(첫 화면·/components/·/korean-utils/·/storybook/)은 lastmod 없이 둔다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = `${siteOrigin}${basePath}`;
  const pages: { path: string; modified?: string }[] = [
    { path: '/' },
    { path: '/korean-utils/' },
    ...guides.map((guide) => ({ path: `/korean-utils/${guide.slug}/`, modified: guideDatesFor(guide).modified })),
    { path: '/components/' },
    { path: '/compare/', modified: compareDates.modified },
    { path: '/changelog/', modified: changelogDates().modified },
    ...kitPages.map((page) => ({ path: `/components/${page.slug}/`, modified: kitDatesFor(page).modified })),
    { path: '/storybook/' },
  ];
  return pages.map(({ path, modified }) => ({
    url: `${site}${path}`,
    ...(modified ? { lastModified: modified } : {}),
  }));
}
