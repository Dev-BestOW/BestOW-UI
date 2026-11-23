import { Breadcrumb, Link, Typography } from '@bestow-ui/react';
import { DocDates } from '../../DocDates';
import { notFound } from 'next/navigation';
import { CopyCommand } from '../../CopyCommand';
import { componentHref, koreanUtilsHref, links, storybookHref } from '../../links';
import { pageMetadata } from '../../seo';
import { breadcrumbItems, docArticle, JsonLd } from '../../structured-data';
import { findGuide, guideDatesFor, guides } from '../guides';
import { BankCodeTable, ResidentCodeTable } from '../Tables';
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
    title: guide.title,
    description: guide.summary,
  });
}

export default async function Page({ params }: Props) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const others = guides.filter((g) => g.slug !== guide.slug);
  const path = `/korean-utils/${guide.slug}/`;
  const dates = guideDatesFor(guide);
  const crumbs = [
    { name: 'BestOW UI', path: '/' },
    { name: '서식·검증 함수', path: '/korean-utils/' },
    { name: guide.title, path },
  ];

  return (
    <article className="doc site-inner">
      {docArticle({ path, title: guide.title, description: guide.summary, crumbs, dates }).map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <Breadcrumb items={breadcrumbItems(crumbs)} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          {guide.title}
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          {guide.summary}
        </Typography>
        <DocDates dates={dates} />
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

      {guide.slug === 'resident-number' && <ResidentCodeTable />}
      {guide.slug === 'bank-account' && <BankCodeTable />}

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
          <ul className="doc-others">
            <li>
              <Link href={componentHref(guide.component.slug)}>{guide.component.name} 문서 보기</Link>
            </li>
            <li>
              <Link href={storybookHref(guide.component.path)}>{guide.component.name} Storybook 에서 조작해 보기</Link>
            </li>
          </ul>
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
