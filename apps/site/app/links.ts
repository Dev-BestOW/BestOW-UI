/** 사이트 경로(basePath) — next.config.ts 가 NEXT_PUBLIC_BASE_PATH 로 넘긴다 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** 배포 주소의 origin — 링크 미리보기(OG)는 절대 주소여야 한다 */
export const siteOrigin = 'https://dev-bestow.github.io';

/**
 * 같은 Pages 사이트의 Storybook 주소. Next.js 앱 밖이라 라우터 링크가 아닌 일반 링크로 연다.
 * `path` 는 Storybook 의 `?path=` 값(예: '/docs/introduction--docs').
 */
export function storybookHref(path?: string) {
  return `${basePath}/storybook/${path ? `?path=${path}` : ''}`;
}

export const links = {
  introduction: storybookHref('/docs/introduction--docs'),
  koreanKit: storybookHref('/docs/korean-kit-agreementgroup--docs'),
  kwcag: storybookHref('/docs/accessibility-kwcag-2-2-%EB%8C%80%EC%9D%91--docs'),
  themeBuilder: storybookHref('/story/foundations-theme-builder--builder'),
  choosing: storybookHref('/docs/guides-%EC%96%B8%EC%A0%9C-%EB%AC%B4%EC%97%87%EC%9D%84-%EC%93%B0%EB%82%98--docs'),
  playground: `${basePath}/playground/`,
  koreanUtils: `${basePath}/korean-utils/`,
  koreanUtilsNpm: 'https://www.npmjs.com/package/@bestow-ui/korean-utils',
  llms: `${basePath}/llms.txt`,
  github: 'https://github.com/Dev-BestOW/BestOW-UI',
  stackblitz: 'https://stackblitz.com/github/Dev-BestOW/BestOW-UI/tree/main/examples/vite-starter?file=src%2FApp.tsx',
  npm: 'https://www.npmjs.com/package/@bestow-ui/react',
};

/** 함수 문서 한 쪽의 주소 */
export function koreanUtilsHref(slug: string) {
  return `${basePath}/korean-utils/${slug}/`;
}
