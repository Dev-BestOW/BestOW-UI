import { Badge, Breadcrumb, Link, Typography } from '@bestow-ui/react';
import { DocDates } from '../DocDates';
import { links } from '../links';
import { pageMetadata } from '../seo';
import { breadcrumbItems, docArticle, JsonLd } from '../structured-data';
import { koreanDay, releases, type ChangeKind, type Release } from './changelog';
import { Block } from './Markdown';

const path = '/changelog/';
const title = '변경 기록';
const description = 'react·tokens·korean-utils·icons 패키지의 버전별 새 기능과 고친 것을 배포 날짜순으로 모았어요.';
const crumbs = [
  { name: 'BestOW UI', path: '/' },
  { name: '변경 기록', path },
];

export const metadata = pageMetadata({ path, title, description });

const kindLabel: Record<ChangeKind, string> = {
  major: '업그레이드할 때 확인할 변경',
  minor: '새 기능',
  patch: '고친 것',
};

/** 버전 제목의 id — 다른 곳에서 `/changelog/#react-2.2.0` 으로 바로 연다 */
const anchor = (release: Release) => `${release.pkg.replace('@bestow-ui/', '')}-${release.version}`;

export default function Page() {
  const all = releases();
  const days = [...new Set(all.map((release) => release.date))];
  const dates = { published: '2026-11-22', modified: days[0]! };
  return (
    <article className="doc site-inner">
      {docArticle({ path, title, description, crumbs, dates }).map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <Breadcrumb items={breadcrumbItems(crumbs)} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          변경 기록
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          npm 에 배포한 버전마다 무엇이 바뀌었는지 최근 것부터 모았어요. 정기 배포는 격주 목요일이고, 버전 규칙과 지원
          범위는 <Link href={links.support}>지원 정책</Link>에 있어요.
        </Typography>
        <DocDates dates={dates} />
      </header>

      {days.map((day) => (
        <section key={day} aria-labelledby={`day-${day}`} className="changelog-day">
          <Typography id={`day-${day}`} as="h2" variant="h2" className="doc-section-title">
            <time dateTime={day}>{koreanDay(day)}</time>
          </Typography>
          {all
            .filter((release) => release.date === day)
            .map((release) => (
              <section key={anchor(release)} aria-labelledby={anchor(release)} className="changelog-release">
                <Typography id={anchor(release)} as="h3" variant="h3">
                  {release.pkg} {release.version}
                </Typography>
                {release.sections.length === 0 ? (
                  <Typography variant="body" color="muted">
                    다른 패키지의 변경에 맞춰 버전만 올렸어요.
                  </Typography>
                ) : (
                  release.sections.map((section) => (
                    <div key={section.kind} className="changelog-section">
                      <Badge
                        color={section.kind === 'major' ? 'danger' : section.kind === 'minor' ? 'primary' : 'neutral'}
                      >
                        {kindLabel[section.kind]}
                      </Badge>
                      <ul className="changelog-list">
                        {section.items.map((item, index) => (
                          <li key={index}>
                            <Block lines={item.split('\n')} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </section>
            ))}
        </section>
      ))}
    </article>
  );
}
