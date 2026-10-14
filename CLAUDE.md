# BestOW UI — Claude 작업 가이드

React + vanilla-extract 기반 디자인 시스템 모노레포. npm 에 `@bestow-ui/*` 로 배포하고, Storybook 을 GitHub Pages 에 배포한다.

**다음 작업은 [`docs/ROADMAP.md`](docs/ROADMAP.md) 를 먼저 읽고 우선순위대로 진행한다.** 작업을 끝내면 ROADMAP 의 체크박스와 "진행 기록"을 갱신한다.

## 작업 규칙 (반드시 지킬 것)

- **답변은 항상 한국어(해요체)로 한다.** 짧은 진행 안내, 도구 결과 요약도 예외 없음.
- **git commit / push 는 하지 않는다.** 사용자가 직접 한다. 작업이 끝나면 바뀐 파일과 확인 결과만 보고한다.
- 변경 후에는 아래 "검증" 명령을 모두 실행하고 결과를 보고한다.
- 공개 API 를 바꾸거나 컴포넌트를 추가하면 `.changeset/*.md` 를 만든다 (아래 "배포" 참고).

## 구조

```
packages/
  tokens/   @bestow-ui/tokens  원시 디자인 토큰 (palette, space, radius, font*, shadow, duration, zIndex,
                               lightColors/darkColors). 의존성 없음. tsup 빌드.
  icons/    @bestow-ui/icons   SVG → React 아이콘. svg/*.svg 가 원본, src/generated/icons.ts 는 생성물(커밋함).
                               기본 세트는 Lucide(ISC) — LICENSE 유지 필수.
  react/    @bestow-ui/react   테마 + 컴포넌트. tokens, icons, Radix primitives, vanilla-extract 에 의존.
apps/
  storybook/ (private)         Storybook 10. packages/*/src 의 스토리 + apps/storybook/stories(아이콘 갤러리 등).
                               vite alias 로 dist 가 아닌 각 패키지 src 를 바로 본다.
  playground/ (private)        Next.js 16 App Router 예제 앱. alias 없이 패키지 dist 를 그대로 써서 실제 설치와 같은 조건으로
                               SSR·서버 컴포넌트·portal 테마를 확인한다 (packages 를 먼저 build 해야 함). 헤더에 다크/브랜드 토글.
                               `PLAYGROUND_BASE_PATH` 가 있을 때만 정적 export(+basePath) — Pages 배포용. 평소엔 일반 서버 모드.
.github/
  actions/setup/               pnpm + Node(.nvmrc=22) + pnpm install 공통 composite action
  workflows/ci.yml             PR·main: 아이콘 생성물 확인 → build → typecheck → test → build-storybook → build-playground
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
  `usePortalProps()`(portal 요소용 className+style — 오버라이드까지 적용). `usePortalClassName()` 은 deprecated.
- `src/components/<Name>/` — `<Name>.tsx`, `<Name>.css.ts`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`.
- `src/styles/animations.css.ts` — 공용 keyframes, `reducedMotion` 미디어쿼리.
- `src/utils/` — `cx`, `mergeRefs`. `src/test/setup.ts` — jsdom 폴리필(ResizeObserver, pointer capture 등).

## 컴포넌트 작성 규칙

- 스타일 값은 **반드시 `vars`(테마 토큰)로 참조**한다. 하드코딩한 색·간격 금지 (그래야 다크모드·테마 교체가 된다).
- variant 는 `@vanilla-extract/recipes` 의 `recipe()` 로. prop 이름은 기존과 통일: `variant`, `color`, `size`(sm/md/lg), `fullWidth`.
- `forwardRef` 로 ref 전달, `className` 과 나머지 HTML 속성 전달. HTML `color` 속성과 겹치면 `Omit` 한다.
- 폼 컴포넌트는 TextField/Select 패턴을 따른다: `label`, `helperText`, `error`, `required`, `useId` 로 label/aria-describedby 연결.
  - 값을 고르는 Radix 컴포넌트(Select, RadioGroup 등)는 `'value' in props` 이면 `value ?? ''` 로 넘겨 **항상 제어 모드**로 둔다
    (`useState<string>()` 처럼 초기값이 없을 때 "uncontrolled → controlled" 경고 방지).
  - 접근 가능한 이름(label)에는 짧은 레이블만 넣고, 보조 설명은 별도 요소 + `aria-describedby` 로 연결한다.
- 오버레이(Popover, Menu 등)는 **Radix primitive** 위에 스타일만 입힌다. Portal 콘텐츠에는 `usePortalProps()` 의 className·style 을 붙이고,
  z-index 는 `vars.zIndex.*` 를 쓴다. 열림/닫힘 애니메이션은 `data-state` 셀렉터 + `reducedMotion` 에서 끈다.
- 아이콘은 `@bestow-ui/icons` 에서 가져온다 (react 패키지 안에 SVG 를 새로 만들지 않는다).
- 스토리: `tags: ['autodocs']`, Playground + 변형별 스토리. 테스트: 역할/라벨 기반(Testing Library), 접근성 속성 확인.
- 새 컴포넌트는 `packages/react/src/index.ts` 에 export 를 추가한다.

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
pnpm test                            # vitest (icons, react)
pnpm build-storybook
pnpm playground                      # http://localhost:3000 (packages 를 build 한 뒤. dist 를 쓰므로 패키지 수정 후 다시 build)
pnpm build-playground
pnpm --filter @bestow-ui/icons generate
pnpm changeset                       # 변경 내역 기록 (대화형) — 비대화형이면 .changeset/<이름>.md 를 직접 작성
```

### 검증 (변경 후 항상)

```bash
pnpm build && pnpm typecheck && pnpm test && pnpm build-storybook && pnpm build-playground && rm -rf apps/storybook/storybook-static
```

### 브라우저 점검 (UI 를 바꿨을 때)

시스템 Chrome 이 있으면 scratchpad 에 `playwright-core` 를 설치해(브라우저 다운로드 없음) `chromium.launch({ channel: 'chrome' })` 로
playground(`pnpm --filter @bestow-ui/playground start` 또는 `exec next dev`)를 열고 콘솔 경고·hydration 경고·portal 색을 확인한다.
애니메이션 중에 찍으면 흐리게 나오므로 열고 300~400ms 기다린 뒤 측정·스크린샷한다.
사용자가 이미 `pnpm playground`(포트 3000)를 띄워 두었을 수 있다 — Next.js 는 같은 폴더에서 dev 서버를 하나만 허용하므로
새로 띄우지 말고 그 서버를 사용한다 (사용자 프로세스를 종료하지 않는다).

## 배포

1. 변경과 함께 `.changeset/<이름>.md` 커밋 (형식: frontmatter 에 `"@bestow-ui/react": minor` 등).
2. main 에 머지되면 release.yml 이 "chore: version packages" PR 을 만든다.
3. 그 PR 을 머지하면 changesets 가 npm 에 배포 + git 태그 + GitHub Release.

버전 규칙(0.x 동안): 새 컴포넌트/기능 = minor, 버그·내부 변경 = patch.

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
- npm 배포를 실행하는 명령(`changeset publish`, `pnpm publish` 실제 실행)은 Claude 가 실행하지 않는다.
