import { Breadcrumb, DescriptionList, Link, Typography } from '@bestow-ui/react';
import { notFound } from 'next/navigation';
import { CopyCommand } from '../../CopyCommand';
import { koreanUtilsHref, storybookHref } from '../../links';
import { pageMetadata } from '../../seo';
import { breadcrumbItems, docArticle, JsonLd } from '../../structured-data';
import { Demo } from '../Demo';
import { findKitPage, kitDates, kitPages } from '../kit';
import { choosingFor, componentA11yFor, componentProps } from '../source';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return kitPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const page = findKitPage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    path: `/components/${page.slug}/`,
    title: `${page.title} — BestOW UI`,
    description: page.summary,
  });
}

/** 좁은 화면에서는 가로로 스크롤된다 — 키보드로도 스크롤하도록 포커스를 받는다(axe scrollable-region-focusable) */
function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <pre
      className="code doc-code"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <code>{code}</code>
    </pre>
  );
}

export default async function Page({ params }: Props) {
  const page = findKitPage((await params).slug);
  if (!page) notFound();
  // 빌드 때 소스에서 읽는다 — 찾지 못하면 throw 해 빌드가 멈춘다
  const props = componentProps(page.name);
  const a11y = componentA11yFor(page.name);
  const choice = choosingFor(page.name);
  const path = `/components/${page.slug}/`;
  const crumbs = [
    { name: '홈', path: '/' },
    { name: '한국 입력 컴포넌트', path: '/components/' },
    { name: page.name, path },
  ];

  return (
    <article className="doc site-inner">
      {docArticle({ path, title: page.title, description: page.summary, crumbs, dates: kitDates }).map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <Breadcrumb items={breadcrumbItems(crumbs)} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          {page.title}
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          {page.summary}
        </Typography>
      </header>

      <section aria-labelledby="problem-title">
        <Typography id="problem-title" as="h2" variant="h2" className="doc-section-title">
          무엇이 어려운가요
        </Typography>
        {page.problem.map((text) => (
          <Typography key={text} className="doc-text">
            {text}
          </Typography>
        ))}
      </section>

      <section aria-labelledby="try-title">
        <Typography id="try-title" as="h2" variant="h2" className="doc-section-title">
          직접 입력해 보세요
        </Typography>
        <Demo slug={page.slug} />
      </section>

      <section aria-labelledby="code-title">
        <Typography id="code-title" as="h2" variant="h2" className="doc-section-title">
          코드
        </Typography>
        <CopyCommand command="npm install @bestow-ui/react" />
        <CodeBlock code={page.code} label={`${page.name} 코드 예시`} />
      </section>

      {choice && (
        <section aria-labelledby="when-title">
          <Typography id="when-title" as="h2" variant="h2" className="doc-section-title">
            언제 쓰나요
          </Typography>
          <Typography className="doc-text">{choice.when}</Typography>
          {choice.avoid && <Typography className="doc-text">맞지 않는 곳: {choice.avoid}</Typography>}
        </section>
      )}

      <section aria-labelledby="a11y-title">
        <Typography id="a11y-title" as="h2" variant="h2" className="doc-section-title">
          키보드·스크린리더
        </Typography>
        {a11y.name !== page.name && (
          <Typography className="doc-text" color="muted">
            아래 내용은 {a11y.name} 에 함께 해당해요.
          </Typography>
        )}
        <DescriptionList
          layout="vertical"
          divided
          items={[
            { term: '키보드', description: a11y.keyboard || 'Tab 으로 포커스를 옮겨요.' },
            { term: '스크린리더·모바일', description: a11y.screenReader },
            ...(a11y.yours ? [{ term: '사용하는 쪽이 챙길 것', description: a11y.yours }] : []),
          ]}
        />
      </section>

      <section aria-labelledby="props-title">
        <Typography id="props-title" as="h2" variant="h2" className="doc-section-title">
          props
        </Typography>
        <Typography className="doc-text">
          소스의 타입 정의를 그대로 옮겼어요. 여기 없는 prop 은 extends 로 물려받은 타입을 따라요.
        </Typography>
        <CodeBlock code={props} label={`${page.name} props 타입 정의`} />
      </section>

      <section aria-labelledby="notes-title">
        <Typography id="notes-title" as="h2" variant="h2" className="doc-section-title">
          알아 둘 점
        </Typography>
        <ul className="doc-notes">
          {page.notes.map((note) => (
            <li key={note}>
              <Typography>{note}</Typography>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-labelledby="more-title">
        <Typography id="more-title" as="h2" variant="h2" className="doc-section-title">
          더 보기
        </Typography>
        <ul className="doc-others">
          <li>
            <Link href={storybookHref(page.storybookPath)}>Storybook 에서 조작해 보기</Link>
          </li>
          {page.utilsSlug && (
            <li>
              <Link href={koreanUtilsHref(page.utilsSlug)}>같은 서식 함수(@bestow-ui/korean-utils)</Link>
            </li>
          )}
        </ul>
      </nav>
    </article>
  );
}
