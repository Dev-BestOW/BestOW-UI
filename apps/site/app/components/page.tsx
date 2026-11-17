import { Breadcrumb, Link, Typography } from '@bestow-ui/react';
import reactPackage from '@bestow-ui/react/package.json';
import { CopyCommand } from '../CopyCommand';
import { basePath, componentHref, links } from '../links';
import { pageMetadata } from '../seo';
import { kitPages } from './kit';

const title = '한국 서비스 입력 컴포넌트';
const description = '전화·사업자번호·주민번호·카드·계좌·금액·주소·인증번호·약관 동의·달력 React 컴포넌트 13종 문서.';

export const metadata = pageMetadata({ path: '/components/', title, description });

export default function Page() {
  return (
    <div className="doc site-inner">
      <Breadcrumb items={[{ label: '홈', href: `${basePath}/` }, { label: '한국 입력 컴포넌트' }]} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          한국 서비스 입력 컴포넌트
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          가입·본인 확인·결제·정산 화면에서 매번 직접 만들던 입력 칸이에요. 서식을 넣어도 커서가 제자리에 있고, 검증
          결과는 스크린리더에도 알리고, 모든 쪽에서 직접 입력해 볼 수 있어요.
        </Typography>
        <CopyCommand command="npm install @bestow-ui/react" />
        <Typography variant="body-sm" color="muted">
          지금 버전은 {reactPackage.version} 이에요. MIT 라이선스 · <Link href={links.npm}>npm</Link> ·{' '}
          <Link href={`${links.github}/tree/main/packages/react`}>소스</Link>
        </Typography>
      </header>

      <section aria-labelledby="list-title">
        <Typography id="list-title" as="h2" variant="h2" className="doc-section-title">
          컴포넌트 목록
        </Typography>
        <ul className="guide-list">
          {kitPages.map((page) => (
            <li key={page.slug}>
              <Link href={componentHref(page.slug)} className="guide-link">
                {page.title}
              </Link>
              <Typography variant="body-sm" color="muted">
                <code className="doc-inline-code">{page.name}</code> · {page.summary}
              </Typography>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="more-title">
        <Typography id="more-title" as="h2" variant="h2" className="doc-section-title">
          더 보기
        </Typography>
        <Typography className="doc-text">
          서식·검증만 필요하면 React 없이 쓰는 <Link href={links.koreanUtils}>서식·검증 함수</Link>가 있어요. 나머지
          컴포넌트(버튼·모달·표 등)는 <Link href={links.introduction}>Storybook</Link> 에서 직접 조작해 볼 수 있어요.
        </Typography>
      </section>
    </div>
  );
}
