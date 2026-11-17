// 구조화 데이터(JSON-LD, schema.org) — 검색 엔진·AI 답변이 쪽이 무엇인지(저장소·글·이동 경로) 알게 한다.
// 계획: docs/SEO-GEO-PLAN.md Task 4. 주소는 canonical(seo.ts)과 같은 절대 주소로 만든다.
import { basePath, links, siteOrigin } from './links';

const context = 'https://schema.org';

/** basePath 뒤의 경로(예: '/components/') → 배포 주소 */
function absoluteUrl(path: string) {
  return `${siteOrigin}${basePath}${path}`;
}

/**
 * script 안에 넣을 JSON. 글자에 `</script>` 가 있으면 스크립트가 거기서 끊기므로 `<` 를 < 로 바꾼다
 * (JSON 문자열 안에서는 같은 글자라 JSON.parse 결과가 같다).
 */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** `<script type="application/ld+json">` — 서버 컴포넌트에서 그려 정적 HTML 에 들어간다 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

/** 첫 화면 — 라이브러리(저장소) 자체 */
export function softwareSourceCode() {
  return {
    '@context': context,
    '@type': 'SoftwareSourceCode',
    name: 'BestOW UI',
    description:
      '한국 서비스를 위한 접근성 검증 React 디자인 시스템. 전화번호·사업자등록번호·금액·주소 입력, 약관 동의, 인증번호 같은 한국 서비스 입력 컴포넌트와 서식·검증 함수.',
    url: absoluteUrl('/'),
    codeRepository: links.github,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    license: 'https://opensource.org/licenses/MIT',
  };
}

/** 글쓴이 — 저장소를 가진 GitHub 조직 */
const author = { '@type': 'Organization', name: 'Dev-BestOW', url: 'https://github.com/Dev-BestOW' };

/** 'YYYY-MM-DD' → 한국 시간 자정의 ISO 8601(시간대가 없으면 Google 은 Googlebot 시간대로 본다) */
function koreanDate(date: string) {
  return `${date}T00:00:00+09:00`;
}

/** 글의 날짜 — 데이터 파일(kit.ts·guides.ts·compare/data.ts)에 둔다. 글을 고치면 modified 를 그날로 */
export interface DocDates {
  /** 처음 배포한 날 'YYYY-MM-DD' */
  published: string;
  /** 글을 마지막으로 고친 날 'YYYY-MM-DD' */
  modified: string;
}

export interface Crumb {
  name: string;
  /** basePath 뒤의 경로 */
  path: string;
}

/** 화면의 Breadcrumb items — 마지막(지금 쪽)은 링크가 아니다. JSON-LD 와 같은 목록에서 만들어 어긋나지 않게 한다 */
export function breadcrumbItems(crumbs: Crumb[]) {
  return crumbs.map((crumb, index) =>
    index === crumbs.length - 1 ? { label: crumb.name } : { label: crumb.name, href: `${basePath}${crumb.path}` },
  );
}

/** 문서 쪽 — 글(TechArticle)과 이동 경로(BreadcrumbList). 이동 경로는 화면의 Breadcrumb 과 같은 항목으로 */
export function docArticle({
  path,
  title,
  description,
  crumbs,
  dates,
}: {
  path: string;
  title: string;
  description: string;
  crumbs: Crumb[];
  dates: DocDates;
}) {
  return [
    {
      '@context': context,
      '@type': 'TechArticle',
      headline: title,
      description,
      url: absoluteUrl(path),
      inLanguage: 'ko',
      // Google Article 권장 속성(없으면 리치 결과 테스트가 "심각하지 않은 문제" 로 알린다)
      image: absoluteUrl('/og.png'),
      author,
      datePublished: koreanDate(dates.published),
      dateModified: koreanDate(dates.modified),
    },
    {
      '@context': context,
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
  ] as const;
}
