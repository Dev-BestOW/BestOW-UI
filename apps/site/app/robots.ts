import type { MetadataRoute } from 'next';
import { basePath, siteOrigin } from './links';

// 정적 export 로 out/robots.txt 를 만든다
export const dynamic = 'force-static';

/**
 * 검색 엔진에 sitemap 위치를 알린다. robots.txt 는 호스트 루트에서만 읽혀서, 사용자 도메인(bestow-ui.com)으로
 * 옮기기 전(dev-bestow.github.io/BestOW-UI/)에는 둘 수 없었다. 막는 경로는 없다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteOrigin}${basePath}/sitemap.xml`,
  };
}
