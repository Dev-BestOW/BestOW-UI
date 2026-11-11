import { KOREAN_BANKS } from '@bestow-ui/korean-utils';
import {
  Breadcrumb,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@bestow-ui/react';
import { notFound } from 'next/navigation';
import { CopyCommand } from '../../CopyCommand';
import { basePath, koreanUtilsHref, links, storybookHref } from '../../links';
import { pageMetadata } from '../../seo';
import { findGuide, guides } from '../guides';
import { Try } from '../Try';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return pageMetadata({
    path: `/korean-utils/${guide.slug}/`,
    title: `${guide.title} — @bestow-ui/korean-utils`,
    description: guide.summary,
  });
}

export default async function Page({ params }: Props) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <article className="doc site-inner">
      <Breadcrumb
        items={[
          { label: '홈', href: `${basePath}/` },
          { label: '서식·검증 함수', href: links.koreanUtils },
          { label: guide.title },
        ]}
      />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          {guide.title}
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          {guide.summary}
        </Typography>
      </header>

      <section aria-labelledby="problem-title">
        <Typography id="problem-title" as="h2" variant="h2" className="doc-section-title">
          무엇이 어려운가요
        </Typography>
        {guide.problem.map((text) => (
          <Typography key={text} className="doc-text">
            {text}
          </Typography>
        ))}
      </section>

      <section aria-labelledby="try-title">
        <Typography id="try-title" as="h2" variant="h2" className="doc-section-title">
          직접 입력해 보세요
        </Typography>
        <Try slug={guide.slug} />
      </section>

      <section aria-labelledby="code-title">
        <Typography id="code-title" as="h2" variant="h2" className="doc-section-title">
          코드
        </Typography>
        <CopyCommand command="npm install @bestow-ui/korean-utils" />
        {/* 좁은 화면에서는 가로로 스크롤된다 — 키보드로도 스크롤하도록 포커스를 받는다(axe scrollable-region-focusable, Table 과 같은 방식) */}
        <pre
          className="code doc-code"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          role="region"
          aria-label={`${guide.title} 코드 예시`}
        >
          <code>{guide.code}</code>
        </pre>
      </section>

      {guide.slug === 'bank-account' && (
        <section aria-labelledby="banks-title">
          <Typography id="banks-title" as="h2" variant="h2" className="doc-section-title">
            은행 코드 목록
          </Typography>
          <Typography className="doc-text">
            KOREAN_BANKS 에 든 {KOREAN_BANKS.length}곳이에요. 금융결제원 표준 코드 3자리이고, 많이 쓰는 은행부터
            적었어요.
          </Typography>
          <Table caption="국내 은행 코드(금융결제원)" size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>코드</TableHead>
                <TableHead>은행</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {KOREAN_BANKS.map((bank) => (
                <TableRow key={bank.code}>
                  <TableCell>{bank.code}</TableCell>
                  <TableCell>{bank.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      <section aria-labelledby="notes-title">
        <Typography id="notes-title" as="h2" variant="h2" className="doc-section-title">
          알아 둘 점
        </Typography>
        <ul className="doc-notes">
          {guide.notes.map((note) => (
            <li key={note}>
              <Typography>{note}</Typography>
            </li>
          ))}
        </ul>
      </section>

      {guide.component && (
        <section aria-labelledby="component-title">
          <Typography id="component-title" as="h2" variant="h2" className="doc-section-title">
            React 입력 컴포넌트
          </Typography>
          <Typography className="doc-text">
            <code className="doc-inline-code">{guide.component.name}</code>({' '}
            <Link href={links.npm}>@bestow-ui/react</Link>)는 이 함수를 쓰는 입력 칸이에요. {guide.component.body}
          </Typography>
          <Link href={storybookHref(guide.component.path)}>{guide.component.name} 문서 보기</Link>
        </section>
      )}

      <nav aria-labelledby="others-title">
        <Typography id="others-title" as="h2" variant="h2" className="doc-section-title">
          다른 함수
        </Typography>
        <ul className="doc-others">
          {others.map((g) => (
            <li key={g.slug}>
              <Link href={koreanUtilsHref(g.slug)}>{g.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
