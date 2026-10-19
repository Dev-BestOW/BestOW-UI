# BestOW UI — Claude 작업 가이드

React + vanilla-extract 기반 디자인 시스템 모노레포. npm 에 `@bestow-ui/*` 로 배포하고, Storybook 을 GitHub Pages 에 배포한다.

**세션을 시작하면 [`docs/ROADMAP.md`](docs/ROADMAP.md) 맨 위 "🔁 다음 세션 시작하기"(인수인계 + 체크리스트)를 먼저 읽고**,
거기 적힌 다음 작업부터 우선순위대로 진행한다. 작업을 끝내면 ROADMAP 의 인수인계 섹션·체크박스·"진행 기록"을 갱신한다.

## 작업 규칙 (반드시 지킬 것)

- **답변은 항상 한국어(해요체)로 한다.** 짧은 진행 안내, 도구 결과 요약, 작업 완료 보고도 예외 없음.
  (지난 세션에서 긴 완료 보고를 영어로 써서 여러 번 지적받았다. 특히 마지막 요약을 쓸 때 주의.)
- **git commit / push 는 하지 않는다.** 사용자가 직접 한다. 작업이 끝나면 바뀐 파일과 확인 결과만 보고한다.
- **작업을 마치면 커밋 메시지를 추천한다** — [gitmoji](https://gitmoji.dev/) + 한국어 한 줄 (기존 기록과 같은 형식,
  예: `✨ LocaleProvider(다국어 문구)와 한글 줄바꿈 기본값 추가`). 여러 영역에 걸치면 짧은 본문(글머리표)을 붙인다.
  자주 쓰는 것: ✨ 기능 · 🐛 버그 · ♻️ 리팩터링 · 📝 문서 · ✅ 테스트 · 💚 CI 수정 · 👷 CI 설정 · ⬆️ 의존성 · 🏷️ 타입 ·
  🗑️ deprecated · 💥 breaking · 🔧 설정 · 📸 스냅숏 · ♿️ 접근성 · 🌐 다국어 · 💄 UI 스타일 · ⚡️ 성능.
- 변경 후에는 아래 "검증" 명령을 모두 실행하고 결과를 보고한다.
- 공개 API 를 바꾸거나 컴포넌트를 추가하면 `.changeset/*.md` 를 만든다 (아래 "배포" 참고).
- 공개 API 이름을 바꿀 때는 옛 이름을 바로 지우지 않는다 — 새 이름 추가 + 옛 이름 `@deprecated` JSDoc + `warnOnce` 개발 모드 경고,
  마이그레이션 가이드(`docs/MIGRATION-<다음 major>.md`) 표에 추가 → 다음 major 에서 제거.

## 구조

```
packages/
  tokens/   @bestow-ui/tokens  원시 디자인 토큰 (palette, space, radius, font*, shadow, duration, zIndex,
                               lightColors/darkColors). 의존성 없음. tsup 빌드.
  icons/    @bestow-ui/icons   SVG → React 아이콘. svg/*.svg 가 원본, src/generated/icons.ts 는 생성물(커밋함).
                               기본 세트는 Lucide(ISC) — LICENSE 유지 필수.
  react/    @bestow-ui/react   테마 + 컴포넌트. tokens, icons, Radix primitives, vanilla-extract 에 의존.
apps/
  storybook/ (private)         Storybook 10. packages/*/src 의 스토리 + apps/storybook/stories(Introduction.mdx, Design Tokens,
                               Theme Builder, Icons, accessibility/ — KWCAG 2.2 대응 문서(데이터 kwcag.ts + Kwcag.mdx),
                               컴포넌트별 키보드·스크린리더 문서(데이터 componentA11y.ts + ComponentA11y.mdx)).
                               사이드바: Introduction → Foundations → Accessibility → Layout → Components → Korean Kit.
                               vite alias 로 dist 가 아닌 각 패키지 src 를 바로 본다.
  playground/ (private)        Next.js 16 App Router 예제 앱. alias 없이 패키지 dist 를 그대로 써서 실제 설치와 같은 조건으로
                               SSR·서버 컴포넌트·portal 테마를 확인한다 (packages 를 먼저 build 해야 함). 헤더에 다크/브랜드 토글.
                               `PLAYGROUND_BASE_PATH` 가 있을 때만 정적 export(+basePath) — Pages 배포용. 평소엔 일반 서버 모드.
                               /orders 는 파일럿 화면(주문 관리 — 여러 컴포넌트를 함께 쓰는 실전 예, docs/PILOT-FINDINGS.md).
                               e2e/ — Playwright E2E(`pnpm test:e2e`, 포트 3107): 콘솔·hydration 오류 0(fixtures 의 자동 검사),
                               mobile.spec.ts 는 `<브라우저>-mobile` 프로젝트(Pixel 7·iPhone 15, 터치·좁은 화면)에서만 — 탭 조작·리플로(가로 스크롤 없음),
                               axe(라이트·다크+브랜드), portal 테마, 키보드 시나리오, 서버 컴포넌트에서 부른 함수.
.github/
  actions/setup/               pnpm + Node(.nvmrc=22) + pnpm install 공통 composite action
  workflows/ci.yml             PR·main: 아이콘 생성물 확인 → lint → format:check → build → size → typecheck → test
                               → test:stories(브라우저 렌더링 + axe, 라이트·다크) → build-storybook → build-playground → test:e2e
                               + browsers job(matrix webkit·firefox): test:stories·test:e2e 를 그 브라우저로 (시각 회귀는 Chromium 만,
                                 스토리가 실패해도 E2E 까지 돈다) + react18 job: pnpm overrides 로 React 18 만 쓰게 한 뒤 react 패키지 typecheck·test
  workflows/visual.yml         PR·main: Playwright Docker 이미지에서 모든 스토리 라이트·다크 스크린샷 비교.
                               새 스토리(기준 이미지 없음)는 자동 생성 → main push 면 봇이 커밋(--update-snapshots=missing).
                               기존 화면이 바뀌면 실패 → 수동 실행 + update 체크 → 기준 이미지 갱신 후 그 브랜치에 봇이 커밋.
                               update 실행은 별도 concurrency 그룹이라 도중에 push 가 와도 취소되지 않고, 커밋 시 브랜치가 앞서 있으면 rebase 후 push
  workflows/size.yml           PR: 번들 크기를 base 와 비교해 PR 코멘트 하나로 보고(push 마다 갱신, scripts/size-report.mjs).
                               보고만 하고 실패하지 않음(한도 검사는 ci.yml). 포크 PR 은 Summary 에만. 버전 PR 은 건너뜀
  workflows/release.yml        main: changesets/action — 버전 PR 생성 또는 npm 배포 (OIDC)
  workflows/storybook.yml      main: Storybook + playground(정적 export, /playground/) 를 GitHub Pages 로 배포
                               → https://dev-bestow.github.io/BestOW-UI/ , …/BestOW-UI/playground/
```

### react 패키지 내부

- `src/theme/contract.css.ts` — `vars`(createGlobalThemeContract, **변수 이름 고정 `--bestow-<경로 kebab>`, 공개 API**)와
  `themeClass.light/dark`. `:root` 에 라이트 기본값. `ThemeTokens` 타입.
- `src/theme/createTheme.ts` — `createTheme(...inputs)`(common/light/dark 깊은 병합 → `BestowTheme`), `themeToStyle`(assignInlineVars).
- `src/theme/color.ts` — `createIntentColors(intent, hex)`: OKLCH 로 라이트·다크 intent 색 세트 생성, WCAG 대비 4.5 보장. `contrastRatio`.
- `src/theme/ThemeProvider.tsx` — `<ThemeProvider theme overrides>`: `data-theme` + 테마 클래스 + 오버라이드 인라인 CSS 변수.
  `theme` 생략 시 바깥 모드 상속, `overrides` 는 바깥과 병합(안쪽 우선). `useTheme()`,
  `usePortalProps()`(portal 요소용 className+style — 오버라이드까지 적용).
- `src/index.ts` = `shared.ts`(서버 컴포넌트에서도 쓰는 순수 함수·값 + hook 없는 표시용 컴포넌트: createTheme, vars, 서식·날짜 함수, en,
  Typography·Stack·Card·Badge·Divider·Progress·Skeleton) + `client.ts`(`'use client'` — 나머지 컴포넌트·hook).
  ESM 빌드는 둘을 `dist/shared.js`·`dist/client.js` 로 나눠 함수가 클라이언트 참조가 되지 않게 한다(tsup.config.ts 주석 참고, CJS 는 한 파일).
  **새 순수 함수와 hook(useId 제외)·Context·Radix·이벤트 핸들러·useMessages 가 없는 표시용 컴포넌트는 shared.ts, 나머지 컴포넌트는 client.ts** 에서
  export 한다. 같은 이름을 양쪽에서 export 하면 안 된다(Next.js 에서 이름이 모호해져 사라짐). `src/shared.test.ts` 가 shared 의 import 그래프에
  클라이언트 전용 코드가 없는지·이름 중복이 없는지 검사한다 — shared 컴포넌트에 hook 을 더해야 하면 client.ts 로 옮긴다(옮기면 서버 컴포넌트 사용자의 `as` 가 깨질 수 있어 신중히).
  playground 첫 페이지(서버 컴포넌트)가 함수를 서버에서 부르고, 서버 함수를 Card `as` 로 넘겨 빌드로 확인한다.
- `src/components/<Name>/` — `<Name>.tsx`, `<Name>.css.ts`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`.
- `src/styles/animations.css.ts` — 공용 keyframes, `reducedMotion` 미디어쿼리.
- `src/i18n/` — `LocaleProvider`·`useMessages()`(기본 문구 바꾸기), `en`(영어 묶음). `BestowMessages` 타입이 문구 키 목록.
- `src/utils/` — `cx`, `mergeRefs`, `useFormattedInput`(하이픈·쉼표 서식 입력: 원본/표시 분리, 커서 유지, 서식 문자 뒤 Backspace),
  `useReturnFocus`(trigger 없는 Dialog 의 포커스 복귀), `date`('YYYY-MM-DD' 문자열 기반 날짜 계산), `koreanFormat`(전화·사업자번호·금액 서식),
  `warnOnce`(개발 모드에서 한 번만 경고 — deprecated 안내), `useIsClient`(hydration 뒤에만 true — 서버·브라우저가 다른 값(오늘 날짜 등)은
  hydration 뒤에 쓴다, Calendar 참고), `useIsomorphicLayoutEffect`(서버에서는 useEffect — React 18 SSR 경고 방지).
- `src/styles/visuallyHidden.css.ts` — 스크린리더 전용 텍스트. `src/test/setup.ts` — jsdom 폴리필(ResizeObserver, pointer capture 등 — node 환경 테스트를 위해 DOM 이 있을 때만).
- `src/utils/focusField.ts` — 칸 id 로 포커스(묶음이면 선택된·첫 항목, 숨긴 input 이면 같은 role=group 의 버튼). ErrorSummary 링크가 쓴다. shared 로 공개.
- `src/test/react-hook-form.test.tsx` — react-hook-form(register·Controller·ErrorSummary) 통합 테스트. 값을 고르는 컴포넌트의 value/onValueChange·id 계약이 바뀌면 여기가 깨진다.
- `src/ssr.test.tsx` — `// @vitest-environment node` 에서 모든 컴포넌트를 renderToString, 경고·오류 0. React 18 SSR 의 useLayoutEffect 경고 같은 것을 잡는다(React 19 는 이 경고가 없음 → CI react18 job). **새 컴포넌트는 여기에도 넣는다.**

## 컴포넌트 작성 규칙

- 스타일 값은 **반드시 `vars`(테마 토큰)로 참조**한다. 하드코딩한 색·간격 금지 (그래야 다크모드·테마 교체가 된다).
- 글자 크기 CSS 변수(`--bestow-font-size-*`)는 **rem** 이다(tokens 의 px 를 theme/contract.css.ts 가 변환) — 사용자 기본 글꼴 크기를 따른다.
  글자가 든 컨트롤은 `height` 대신 `minHeight`(Button·Tabs·Badge·SegmentedControl·Pagination). 예외: 한 줄 Input 은 고정 높이(200% 에도 들어가고
  input 의 height:100% 가 루트를 채움), Avatar 이니셜은 원이 px 고정이라 tokens 의 px. Button 을 더 작게 쓰는 곳은 `minHeight` 도 함께 맞춘다(NumberInput).
  `apps/playground/e2e/zoom.spec.ts` 가 320px 리플로·글자 간격(1.4.12)·기본 글꼴 2배를 확인한다.
- **상태(선택·켜짐·강조·진행률)를 배경색이나 그림자로만 보이면** 고대비 모드에서 사라진다 — `styles/forcedColors.css.ts` 의
  `forcedColors` 미디어쿼리에서 `systemHighlight`(Highlight 배경) 등 시스템 색으로 다시 그린다. 같은 상태의 `:hover` 규칙도 함께 덮는다(더 구체적이라 이긴다).
  `apps/playground/e2e/forced-colors.spec.ts` 가 시스템 강조색인지 확인한다("투명 아님" 검사는 버튼의 ButtonFace 때문에 너무 약하다).
- variant 는 `@vanilla-extract/recipes` 의 `recipe()` 로. prop 이름은 기존과 통일: `variant`, `color`, `size`(sm/md/lg), `fullWidth`.
- `forwardRef` 로 ref 전달, `className` 과 나머지 HTML 속성 전달. HTML `color` 속성과 겹치면 `Omit` 한다.
- 폼 컴포넌트는 TextField/Select 패턴을 따른다: `label`, `helperText`, `error`, `required`, `useId` 로 label/aria-describedby 연결.
  - 값을 고르는 Radix 컴포넌트(Select, Tabs 등)는 `'value' in props` 이면 `value ?? ''` 로 넘겨 **항상 제어 모드**로 둔다
    (`useState<string>()` 처럼 초기값이 없을 때 "uncontrolled → controlled" 경고 방지).
  - 접근 가능한 이름(label)에는 짧은 레이블만 넣고, 보조 설명은 별도 요소 + `aria-describedby` 로 연결한다.
- 오버레이(Popover, Menu 등)는 **Radix primitive** 위에 스타일만 입힌다. Portal 콘텐츠에는 `usePortalProps()` 의 className·style 을 붙이고,
  z-index 는 `vars.zIndex.*` 를 쓴다. 열림/닫힘 애니메이션은 `data-state` 셀렉터 + `reducedMotion` 에서 끈다.
- 아이콘은 `@bestow-ui/icons` 에서 가져온다 (react 패키지 안에 SVG 를 새로 만들지 않는다).
- 다른 컴포넌트로 렌더링하는 prop(`as={NextLink}`, `linkAs`)은 함수라 **서버 컴포넌트에서 넘길 수 없다**.
  서버 컴포넌트에서도 쓰여야 하면 `asChild`(`@radix-ui/react-slot`)를 함께 제공한다(Link 참고).
- 스토리: `tags: ['autodocs']`, Playground + 변형별 스토리. 모든 스토리는 CI 에서 라이트·다크 두 테마로 axe 검사를 통과해야 한다(대비 4.5:1 등).
  스크린샷에서 뺄 스토리는 `tags: ['!visual']`. 열린 상태(목록·팝업)도 axe 로 검사하려면 `play` 로 열어 둔 스토리를 만든다(Combobox "Open").
- 테스트: 역할/라벨 기반(Testing Library), 접근성 속성 확인. 상호작용은 `@testing-library/user-event`(`userEvent.setup()`).
- **최상위 `forwardRef(...)`/`createContext(...)` 에는 `/* @__PURE__ */` 를 붙인다** — 없으면 tree-shaking 이 깨져
  Button 하나만 써도 전체 Radix 가 번들에 들어간다(size-limit 의 "Button 하나" 항목이 감시, 한도 2 kB).
  `.css.ts` 의 recipe() 호출은 `packages/react/tsup.config.ts` 의 `withPureRecipes` 가 빌드 때 자동으로 표시한다.
- 새 컴포넌트는 `packages/react/src/client.ts` 에 export 를 추가한다 (순수 함수·hook 없는 표시용 컴포넌트는 `shared.ts` — 위 "react 패키지 내부" 참고).
- **기본 문구는 `useMessages()` 로**: `prop ?? m.키 ?? '한국어 기본값'`. 새 문구면 `BestowMessages` 에 키를 추가하고 `en` 에도 넣는다.
  1.0 이후 추가하는 키는 **선택(`?`)** 으로 둔다 — 사용자가 직접 만든 `BestowMessages` 객체(다른 언어)가 타입 오류로 깨지지 않게(그러면 breaking).
  한국어 기본값은 공용 객체로 모으지 않는다(모으면 Button 하나에도 모든 문구가 번들에 딸려 와 "Button 하나 2 kB" 를 넘는다).
- 서식이 붙는 입력은 `useFormattedInput` 을, trigger 없이 여닫는 Dialog 류는 `useReturnFocus` 를 쓴다(Modal·Drawer 참고).
- 날짜 값은 시간대 문제가 없는 `'YYYY-MM-DD'` 문자열로 다루고, "오늘" 이 들어가는 컴포넌트는 `today` prop 으로 고정할 수 있게 한다(시각 회귀 안정).
- 접근 가능한 이름은 **화면 글자를 낱말로 포함**해야 한다(axe label-content-name-mismatch, KWCAG 6.5.3) — "15" 버튼 이름은 "15, …" 로 시작.
- 접근성에 영향을 주는 동작을 바꾸면 `apps/storybook/stories/accessibility/` 의 `kwcag.ts`·`componentA11y.ts` 해당 항목도 고친다
  (새 컴포넌트는 componentA11y.ts 에 추가).

### 아이콘 추가

`packages/icons/svg/<kebab-case>.svg`(viewBox 0 0 24 24, `<g>` 없이 평탄한 도형) 를 넣고
`pnpm --filter @bestow-ui/icons generate` → `src/generated/icons.ts` 도 커밋 대상. CI 가 생성물 불일치를 실패 처리한다.

## 명령어

pnpm 은 corepack 으로 실행한다 (`packageManager: pnpm@11.28.2`). 셸에 pnpm 이 없으면 `corepack enable`.

```bash
pnpm install
pnpm storybook                       # http://localhost:6006
pnpm build                           # packages/* (tokens → icons → react 순서)
pnpm typecheck                       # react/storybook 의 typecheck 는 의존 패키지 dist 가 필요 → build 먼저
pnpm test                            # vitest (icons, react) — jsdom 단위 테스트
pnpm test:stories                    # 모든 스토리를 브라우저(로컬은 시스템 Chrome)에서 라이트·다크로 렌더링 + axe. build 먼저
                                     # (vitest project storybook-light / storybook-dark — `--project storybook-dark` 로 하나만)
                                     # 다른 브라우저: STORYBOOK_BROWSERS=webkit (쉼표로 여럿, 기본 chromium). E2E 는 E2E_BROWSERS=webkit
                                     # WebKit·Firefox 는 `pnpm --filter @bestow-ui/storybook exec playwright install webkit firefox` 로 받는다
pnpm test:visual                     # 스크린샷 비교 (build-storybook 먼저). 기준 이미지는 Linux 것만 — 아래 함정 참고
pnpm lint                            # ESLint (typescript-eslint, react-hooks, jsx-a11y, storybook)
pnpm format / pnpm format:check      # Prettier (작은따옴표, 세미콜론, trailing comma, 120자). *.md 는 제외
pnpm size                            # size-limit (.size-limit.json). build 먼저. 전체(80 kB, 큰 회귀만)·Button 하나·대표 조합
                                     # (앱 기본·폼·오버레이·한국 키트 — 현재 +10% 한도). 조합 한도를 넘으면 원인을 먼저 찾고, 올릴 땐 사용자와 결정
pnpm build-storybook
pnpm playground                      # http://localhost:3000 (packages 를 build 한 뒤. dist 를 쓰므로 패키지 수정 후 다시 build)
pnpm build-playground
pnpm test:e2e                        # playground E2E (build + build-playground 먼저). 로컬은 시스템 Chrome, 포트 3107
pnpm --filter @bestow-ui/icons generate
pnpm changeset                       # 변경 내역 기록 (대화형) — 비대화형이면 .changeset/<이름>.md 를 직접 작성
```

### 검증 (변경 후 항상)

```bash
pnpm lint && pnpm format:check && pnpm build && pnpm size && pnpm typecheck && pnpm test && pnpm test:stories \
  && pnpm build-storybook && pnpm build-playground && pnpm test:e2e && rm -rf apps/storybook/storybook-static
```

### 브라우저 점검 (UI 를 바꿨을 때)

반복되는 확인(콘솔·hydration 오류, axe, portal 색, 키보드)은 `apps/playground/e2e` 에 테스트로 둔다 — 새 상호작용을 playground 에
추가하면 E2E 도 함께 추가한다. 일회성 확인만 아래처럼 scratchpad 스크립트로 한다.
시스템 Chrome 이 있으면 scratchpad 에 `playwright-core` 를 설치해(브라우저 다운로드 없음) `chromium.launch({ channel: 'chrome' })` 로
playground(`pnpm --filter @bestow-ui/playground start` 또는 `exec next dev`)를 열고 콘솔 경고·hydration 경고·portal 색을 확인한다.
애니메이션 중에 찍으면 흐리게 나오므로 열고 300~400ms 기다린 뒤 측정·스크린샷한다.
사용자가 이미 `pnpm playground`(포트 3000)를 띄워 두었을 수 있다 — Next.js 는 같은 폴더에서 dev 서버를 하나만 허용하므로
새로 띄우지 말고 그 서버를 사용한다 (사용자 프로세스를 종료하지 않는다).

## 배포

지원 범위(브라우저·React·Next.js)·버전 정책·배포 주기·이전 major 지원은 `SUPPORT.md`, 보안 신고는 `SECURITY.md` — CI 범위나 정책이 바뀌면 함께 고친다.

1. 변경과 함께 `.changeset/<이름>.md` 커밋 (형식: frontmatter 에 `"@bestow-ui/react": minor` 등).
2. main 에 머지되면 release.yml 이 "chore: version packages" PR 을 만든다.
3. 그 PR 을 머지하면 changesets 가 npm 에 배포 + git 태그 + GitHub Release.

버전 규칙(react·tokens 1.0 이후, semver): 기존 이름·타입·CSS 변수를 바꾸거나 지움 = **major**, 새 컴포넌트/기능/prop = minor,
버그·내부 변경 = patch. 이름을 바꿀 때는 위 "작업 규칙" 의 deprecated 절차를 먼저 minor 로 배포한다. icons 는 아직 0.x(기능 = minor).

## 꼭 알아야 할 함정 (실제로 겪은 문제)

- **pnpm 11 필수.** pnpm 10 의 `publish` 는 npm Trusted Publishing(OIDC)을 지원하지 않는다. pnpm 11 은
  `pnpm-workspace.yaml` 에서 `onlyBuiltDependencies` 대신 `allowBuilds` 를 쓰고, 기본으로 **올라온 지 24시간 미만인 패키지를
  거부(minimumReleaseAge)** 한다 → 방금 나온 버전 설치가 실패하면 이 정책 때문이다.
- **npm 인증은 토큰 없이 OIDC.** 각 패키지의 npm Trusted Publisher 설정: `Dev-BestOW` / `BestOW-UI` / `release.yml` /
  Environment 비움 / **"Direct publishing" 체크 필수** (2026-09-03 이후 생성 설정은 기본이 stage publish 만 허용 →
  `E403 OIDC permission denied for this action`). 설정은 수정 불가, 삭제 후 재생성.
- **새 패키지를 추가하면** npm 에 패키지가 없어 Trusted Publisher 를 설정할 수 없다. 첫 버전은 사용자가 로컬에서
  `npm login` 후 직접 배포하고, 그 다음 Trusted Publisher(Direct publishing 체크)를 만든다. (icons 0.1.0 이 이렇게 배포됨)
- `@bestow` 스코프는 다른 회사(Bestow Inc) 소유라 쓸 수 없다. 스코프는 `@bestow-ui`.
- GitHub Actions 로그는 인증이 필요해 Claude 가 직접 못 읽는다(공개 API 로 run/step 상태와 annotation 만 보임).
  배포 실패 시 추측으로 고치지 말고 사용자에게 **"Create release PR or publish" 단계 로그**를 붙여 달라고 요청한다.
- Radix 의 portal 콘텐츠는 ThemeProvider div 밖(body)에 렌더링된다 → `usePortalProps()` 를 안 붙이면 다크모드·브랜드 테마가 깨진다.
- `vars` 의 CSS 변수 이름(`--bestow-*`)은 사용자가 CSS 로 덮어쓰는 공개 API 다. 토큰 키 이름을 바꾸면 breaking change.
  `src/theme/contract.test.ts` 가 이름 목록을 고정한다 — 토큰을 **추가**하면 그 목록에도 더한다.
- npm 배포를 실행하는 명령(`changeset publish`, `pnpm publish` 실제 실행)은 Claude 가 실행하지 않는다.
- esbuild 는 압축하지 않은 CSS 에 파일마다 vanilla-extract 이름(`vanilla-extract-css-ns:…?source=<원본 base64>`)을 주석으로 남긴다 —
  styles.css 의 3/4 이 이것이었다. `tsup.config.ts` 의 `shortenCssSourceNames` 가 경로만 남기고(남으면 빌드 실패), size-limit 한도는 12 kB.
  CSS 크기를 잴 때는 이 처리 뒤의 dist/index.css 로 잰다.
- **vanilla-extract 는 `.css.ts` 를 평가할 때 Storybook 의 alias 를 거치지 않고 `packages/tokens/dist` 를 읽는다.**
  토큰 값을 바꾸면 `pnpm build` 를 해야 Storybook·스토리 테스트에 반영된다 (JS import 는 src alias).
- 스토리 테스트 첫 실행(캐시 없음, CI)에서 Vite 가 늦게 발견한 의존성을 최적화하며 페이지를 다시 불러오면 테스트 파일이 통째로 실패한다
  ("Failed to fetch dynamically imported module"). `.storybook/main.ts` 의 `optimizeDeps.include` 에 추가한다.
  react 패키지의 의존성은 루트에서 못 찾으므로 `'@bestow-ui/react > 패키지'` 형식으로 쓴다.
- ESLint 는 9.x 를 쓴다 — `eslint-plugin-jsx-a11y` 가 아직 ESLint 10 을 지원하지 않는다.
- 열린 상태(목록·대화상자) 스토리는 `defaultOpen` 이 아니라 **`play` 로 연다** — defaultOpen 은 자동 문서 페이지에서도 열려 문서를 가린다.
  시각 회귀는 play 가 끝난 뒤(`__STORYBOOK_PREVIEW__.currentRender.phase === 'finished'`, Storybook 10 기준) 찍는다.
  play 안에서 열린 요소는 `toBeVisible()` 이 아니라 `toBeInTheDocument()` 로 확인한다(여는 애니메이션 중 opacity 0).
  모달형 Select·DropdownMenu 를 연 스토리는 axe `aria-hidden-focus` 를 그 스토리에서만 끈다 — Radix 가 바깥(트리거 포함)을
  aria-hidden 으로 숨기고 포커스를 가두는 정상 패턴이라 실제로는 닿지 않는다(Modal·Drawer 는 걸리지 않음).
- 시각 회귀 기준 이미지(`apps/storybook/visual/__screenshots__/linux`)는 **Linux Docker 이미지에서만** 만든다(글꼴·렌더링 차이).
  `playwright`/`@playwright/test` 버전과 visual.yml 의 `mcr.microsoft.com/playwright:vX.Y.Z` 태그를 항상 같이 올린다.
  macOS 에서 돌리면 `__screenshots__/darwin` 에 따로 저장된다(커밋 안 함).
- CI 러너는 `ubuntu-24.04` 로 고정했다 (`ubuntu-latest` 가 2026-10-19 부터 Ubuntu 26). 올릴 때는 모든 workflow 를 같이 바꾸고
  `playwright install --with-deps` 가 새 OS 를 지원하는지 확인한다.
- Storybook 의 react-docgen 은 `Omit<ButtonProps, …>` 처럼 **다른 컴포넌트 props 를 물려받은 타입을 풀지 못한다** → 자동 문서에 타입이 비고,
  `color` 같은 이름은 색상 선택기로 잘못 잡혀 "Control of type color only supports string" 경고가 난다. 주요 prop 은 직접 선언한다(IconButton·TextField·
  PhoneNumberInput 참고). 유니온 타입이라 다시 선언할 수 없으면(Accordion) 스토리 meta 의 `argTypes` 에 설명·타입을 적는다.
- **jsdom 은 커서(selection)를 실제 브라우저와 다르게 다룬다** — 커서 위치 테스트는 스토리 `play`(실제 Chromium)로 한다.
  이때 서식 적용 전후 문자열이 **달라지는** 입력을 골라야 한다(같으면 React 가 값을 다시 쓰지 않아 복원 코드 없이도 통과한다).
- 테스트가 너무 쉽게 통과하면 의심한다 — 구현을 망가뜨려도 통과한다면 테스트가 그 상황을 만들지 못한 것(DatePicker 덮어쓰기 사례).
- Radix RadioGroup 은 "포커스가 옮겨질 때 화살표 키가 아직 눌려 있는지(document keydown/keyup)" 로 선택을 정한다 →
  키를 바로 떼는 입력(user-event·Playwright press·일부 보조기기)에서는 포커스만 옮겨지고 선택이 빠질 수 있다(jsdom 은 항상 빠짐).
  그래서 SegmentedControl 은 button 으로 직접 구현했고, RadioGroup 은 1.2.0 에서 **네이티브 `<input type="radio">`** 로 바꿨다(E2E 20회 중 19회 실패 → 0).
  네이티브 radio 는 `aria-checked` 가 없다 — 테스트는 `.checked`(jsdom)·`toBeChecked()`(Playwright)로. name 이 없을 때는 만든 name + 존재하지 않는
  `form` id 로 폼 제출에서 뗀다. 선택 점은 `appearance: none` + inset box-shadow, 고대비 모드에서는 `appearance: auto` 로 되돌린다.
- **Safari(WebKit) 기본 동작** — Tab 이 링크를 건너뛴다(Option+Tab 이 링크까지), 버튼·라디오·체크박스를 클릭해도 포커스를 주지 않는다,
  네이티브 라디오는 끝에서 처음으로 돌지 않는다. E2E 는 이 차이에 기대지 않게 쓴다(`test.info().project.name === 'webkit'` 분기는 최소로).
- 모바일 에뮬레이션에서 페이지가 넘치면 브라우저가 화면 폭(innerWidth)을 넓혀 버린다 — 리플로 검사는 `page.viewportSize().width`(기기 폭)와 비교한다.
  playground 의 가로 줄(Stack direction="row")에는 `wrap` 을 준다(좁은 화면에서 머리글·버튼 줄이 넘쳐 다른 요소를 덮었다).
- E2E 실패 원인은 CI 에서 `github` reporter 의 annotation 으로 남는다 — `curl https://api.github.com/repos/Dev-BestOW/BestOW-UI/check-runs/<job id>/annotations` 로 읽는다.
- React 18 로 테스트할 때 react 패키지만 18 로 바꾸면 Radix·icons 가 19 를 물어 두 벌이 섞인다("Objects are not valid as a React child"). pnpm overrides 로 전체를 맞춘다(ci.yml react18).
- 이 Mac(macOS 27)에서는 Playwright Firefox 가 "Could not find profile folder" 로 실행되지 않는다(샌드박스와 무관) — Firefox 는 CI(Linux)에서 확인한다.
- Radix Popover Content 는 기본 `role="dialog"` — 목록 팝업(Combobox)으로 쓸 때는 `role="presentation"` 으로 덮어쓴다(props 가 뒤에 적용됨).
- MDX 문서 페이지는 스토리 axe 테스트 대상이 아니다 — 문서에 컴포넌트를 그리면 axe 를 직접 돌려 확인한다.
  Storybook 문서의 기본 표 스타일이 Table 컴포넌트를 덮으므로 `<Unstyled>` 로 감싼다. MDX 는 GFM 표를 지원하지 않는다.
- 외부 서비스(카카오 우편번호 등)는 공급자(provider)로 주입하고, 테스트·기본 스토리는 가짜 공급자로 네트워크 없이 돌린다.
- GitHub Actions `pull_request` 의 `branches`/`branches-ignore` 는 **base 브랜치** 기준이다. head 브랜치(예: changeset-release/**)로 거르려면 job 의 `if` 를 쓴다.
