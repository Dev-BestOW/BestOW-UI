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
  VisuallyHidden,
} from '@bestow-ui/react';
import { links, storybookHref } from '../links';
import { pageMetadata } from '../seo';
import { breadcrumbItems, docArticle, JsonLd } from '../structured-data';
import { checkedAt, comparedLibraries, rows } from './data';

const path = '/compare/';
const title = '한국 서비스용 React UI 라이브러리 비교';
const description =
  'BestOW UI·Vapor UI·HANUI·shadcn/ui·MUI 를 한국 서비스 입력·접근성 근거·브랜드색 대비로 비교했어요.';
// Storybook 문서 id(index.json 으로 확인) — 제목이 바뀌면 함께 고친다
const shadcnGuide = storybookHref(encodeURI('/docs/guides-shadcn·tailwind-프로젝트에-한국-키트만-쓰기--docs'));
const crumbs = [
  { name: 'BestOW UI', path: '/' },
  { name: '라이브러리 비교', path },
];

export const metadata = pageMetadata({ path, title, description });

export default function Page() {
  return (
    <article className="doc doc-wide site-inner">
      {docArticle({ path, title, description, crumbs, dates: { published: '2026-11-17', modified: checkedAt } }).map(
        (data) => (
          <JsonLd key={data['@type']} data={data} />
        ),
      )}
      <Breadcrumb items={breadcrumbItems(crumbs)} />
      <header className="doc-header">
        <Typography as="h1" variant="h1">
          {title}
        </Typography>
        <Typography variant="body-lg" color="muted" className="doc-lead">
          가입·본인 확인·결제 화면이 있는 한국 서비스를 React 로 만들 때 무엇이 다른지 모았어요. 다른 라이브러리 칸은 각
          공식 문서·README·npm 에서 확인한 것만 적고 근거를 달았어요.
        </Typography>
      </header>

      <section aria-labelledby="table-title">
        <Typography id="table-title" as="h2" variant="h2" className="doc-section-title">
          한눈에 보기
        </Typography>
        <Table caption="BestOW UI·Vapor UI·HANUI·shadcn/ui·MUI 비교" size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>항목</TableHead>
              {comparedLibraries.map((library) => (
                <TableHead key={library.name}>
                  <Link href={library.href}>{library.name}</Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableHead scope="row" className="compare-row">
                  {row.label}
                </TableHead>
                {comparedLibraries.map((library) => {
                  const cell = library.cells[row.key];
                  return (
                    <TableCell key={library.name} className="compare-cell">
                      {cell.text === '찾지 못함' ? <span className="compare-missing">찾지 못함</span> : cell.text}
                      {cell.source && (
                        <span className="compare-source">
                          <Link href={cell.source.href}>
                            {cell.source.label}
                            <VisuallyHidden> ({library.name})</VisuallyHidden>
                          </Link>
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="body-sm" color="muted" className="compare-note">
          한국 서비스 입력은 약관 동의·인증번호·전화번호·사업자등록번호·금액·주소 입력이에요. {checkedAt} 에 각 공식
          문서·README·npm 정보로 다시 확인했어요. 그 뒤에 바뀌었을 수 있고, “찾지 못함” 은 없다는 뜻이 아니라 문서에서
          찾지 못했다는 뜻이에요. 틀린 내용은 <Link href={`${links.github}/issues`}>이슈</Link>로 알려 주세요.
        </Typography>
      </section>

      <section aria-labelledby="pick-title">
        <Typography id="pick-title" as="h2" variant="h2" className="doc-section-title">
          이럴 땐 다른 선택지도 살펴보세요
        </Typography>
        <ul className="doc-notes">
          <li>
            <Typography>공공 웹사이트라 KRDS 를 따라야 하면 HANUI 가 맞아요.</Typography>
          </li>
          <li>
            <Typography>
              구름처럼 큰 조직이 여러 서비스에 함께 쓸 디자인 시스템이 필요하면 Vapor UI 도 살펴보세요.
            </Typography>
          </li>
          <li>
            <Typography>
              이미 Tailwind·shadcn/ui 로 만든 화면이 있으면 한국 서비스 입력만 BestOW UI 로 얹을 수 있어요 —{' '}
              <Link href={shadcnGuide}>shadcn·Tailwind 프로젝트에 한국 키트만 쓰기</Link>
            </Typography>
          </li>
          <li>
            <Typography>
              다른 라이브러리도 각자 접근성에 힘쓰고 있어요. 이 표는 “한국 민간 서비스를 만들 때” 기준의 차이예요.
            </Typography>
          </li>
        </ul>
      </section>

      <nav aria-labelledby="more-title">
        <Typography id="more-title" as="h2" variant="h2" className="doc-section-title">
          더 보기
        </Typography>
        <ul className="doc-others">
          <li>
            <Link href={links.components}>한국 입력 컴포넌트 문서</Link>
          </li>
          <li>
            <Link href={links.koreanUtils}>서식·검증 함수</Link>
          </li>
          <li>
            <Link href={links.kwcag}>KWCAG 2.2 대응 근거</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
