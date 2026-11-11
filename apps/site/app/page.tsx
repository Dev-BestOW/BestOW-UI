import { Button, Link, Typography } from '@bestow-ui/react';
import reactPackage from '@bestow-ui/react/package.json';
import { CopyCommand } from './CopyCommand';
import { KitDemo } from './KitDemo';
import { links } from './links';

const reasons = [
  {
    title: '한국 서비스 키트',
    body: '약관 전체 동의, 문자 자동 채우기가 되는 인증번호, 검증 공식이 들어간 사업자등록번호, “12만 5,000원” 으로 읽어 주는 금액 칸, 카카오 우편번호 주소, 일요일부터 시작하는 달력까지 13종이에요. 서식·검증 함수만 필요하면 React 없이 쓰는 @bestow-ui/korean-utils 도 있어요.',
    link: { href: links.koreanKit, label: '한국 서비스 키트 문서' },
  },
  {
    title: '검사로 증명하는 접근성',
    body: '모든 스토리를 Chromium·WebKit·Firefox 에서 라이트·다크 두 테마로 axe 검사해야 배포돼요. 고대비 모드, 320px 리플로, 기본 글꼴 2배도 확인하고, VoiceOver·NVDA 로 직접 들어 본 기록과 KWCAG 2.2 33개 항목별 대응 근거를 공개해요.',
    link: { href: links.kwcag, label: 'KWCAG 2.2 대응 근거' },
  },
  {
    title: '대표색 하나로 만드는 테마',
    body: '브랜드 색 하나를 넣으면 라이트·다크 색 세트를 만들고, 글자 대비 4.5:1 과 포커스 링 3:1 을 지켜요. 위 데모에서 색을 바꿔 보세요. 모드를 바꿔도 브랜드는 유지되고, Modal·Toast 처럼 따로 띄우는 요소도 따라가요.',
    link: { href: links.themeBuilder, label: '테마 빌더' },
  },
];

const sizes = [
  { term: 'Button 하나', value: '1.7 kB' },
  { term: 'NativeSelect 로 만든 입력 폼 7종', value: '약 4 kB' },
  { term: '모든 컴포넌트의 CSS', value: '약 11 kB' },
];

const steps = [
  {
    title: '설치해요',
    code: 'npm install @bestow-ui/react',
  },
  {
    title: '스타일을 한 번 불러오고 ThemeProvider 로 감싸요',
    code: `// app/layout.tsx
import '@bestow-ui/react/styles.css';

// app/providers.tsx ('use client')
<ThemeProvider theme="system">{children}</ThemeProvider>`,
  },
  {
    title: '컴포넌트를 써요',
    code: `<PhoneNumberInput label="휴대폰 번호" value={phone} onValueChange={setPhone} />`,
  },
];

const more = [
  {
    href: links.introduction,
    label: '컴포넌트 문서(Storybook)',
    body: '모든 컴포넌트를 직접 조작해 보고, 키보드·스크린리더 동작을 확인해요.',
  },
  {
    href: links.koreanUtils,
    label: '서식·검증 함수',
    body: '전화번호 하이픈, 사업자등록번호 검증, 금액 한글 읽기 같은 함수를 직접 입력해 보고 가져가요. React 없이도 써요.',
  },
  { href: links.playground, label: 'Next.js 예제 앱', body: '회원가입·주문 관리 화면을 App Router 로 만든 예제예요.' },
  {
    href: links.choosing,
    label: '언제 무엇을 쓰나',
    body: 'Select 와 NativeSelect, Modal 과 Drawer 처럼 비슷한 컴포넌트 고르는 기준이에요.',
  },
  { href: links.llms, label: 'llms.txt', body: 'Cursor·Claude 같은 AI 코딩 도구에 넣는 문서예요.' },
  { href: links.github, label: 'GitHub', body: '소스, 이슈, Discussions, 변경 기록이 있어요.' },
];

export default function Page() {
  return (
    <>
      <div className="hero site-inner">
        <div className="hero-copy">
          <Typography as="h1" className="hero-title">
            {/* 낱말 묶음이 줄 끝에서 갈라지지 않게("만들지 / 마세요") 묶음마다 nowrap */}
            <span className="nowrap">한국 서비스의</span> <span className="nowrap">입력 칸,</span> <br />
            <span className="nowrap">이제 처음부터</span> <span className="nowrap">만들지 마세요</span>
          </Typography>
          <Typography variant="body-lg" color="muted" className="hero-lead">
            전화번호·사업자등록번호·금액·약관 동의처럼 매번 직접 만들던 부품을 React 컴포넌트로 드려요. 모든 컴포넌트는
            접근성 검사를 통과해야 배포돼요.
          </Typography>
          <CopyCommand command="npm install @bestow-ui/react" />
          <div className="hero-actions">
            <Button asChild size="lg">
              <a href={links.introduction}>시작하기 문서 보기</a>
            </Button>
            <Button asChild size="lg" variant="outline" color="neutral">
              <a href={links.stackblitz}>브라우저에서 바로 써 보기</a>
            </Button>
          </div>
          <Typography variant="body-sm" color="muted">
            지금 버전은 {reactPackage.version} 이에요. React 18·19 와 Next.js App Router(서버 컴포넌트)를 지원하고, MIT
            라이선스예요.
          </Typography>
        </div>
        <KitDemo />
      </div>

      <section aria-labelledby="why-title" className="band">
        <div className="site-inner split">
          <Typography id="why-title" as="h2" variant="h2">
            무엇이 다른가요
          </Typography>
          <div className="reasons">
            {reasons.map((reason) => (
              <article key={reason.title} className="reason">
                <Typography as="h3" variant="h3">
                  {reason.title}
                </Typography>
                <Typography color="muted">{reason.body}</Typography>
                <Link href={reason.link.href}>{reason.link.label}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="size-title" className="band">
        <div className="site-inner split">
          <div>
            <Typography id="size-title" as="h2" variant="h2">
              쓰는 만큼만 받아요
            </Typography>
          </div>
          <div>
            <dl className="sizes">
              {sizes.map(({ term, value }) => (
                <div key={term} className="size">
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Typography variant="body-sm" color="muted">
              minify + brotli 기준이에요. 스타일은 빌드 때 CSS 파일로 뽑혀 런타임 비용이 없고, 크기 한도는 PR 마다 CI 로
              확인해요. 스타일은 CSS 레이어(@layer bestow) 안에 있어 className·Tailwind 로 덮어쓰기 쉬워요.
            </Typography>
          </div>
        </div>
      </section>

      <section aria-labelledby="start-title" className="band">
        <div className="site-inner split">
          <Typography id="start-title" as="h2" variant="h2">
            Next.js 에서 시작하기
          </Typography>
          <div>
            <ol className="steps">
              {steps.map((step) => (
                <li key={step.title} className="step">
                  <Typography as="h3" variant="h4">
                    {step.title}
                  </Typography>
                  <pre className="code">
                    <code>{step.code}</code>
                  </pre>
                </li>
              ))}
            </ol>
            <Link href={links.introduction}>전체 설정 방법(다크 모드·브랜드 테마·서버 컴포넌트)</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-title" className="band">
        <div className="site-inner split">
          <Typography id="more-title" as="h2" variant="h2">
            더 알아보기
          </Typography>
          <ul className="more">
            {more.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="more-link">
                  {item.label}
                </Link>
                <Typography variant="body-sm" color="muted">
                  {item.body}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
