# SEO·GEO 개선 계획

> **실행하는 쪽(사람·에이전트)에게:** 작업(Task)을 순서대로 하나씩 진행한다. 단계는 체크박스(`- [ ]`)로 표시한다.
> 작업 하나가 끝날 때마다 검증 → 사용자에게 커밋 요청 → **커밋된 것을 확인한 뒤** 다음 작업으로 넘어간다(Claude 는 커밋·push 하지 않는다).

**목표:** 검색 엔진과 AI 답변(ChatGPT·Perplexity·Gemini·Cursor 등)이 "React 전화번호 입력 컴포넌트", "사업자등록번호 입력 검증" 같은 질문에 BestOW UI 의 쪽을 찾아 보여 주고 인용하게 한다.

**구조:** 소개 사이트(`apps/site`, Next.js 정적 export)에 한국 키트 컴포넌트마다 정적 HTML 문서 쪽 `/components/<slug>/` 를 만든다. korean-utils 함수 문서(`/korean-utils/<slug>/`)와 같은 틀이다.
글은 쪽마다 직접 쓰는 데이터 파일 하나로 두고, props 정의·키보드·스크린리더 동작은 이미 있는 소스(`packages/react` 소스, `componentA11y.ts`, `choosing.ts`)에서 빌드 때 읽어 와 코드와 어긋나지 않게 한다.
모든 문서 쪽에 JSON-LD 구조화 데이터를 넣고, 비교 쪽과 GEO 측정 방법을 더한다.

**기술:** Next.js 16 App Router(정적 export, 서버 컴포넌트에서 `fs` 로 소스 읽기), `@bestow-ui/react`(데모), Playwright E2E(`apps/site/e2e`, 포트 3108), axe-core.

**근거:** 2026-11-14 조사.
- `bestow-ui.com/storybook/?path=…` 의 모든 문서가 같은 제목·같은 canonical(`/storybook/`)이다.
- 내용을 JS 로 그려서 HTML 의 글자는 약 3 kB 뿐이다. 그래서 검색 엔진은 컴포넌트 문서를 따로 알지 못한다.
- korean-utils 쪽(정적 HTML·쪽별 메타)만 검색에 잡힐 수 있는 구조다. sitemap 에는 18개 주소가 있다.

## 하지 않을 것

- Storybook 자체를 서버 렌더링하거나 쪽마다 메타를 바꾸지 않는다. 손이 크게 가는데 효과는 새 정적 쪽이 더 크다.
  Storybook 은 "직접 조작해 보기" 용도로 남긴다.
- 62개 컴포넌트 전부를 다루지 않는다. 검색어가 분명하고 경쟁이 적은 **한국 키트 13개**만 다룬다.
  나머지는 방문 통계·Search Console 검색어를 보고 수요가 보일 때 정한다.
- 키워드만 늘어놓은 쪽, 같은 글을 조금씩 바꾼 쪽은 만들지 않는다.
- props 를 표로 그리려고 TypeScript 파서를 들이지 않는다. 소스의 `interface` 를 JSDoc 째 코드 블록으로 보인다(llms-full.txt 와 같은 방식).

## 전역 제약

- 문서·화면 글자는 한국어 해요체. 제목은 검색어에 가깝게 쓴다(korean-utils `guides.ts` 의 규칙과 같음).
- 데모와 화면은 `@bestow-ui/react` 컴포넌트와 `vars` 로 그린다. 색·간격을 하드코딩하지 않는다.
- 새 쪽은 site E2E 의 기존 규칙을 따른다: 콘솔 경고·오류 0, axe 위반 0(라이트·다크), 320px·390px 에서 가로 스크롤 없음.
  E2E 는 `./fixtures` 의 `test` 를 쓴다.
- 주소는 `links.ts` 의 `basePath`·`siteOrigin` 으로 만든다. 절대 주소를 직접 적지 않는다(테스트 기대값만 예외).
- 메타는 `seo.ts` 의 `pageMetadata` 로 만든다(canonical·OG·트위터 카드).
- 공개 API(npm 패키지)는 바꾸지 않는다. 그래서 changeset 이 필요 없다. 단, Task 6 에서 npm README 를 고치면 patch changeset 을 만든다.
- 작업마다 CLAUDE.md "검증" 명령 전체를 통과해야 한다.

## 검토할 때 볼 것 (테스트가 따로 없으면 놓치기 쉬운 것)

1. **소스 경로가 틀린 컴포넌트:** props 를 찾지 못하면 빈 코드 블록 대신 **빌드가 실패**해야 한다. 조용히 빈 쪽이 배포되면 안 된다. → Task 1 단위 테스트.
2. **데모의 가짜 공급자:** AddressInput 데모는 카카오 스크립트를 불러오면 안 된다(네트워크·CSP·E2E 불안정). 스토리의 `sampleProvider` 같은 가짜 공급자를 쓴다. → Task 2 E2E.
3. **"오늘" 이 들어가는 데모:** DatePicker·DateRangePicker·Calendar 데모는 `today` 를 고정해야 한다. 그러지 않으면 빌드 날짜에 따라 HTML 이 달라지고 hydration 경고가 난다. → Task 2(콘솔 오류 0 fixture 가 잡는다).
4. **JSON-LD 안의 `</script>`:** 데이터 글자에 `<` 가 있으면 스크립트가 끊긴다. 직렬화할 때 `<` 를 `<` 로 바꾼다. → Task 4 단위 테스트.
5. **componentA11y 의 묶음 이름:** `'PhoneNumberInput · BusinessNumberInput · AmountInput'` 처럼 여러 이름이 한 항목에 있다. 이름이 **낱말로 정확히** 맞아야 한다(`DatePicker` 가 `DateRangePicker` 항목에 걸리면 안 됨). → Task 1 단위 테스트.

---

### Task 1: 컴포넌트 문서 틀 + PhoneNumberInput 한 쪽

틀이 맞는지 사용자가 이 한 쪽을 브라우저로 보고 승인한 뒤 Task 2 로 넘어간다.

**파일:**
- 만들기: `apps/site/app/components/kit.ts`: 쪽마다 직접 쓰는 글(데이터)
- 만들기: `apps/site/app/components/source.ts`: 빌드 때 소스에서 읽어 오는 것(서버 전용)
- 만들기: `apps/site/app/components/source.test.ts`: 단위 테스트(vitest, node 환경)
- 만들기: `apps/site/app/components/[slug]/page.tsx`: 쪽
- 만들기: `apps/site/app/components/Demo.tsx`: `'use client'` 데모(slug 로 고름, korean-utils `Try.tsx` 와 같은 방식)
- 고치기: `apps/site/app/links.ts`: `componentHref(slug)`
- 고치기: `scripts/generate-llms.mjs`: `publicTypes` 를 `scripts/lib/public-types.mjs` 로 옮겨 import
- 만들기: `scripts/lib/public-types.mjs`
- 만들기: `apps/site/e2e/components.spec.ts`
- 고치기: `apps/site/package.json`: `"test": "vitest run"` 와 devDependency `vitest`(루트와 같은 버전)
- 고치기: 루트 `package.json` / CI: `pnpm test` 가 site 의 테스트도 돌리는지 확인하고, 아니면 ci.yml 의 test 단계에 넣는다.

**인터페이스:**
- 만드는 것:
  - `interface KitPage { slug: string; name: string; title: string; summary: string; problem: string[]; code: string; notes: string[]; storybookPath: string; utilsSlug?: string }`
  - `const kitPages: KitPage[]`
  - `function findKitPage(slug: string): KitPage | undefined`
  - `function componentProps(name: string): string`: `packages/react/src/components/<name>/<name>.tsx` 의 `export interface <name>Props` 블록(위 JSDoc 포함)과 같은 파일의 export type. 파일이나 인터페이스가 없으면 `throw`.
  - `function componentA11yFor(name: string): ComponentA11y`: 항목 이름을 `' · '` 로 나눈 낱말 중 정확히 같은 것. 없으면 `throw`.
  - `function choosingFor(name: string): { when: string; avoid?: string } | undefined`: `choosing.ts` 에 있으면 돌려준다. 없을 수 있다.
  - `function componentHref(slug: string): string`: `${basePath}/components/${slug}/`
  - `scripts/lib/public-types.mjs`: `export function publicTypes(code: string): string`(generate-llms 에서 그대로 옮김)

- [ ] **1-1: 저장소 밖 import 확인 (짧은 실험)**
  `source.ts` 에서 `../../../storybook/stories/accessibility/componentA11y` 와 `../../../../scripts/lib/public-types.mjs` 를 import 하고 `pnpm build-site` 를 돌려 본다.
  기대: 빌드 성공. Next 16 은 lockfile 이 있는 저장소 루트를 Turbopack root 로 잡는다.
  실패하면 `next.config.ts` 에 `turbopack: { root: fileURLToPath(new URL('../..', import.meta.url)) }` 를 더하고 다시 확인한다.

- [ ] **1-2: 실패하는 단위 테스트 작성** (`source.test.ts`)
  ```ts
  test('componentProps: 인터페이스와 JSDoc 을 소스 그대로', () => {
    const props = componentProps('PhoneNumberInput');
    expect(props).toContain('export interface PhoneNumberInputProps');
    expect(props).toMatch(/\/\*\*/);
  });
  test('componentProps: 없는 컴포넌트는 빌드를 멈춘다', () => {
    expect(() => componentProps('NoSuchInput')).toThrow(/NoSuchInput/);
  });
  test('componentA11yFor: 묶음 항목에서 낱말이 정확히 같은 것', () => {
    expect(componentA11yFor('AmountInput').name).toContain('AmountInput');
    expect(componentA11yFor('DatePicker').name).toBe('DatePicker');
  });
  test('kitPages: slug 가 겹치지 않고 모든 쪽의 소스·접근성 정보를 찾는다', () => {
    expect(new Set(kitPages.map((p) => p.slug)).size).toBe(kitPages.length);
    for (const page of kitPages) {
      expect(() => componentProps(page.name)).not.toThrow();
      expect(() => componentA11yFor(page.name)).not.toThrow();
    }
  });
  ```
- [ ] **1-3: 실행해서 실패하는지 확인**: `pnpm --filter @bestow-ui/site test`, 기대: 함수 없음으로 FAIL.
- [ ] **1-4: `public-types.mjs` 로 옮기기, `source.ts`·`kit.ts` 구현.** `kitPages` 에는 PhoneNumberInput 하나만 넣는다.
  - slug `phone-number-input`
  - title `React 전화번호 입력 컴포넌트 — 하이픈 자동·커서 유지`
  - utilsSlug `phone-number`
  - 본문은 `guides.ts` 의 phone-number 쪽과 겹치지 않게 **입력 칸으로서의 문제**를 쓴다: 커서 위치, 하이픈 뒤 Backspace, 붙여넣기, 모바일 숫자 키패드, 스크린리더 알림.
- [ ] **1-5: 실행해서 통과하는지 확인**: 같은 명령, 기대: 4 passed.
  변이 확인: `componentA11yFor` 를 `includes` 로 바꾸면 DatePicker 테스트가 실패하는지 보고, scratchpad 백업으로 되돌린다.
- [ ] **1-6: 쪽 그리기** (`[slug]/page.tsx`)
  korean-utils 쪽과 같은 틀이다: Breadcrumb(홈 › 한국 입력 컴포넌트 › 이름), h1 = title, 머리말 = summary. 절 순서:
  1. "무엇이 어려운가요"(problem)
  2. "직접 입력해 보세요"(Demo)
  3. "코드"(설치 명령 `CopyCommand` + code)
  4. "언제 쓰나요"(choosingFor — 있을 때만)
  5. "키보드·스크린리더"(componentA11yFor 의 keyboard·screenReader·yours)
  6. "props"(componentProps 를 `<pre>` 로 — 기존 `doc-code` 스타일, `tabIndex={0}` + `role="region"`)
  7. "알아 둘 점"(notes)
  8. 링크: "Storybook 에서 조작해 보기"(`storybookHref(storybookPath)`), utilsSlug 가 있으면 "같은 서식 함수"(`koreanUtilsHref`)

  메타는 `pageMetadata({ path: '/components/<slug>/', title: \`${title} — BestOW UI\`, description: summary })` 로 만든다.
  `generateStaticParams` 를 쓰고 `dynamicParams = false` 로 둔다.
- [ ] **1-7: E2E 작성** (`components.spec.ts`). korean-utils.spec 의 "함수 문서" 테스트와 같은 단언을 쓴다:
  - h1 = title, `<title>` = `${title} — BestOW UI`
  - meta description = summary
  - canonical·og:url = `https://bestow-ui.com/components/<slug>/`, og:image = `https://bestow-ui.com/og.png`
  - "props" 절 코드에 `export interface PhoneNumberInputProps`
  - Storybook 링크 href = `/storybook/?path=/docs/korean-kit-phonenumberinput--docs`
  - 데모: `pressSequentially('01012345678')` → 값 `010-1234-5678`
  - axe 라이트·다크 0, 320px 가로 스크롤 없음
- [ ] **1-8: 실행**: `pnpm build && pnpm build-site && pnpm --filter @bestow-ui/site test:e2e`, 기대: 모두 통과.
- [ ] **1-9: 사용자 확인**: `pnpm site` 로 `http://localhost:3002/components/phone-number-input/` 을 보여 주고 글·절 순서를 승인받는다. 고칠 것은 반영한다.
- [ ] **1-10: 전체 검증 → 커밋 요청**: `✨ 소개 사이트에 컴포넌트 문서 쪽 틀과 PhoneNumberInput 쪽 추가`

### Task 2: 나머지 한국 키트 12개 쪽

**파일:** 고치기 `kit.ts`·`Demo.tsx`·`components.spec.ts`

**인터페이스:** Task 1 의 `KitPage`·`Demo` 그대로. 새 이름은 없다.

순서와 slug (utilsSlug):
1. `business-number-input` (business-number)
2. `verification-code-input`
3. `agreement-group`
4. `amount-input` (korean-amount)
5. `address-input` (extra-address)
6. `resident-number-input` (resident-number)
7. `card-number-input` (card-number)
8. `account-number-input` (bank-account)
9. `corporate-number-input` (corporate-number)
10. `date-picker` (korean-date)
11. `date-range-picker`
12. `calendar`

- [ ] **2-1: E2E 를 데이터로 돌리게 바꾼다.** Task 1 의 메타·링크·props·axe 단언을 `for (const page of kitPages)` 로 바꾼다. 기대: 쪽이 없어 FAIL.
  데모는 쪽마다 한 가지만 확인한다:
  - BusinessNumberInput: `1248100998` → 오류 없음, `1248100999` → 오류 문구
  - VerificationCodeInput: 6자리 입력 → 완료 상태
  - AgreementGroup: "전체 동의" → 모든 항목 체크
  - AmountInput: `12000` → `12,000` + 한글 읽기
  - AddressInput: 가짜 공급자로 주소 고르기 → 값이 칸에 들어감, **`t1.kakaocdn.net` 요청 0**
  - ResidentNumberInput·CardNumberInput·AccountNumberInput·CorporateNumberInput: 서식이 입혀짐
  - DatePicker·DateRangePicker·Calendar: `today="2026-11-14"` 로 열어 날짜 고르기
- [ ] **2-2: 12개 쪽 데이터·데모 작성.** 컴포넌트마다 실제 동작을 스토리·테스트에서 확인하고 쓴다. 문서에 없는 동작을 지어내지 않는다.
- [ ] **2-3: 실행**: Task 1-8 과 같은 명령, 기대: 모두 통과. 새 E2E 는 `--repeat-each 5` 로 불안정하지 않은지 본다.
- [ ] **2-4: 전체 검증 → 커밋 요청**: `✨ 한국 키트 컴포넌트 문서 쪽 12개 추가`

### Task 3: 목록 쪽·사이트 연결

**파일:**
- 만들기: `apps/site/app/components/page.tsx`
- 고치기: `providers.tsx`(머리글 nav), `page.tsx`(첫 화면 한국 키트 절에서 각 쪽으로), `sitemap.ts`, `korean-utils/[slug]/page.tsx`(React 컴포넌트 절 링크를 사이트 쪽으로), `korean-utils/guides.ts`, `apps/storybook/public/llms.txt`
- 테스트: `components.spec.ts`, `korean-utils.spec.ts`, `landing.spec.ts`

**인터페이스:** `links.components = \`${basePath}/components/\``(links.ts)

- [ ] **3-1: 실패하는 E2E 작성**
  - 목록 쪽 h1 `한국 서비스 입력 컴포넌트`, 모든 kitPages 로 가는 링크
  - 머리글 nav `컴포넌트` 링크
  - sitemap 에 `/components/` 와 13쪽
  - korean-utils 함수 쪽의 "PhoneNumberInput 문서 보기" href 가 `/components/phone-number-input/`
- [ ] **3-2: 구현.**
  - guides.ts 의 `component.path`(Storybook)는 지우지 않고 `component.slug` 를 더한다. 링크는 사이트 쪽으로 바꾼다. 사이트 쪽 안에 Storybook 링크가 있다.
  - llms.txt 에 "한국 입력 컴포넌트 문서(정적 HTML)" 줄을 더한다.
- [ ] **3-3: 실행해서 통과 확인**
- [ ] **3-4: 전체 검증 → 커밋 요청**: `✨ 컴포넌트 문서 목록·머리글·sitemap 연결`

### Task 4: 구조화 데이터 (JSON-LD)

**파일:**
- 만들기: `apps/site/app/structured-data.tsx`, `apps/site/app/structured-data.test.ts`
- 고치기: `app/page.tsx`, `korean-utils/[slug]/page.tsx`, `components/[slug]/page.tsx`
- 테스트: E2E 3개 spec 에 JSON-LD 단언

**인터페이스:**
- `function JsonLd({ data }: { data: object }): JSX.Element`: `<script type="application/ld+json">` 를 그린다. 직렬화는 `JSON.stringify(data).replace(/</g, '\\u003c')`.
- `function softwareSourceCode(): object`: 첫 화면용
  - `@type: 'SoftwareSourceCode'`, `name: 'BestOW UI'`
  - `codeRepository: 'https://github.com/Dev-BestOW/BestOW-UI'`, `programmingLanguage: 'TypeScript'`, `license: 'https://opensource.org/licenses/MIT'`
  - `url: siteOrigin + basePath + '/'`
- `function docArticle(input: { path: string; title: string; description: string; crumbs: { name: string; path: string }[] }): object[]`: 문서 쪽용. `TechArticle`(headline·description·url·inLanguage `ko`)과 `BreadcrumbList` 두 개를 돌려준다.

- [ ] **4-1: 실패하는 단위 테스트**: `<` 가 든 글자가 `<` 로 나가고 `JSON.parse` 하면 원래 글자와 같은지, `BreadcrumbList` 의 `position` 이 1부터 이어지는지.
- [ ] **4-2: 실패하는 E2E**: 각 쪽의 `script[type="application/ld+json"]` 를 `JSON.parse` 해서 `@type` 과 `url`(= canonical)을 확인한다.
- [ ] **4-3: 구현** → 단위·E2E 통과 확인.
- [ ] **4-4: 배포 뒤 확인**(push 후): Google 리치 결과 테스트(https://search.google.com/test/rich-results)에 첫 화면과 한 쪽씩 넣어 오류 0 인지 본다. 사용자가 하거나, 결과 화면을 받아 Claude 가 확인한다.
- [ ] **4-5: 전체 검증 → 커밋 요청**: `✨ 소개 사이트에 구조화 데이터(JSON-LD) 추가`

### Task 5: 비교 쪽 `/compare/`

AI 가 "한국 서비스용 React UI 라이브러리 추천" 같은 질문에 가장 잘 인용하는 형식이다.

**파일:** 만들기 `apps/site/app/compare/page.tsx`, 고치기 `sitemap.ts`·`providers.tsx`(필요하면)·`README.md`(표 아래 링크), 테스트 `apps/site/e2e/compare.spec.ts`

- [ ] **5-1: 내용 정하기.**
  - README "다른 선택지와 비교" 표를 바탕으로, 칸마다 근거 링크를 단다(각 라이브러리 공식 문서).
  - **조사한 날짜**를 적고, 내용이 바뀌었을 수 있다고 함께 밝힌다.
  - 다른 라이브러리를 깎아내리지 않는다. README 의 "이럴 땐 HANUI·Vapor UI" 안내를 유지한다.
  - 값을 다시 확인한다(2026-11-04 기준이라 각 공식 문서를 다시 본다). 바뀐 값은 README 표도 함께 고친다.
- [ ] **5-2: 실패하는 E2E**: h1, 표 caption, 라이브러리 5개 열 머리글, 각 근거 링크가 `http` 로 시작하는지, axe·320px(표는 가로 스크롤 영역 안에).
- [ ] **5-3: 구현 → 통과 확인 → 전체 검증 → 커밋 요청**: `✨ 다른 라이브러리와 비교 쪽 추가`

### Task 6: GEO 측정·문서 정리

**파일:** 만들기 `docs/GEO-CHECK.md`, 고치기 `CLAUDE.md`(apps/site 설명), `docs/ROADMAP.md`, README·npm README(문서 쪽 링크 — 고치면 patch changeset)

- [ ] **6-1: `docs/GEO-CHECK.md` 작성.** 한 달에 한 번 같은 질문 5개를 ChatGPT·Perplexity·Gemini 에 던져 BestOW UI 가 언급·인용되는지 표에 기록한다. 질문:
  1. "React 에서 전화번호 하이픈 자동 입력 컴포넌트 추천해 줘"
  2. "사업자등록번호 검증 React"
  3. "한국 서비스용 React 디자인 시스템"
  4. "KWCAG 접근성 지킨 React 컴포넌트 라이브러리"
  5. "약관 전체 동의 체크박스 React 접근성"

  같은 표에 Search Console 노출·클릭과 Cloudflare 의 AI 유입(chatgpt.com·perplexity.ai)도 함께 적는다.
- [ ] **6-2: CLAUDE.md 갱신**: apps/site 설명에 `/components/`(데이터 kit.ts, 소스에서 props·접근성 읽기, **새 한국 키트 컴포넌트는 kit.ts 에도 넣는다**), `/compare/`, JSON-LD 를 더한다.
- [ ] **6-3: README 들의 "Storybook › Korean Kit" 링크를 정적 문서 쪽으로 바꿀지 결정.** 추천: 사이트 쪽으로 바꾼다. 검색 엔진이 읽을 수 있는 쪽으로 링크가 모여야 한다.
- [ ] **6-4: ROADMAP 갱신 → 전체 검증 → 커밋 요청**: `📝 GEO 점검 방법과 문서 쪽 안내 정리`

## 사람이 할 일 (코드 밖)

- Search Console 도메인 속성 등록·sitemap 제출(진행 중). 네이버 소유확인·sitemap 제출.
- **Context7 등록**: Cursor·Claude 가 라이브러리 문서를 찾는 경로라 GEO 효과가 가장 직접적이다. Task 3 뒤에 하면 정적 문서 쪽까지 함께 읽힌다.
- 블로그 예약 발행 켜기, velog·요즘IT·GeekNews 알리기(준비물 Artifact). AI 는 여러 곳에서 같은 이름을 볼수록 믿는다.
  글마다 사이트의 컴포넌트·함수 쪽으로 링크한다.
- 배포 2~4주 뒤 Search Console 에서 `/components/` 쪽의 색인 여부와 검색어를 확인하고, GEO-CHECK 첫 기록을 남긴다.

## 일정 감

| 작업 | 크기 | 비고 |
|---|---|---|
| Task 1 | 중 | 틀을 정하는 작업. 사용자 확인을 한 번 받는다 |
| Task 2 | 대 | 글 12쪽 + 데모. 나누어 커밋해도 된다(6개씩) |
| Task 3·4 | 소 | |
| Task 5 | 중 | 다른 라이브러리 값 재확인이 대부분 |
| Task 6 | 소 | |

다음 정기 배포일(12/3)에는 npm README 링크 변경(Task 6)만 해당된다. 사이트는 main push 때 바로 배포된다.
