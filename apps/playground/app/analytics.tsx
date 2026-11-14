import Script from 'next/script';

/**
 * 방문 통계 — Cloudflare Web Analytics(쿠키·로컬 저장소를 쓰지 않음, SECURITY.md "웹사이트 방문 통계").
 * 토큰은 배포 빌드에서만 GitHub 저장소 변수 CF_WEB_ANALYTICS_TOKEN 으로 들어온다(.github/workflows/storybook.yml).
 * 로컬·CI·E2E 빌드에는 토큰이 없어 스크립트를 넣지 않는다. Storybook 은 .storybook/main.ts, 소개 사이트는 apps/site/app/analytics.tsx(같은 내용).
 */
export function Analytics() {
  const token = process.env.CF_WEB_ANALYTICS_TOKEN;
  if (!token) return null;
  if (!/^[0-9a-f]{32}$/.test(token)) throw new Error('CF_WEB_ANALYTICS_TOKEN 형식이 아니에요(16진수 32자)');
  return (
    <Script
      id="cf-web-analytics"
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
