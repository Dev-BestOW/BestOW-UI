import { Breadcrumb, Link, Typography } from '@bestow-ui/react';
import utilsPackage from '@bestow-ui/korean-utils/package.json';
import { CopyCommand } from '../CopyCommand';
import { basePath, koreanUtilsHref, links } from '../links';
import { pageMetadata } from '../seo';
import { guides } from './guides';

const title = '한국 서비스 서식·검증 함수 — @bestow-ui/korean-utils';
const description =
  '전화번호 하이픈, 사업자등록번호·법인등록번호 검증 공식, 주민등록번호 생년월일 읽기, 카드번호 Luhn, 은행 코드, 금액 한글 읽기, 마스킹. 의존성 없는 함수 모음이라 React 없이도 써요.';

export const metadata = pageMetadata({ path: '/korean-utils/', title, description });

export default function Page() {
  return (
    <div className="doc site-inner">
      <Breadcrumb items={[{ label: '홈', href: `${basePath}/` }, { label: '서식·검증 함수' }]} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          한국 서비스 서식·검증 함수
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          매번 검색해서 복사하던 전화번호 하이픈, 사업자등록번호 검증 공식, 주민등록번호 읽기, 마스킹을 함수로 모았어요.
          의존성이 없어 React·Vue·Svelte·Node 서버 어디서나 쓰고, 쓰는 함수만 번들에 들어가요(전체 약 2 kB).
        </Typography>
        <CopyCommand command="npm install @bestow-ui/korean-utils" />
        <Typography variant="body-sm" color="muted">
          지금 버전은 {utilsPackage.version} 이에요. MIT 라이선스 · <Link href={links.koreanUtilsNpm}>npm</Link> ·{' '}
          <Link href={`${links.github}/tree/main/packages/korean-utils`}>소스</Link>
        </Typography>
      </header>

      <section aria-labelledby="guides-title">
        <Typography id="guides-title" as="h2" variant="h2" className="doc-section-title">
          무엇을 하려고 하나요
        </Typography>
        <ul className="guide-list">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={koreanUtilsHref(guide.slug)} className="guide-link">
                {guide.title}
              </Link>
              <Typography variant="body-sm" color="muted">
                {guide.summary}
              </Typography>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="react-title">
        <Typography id="react-title" as="h2" variant="h2" className="doc-section-title">
          입력 칸까지 필요하면
        </Typography>
        <Typography className="doc-text">
          React 를 쓴다면 이 함수들로 만든 입력 컴포넌트가 <Link href={links.npm}>@bestow-ui/react</Link> 에 있어요.
          커서 위치·하이픈 뒤 Backspace·스크린리더 알림까지 처리했고, 접근성 검사를 통과해야 배포돼요.{' '}
          <Link href={links.koreanKit}>한국 서비스 키트 문서 보기</Link>
        </Typography>
      </section>
    </div>
  );
}
