# BestOW UI 로드맵 — 완료 기록 (P1 ~ P6)

> 완료된 단계의 설계 메모·결정 이유·함정 기록 보관용. 현재 계획은 [`ROADMAP.md`](ROADMAP.md).
> 여기 적힌 "커밋 전" 등의 표기는 당시 상태다 (모두 커밋·배포됨).

## P1. 다른 프로젝트에서 쓰기 위한 기반 ⭐

### P1-1. 사용자 테마 커스터마이징 — [x] 완료 (2026-10-14, react 0.3.0 배포)

**왜:** 지금은 light/dark 두 테마가 고정이라 프로젝트마다 브랜드 색·글꼴·radius 를 바꿀 수 없다. MUI 의 `createTheme` 에 해당하는 기능이 없으면 "가져다 쓰는" 디자인 시스템이 되기 어렵다.

**현재 구조의 한계**
- `packages/react/src/theme/contract.css.ts` 의 `createThemeContract` 는 CSS 변수 이름이 해시(`--xrnmlt0` 등)라서 사용자가 CSS 로 덮어쓸 수 없다.
- 테마 값은 빌드 타임에 `createTheme` 으로 고정된다.

**확정된 API (사용자 결정: 모드와 브랜드 분리, 색 자동 생성 포함)**
`createTheme(...inputs: { common?, light?, dark? }[])` → `<ThemeProvider theme={mode} overrides={brand}>`,
`createIntentColors(intent, hex)`, `usePortalProps()`. 아래는 당시 설계 메모.

**설계 방향**
1. 계약을 `createGlobalThemeContract` 로 바꿔 **안정적인 변수 이름**을 쓴다: `--bestow-color-primary-solid`, `--bestow-space-4` …
   → 사용자가 순수 CSS 로도 덮어쓸 수 있다. (`vars` 를 쓰는 컴포넌트 코드는 바뀌지 않는다.)
2. 런타임 오버라이드: `@vanilla-extract/dynamic` 의 `assignInlineVars` 로 ThemeProvider div 에 인라인 CSS 변수를 넣는다.
   ```tsx
   const brand = createTheme({ color: { primary: { solid: '#7c3aed', solidHover: '#6d28d9', /* … */ } }, radius: { md: '6px' } });
   <ThemeProvider theme="light" overrides={brand}>…</ThemeProvider>
   ```
   - `createTheme(partial)` 은 DeepPartial 토큰을 받아 검증·병합만 하는 순수 함수 (light/dark 별로 따로 줄 수 있게 `{ light?, dark? }` 형태도 검토).
   - (선택) `createIntentColors('#7c3aed')` 처럼 대표색 하나로 solid/solidHover/subtle/subtleHover/text/contrast 를 만들어 주는 헬퍼.
3. **portal 에도 같은 오버라이드가 적용돼야 한다.** `usePortalClassName()` 을 `usePortalProps()`(className + style 반환) 로 확장하거나,
   context 로 인라인 변수를 넘겨 Modal/Select/Tooltip/Toast 콘텐츠에 같이 적용한다.

**완료 조건**
- [x] `overrides` 로 primary 색을 바꾸면 Button·Checkbox·Select 등 모든 컴포넌트에 반영된다.
- [x] portal 콘텐츠(Modal, Select 목록, Tooltip, Toast)에도 반영된다 (테스트로 확인).
- [x] 중첩 ThemeProvider 에서 안쪽 오버라이드가 우선한다.
- [x] CSS 변수 이름이 문서화된다 (README 또는 Storybook 문서).
- [x] Storybook 에 "Theming" 스토리 (color control 로 primary 를 바꿔 보는 예시).
- [x] changeset: react minor, tokens(타입 export 추가 시) minor.

### P1-2. Next.js 예제 앱 (`apps/playground`) — [x] 완료 (2026-10-14)

**왜:** 실제 사용 환경(SSR, React Server Components, `styles.css` import)에서의 문제를 배포 전에 잡기 위해.

**할 일**
- `apps/playground` 에 Next.js(App Router) 앱을 만든다. private, changesets `ignore` 에 추가.
- Storybook 과 달리 **alias 를 쓰지 않고 패키지의 `dist` 를 그대로 사용**해 실제 설치와 같은 조건으로 확인한다 (`workspace:*` 의존성 + `pnpm build` 선행).
- `app/layout.tsx` 에서 `import '@bestow-ui/react/styles.css'`, ThemeProvider + ToastProvider 적용, 다크모드 토글.
- 페이지 예시: 서버 컴포넌트 페이지(Typography, Stack, 아이콘), 클라이언트 상호작용 페이지(Modal, Select, Toast, 폼).
- CI 에 `pnpm --filter playground build` 단계 추가.

**확인할 것 / 알려진 쟁점**
- react 패키지는 번들 전체에 `"use client"` 배너가 붙어 있다 → 서버 컴포넌트에서 import 는 되지만 모든 컴포넌트가 클라이언트 경계가 된다. 문제가 되면 서버 안전 컴포넌트(Typography, Stack 등)를 별도 엔트리로 분리하는 것을 검토.
- icons 는 hook 이 없어 서버 컴포넌트에서 바로 쓸 수 있어야 한다.
- pnpm 11 의 minimumReleaseAge(24시간) 때문에 Next.js 최신 버전 설치가 막히면 하루 전 버전을 쓴다.

**완료 조건**
- [x] `next build` 성공, 개발 모드에서 hydration 경고 없음.
- [x] 다크모드 전환 시 portal 콘텐츠까지 색이 맞다.
- [x] CI 에서 playground 빌드가 돈다.

**결과 메모 (Next.js 16.4.0, Turbopack)**
- 추가 설정 없이 `next build` 성공. 서버 컴포넌트 페이지에서 react 컴포넌트(클라이언트 경계)와 아이콘(서버 렌더링) 모두 정상.
- 시스템 Chrome + `playwright-core` 로 자동 점검: 개발·프로덕션 모드 콘솔 경고 0, hydration 경고 0.
  다크모드 + 브랜드 테마에서 Select 목록·Modal·Toast·Tooltip 색이 모두 맞음.
- 점검 중 발견해 고친 것: ① 브랜드 primary 를 바꿔도 포커스 링(`border.focus`)이 기본 파랑으로 남음 → `createIntentColors('primary')` 가 함께 설정
  ② `useState<string>()` 로 Select 를 제어하면 "uncontrolled → controlled" 경고 → `value` prop 을 넘기면 undefined 여도 제어 모드로 처리.
- `"use client"` 배너 때문에 모든 react 컴포넌트가 클라이언트 경계가 되는 점은 현재 문제 없음. 서버 전용 번들 크기가 문제 되면 그때 엔트리 분리 검토 (백로그).

---

## P2. 자주 쓰는 컴포넌트 채우기

공통 규칙은 CLAUDE.md "컴포넌트 작성 규칙". 각 컴포넌트: 구현 + 스토리 + 테스트 + `index.ts` export + changeset(react minor).
Radix 패키지를 추가할 때는 개별 패키지(`@radix-ui/react-*`)를 `packages/react` dependencies 에 넣는다.

권장 순서와 메모:

**P2-1. 폼** — 완료 (2026-10-14)
- [x] **Switch** — `@radix-ui/react-switch`. Checkbox 와 같은 API(`label`, `size`, `disabled`).
- [x] **RadioGroup** — `@radix-ui/react-radio-group`. `options` 배열 또는 `RadioGroup.Item` 조합, `orientation`, `label`/`helperText`/`error`.
- [x] **Textarea** — Input 스타일 재사용, `TextField` 처럼 label/helperText/error, (선택) `autoResize`.

**P2-2. 표시** — 완료 (2026-10-15)
- [x] **Spinner** — `LoaderIcon` + 회전 애니메이션(reducedMotion 시 느리게). `role="status"` + 숨김 텍스트 `label`(기본 "로딩 중", 빈 문자열이면 장식용).
  이어서 **Button `loading` prop** — startIcon 자리에 스피너, `aria-busy`·`aria-disabled`, 클릭·폼 제출 차단 (`disabled` 를 쓰지 않아 포커스 유지).
- [x] **Badge** — `variant`(solid/soft/outline) × `color`(primary/neutral/danger/success), `size`(sm/md/lg), `startIcon`. 기본 soft/neutral, pill 모양.
  12개 조합 모두 라이트·다크에서 대비 4.5 이상 확인.
- [x] **Card** — `variant`(outline/elevated/soft), `padding`(none/sm/md/lg), `as`. 영역은 named export `CardHeader`/`CardBody`/`CardFooter`
  (`ModalClose` 처럼 점 표기 대신 개별 export). elevated 는 다크에서 그림자가 안 보여 테두리를 함께 둔다.
- [x] **Divider** — 가로/세로(`aria-orientation`), `role="separator"`, `decorative`(role=none). 가운데 텍스트(`children`)가 있으면
  separator 대신 텍스트를 읽히게 하고 선만 `aria-hidden` (separator 의 자식은 스크린리더가 읽지 않으므로). Radix 없이 직접 구현.
- [x] **Avatar** — `@radix-ui/react-avatar`. `src`, `alt`/`name`, `size`(sm/md/lg = 28/36/48px), `shape`(circle/square), `fallback`.
  실패 시 이니셜("Jane Doe"→JD, "홍길동"→홍) → `UserIcon`. 이름은 루트에 `role="img"`+`aria-label`(로딩 상태와 무관하게 같은 이름), 이름 없으면 aria-hidden.
- [x] **Skeleton** — `variant`(text/rect/circle), `width`/`height`(숫자=px, CSS 변수로 전달), `lines`(마지막 줄 60%). shimmer, reducedMotion 시 정지.
  장식용 `aria-hidden` — 로딩 상태는 감싸는 영역의 `aria-busy` 로 알린다(스토리·playground 예시).

**P2-3. 탐색·오버레이** — 완료 (2026-10-15)
- [x] **Tabs** — `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`. `variant`(line/soft), `size`(sm/md), `activationMode`. variant·size 는 context 로 전달.
  `value` 를 넘기면 `?? ''` 로 항상 제어 모드. (세로 `orientation` 은 미지원 — 필요하면 추가)
- [x] **DropdownMenu** — Root/Trigger/Group 은 Radix 그대로, `DropdownMenuContent`(portal + `usePortalProps`, `side`/`align`),
  `DropdownMenuItem`(`icon`, `shortcut`, `color="danger"`), `Label`, `Separator`. 아이콘·단축키는 `aria-hidden` 이라 항목 이름에 섞이지 않는다.
  (CheckboxItem/RadioItem/Sub 메뉴는 미구현 — 백로그)
- [x] **Popover** — props 기반(Tooltip 과 같은 `side`/`align`). `title`(h2 + `aria-labelledby`) 또는 `aria-label`, `showClose`, `showArrow`, `modal`, `PopoverClose`.
  `showClose` 이면 열릴 때 첫 포커스가 X 버튼으로 간다 (Modal 과 같은 동작).
- [x] **Accordion** — `Accordion`(type single/multiple, collapsible) + `AccordionItem`(`title`, `headingLevel` 기본 3, `disabled`).
  높이 애니메이션은 `--radix-accordion-content-height`, reducedMotion 시 끔. 제어 모드는 single `''` / multiple `[]`.
- [x] **Pagination** — 직접 구현. 계산은 `getPaginationItems`(내부 함수, MUI 방식: 항목 수 일정). `nav` > `ul` > `button`,
  `aria-current="page"`, 생략 부호 `aria-hidden`, `getItemLabel` 로 다국어. 제어/비제어 모두 지원, 범위 밖 page 는 보정.

토큰이 더 필요하면(예: `success` 외 `warning` 색) tokens 에 추가하고 light/dark 둘 다 정의한다.

---

## P3. 품질 자동화

- [x] **접근성 검사를 CI 에서 실행** (2026-10-15) — `@storybook/addon-vitest` + Vitest 브라우저 모드(Playwright). `pnpm test:stories`.
  로컬은 시스템 Chrome(`channel: 'chrome'`), CI 는 `playwright install --with-deps chromium`. 스토리 99개(라이트) 렌더링 + axe.
  처음 돌렸을 때 실제 위반 발견 → 수정: 라이트 `fg.subtle`(gray600) 대비 3.32 → `#666e76`(5.18), RadioGroup 비활성 설명 흐림 제거.
  캐시 없는 첫 실행에서 Vite 재로딩으로 파일이 실패 → `optimizeDeps.include` (CLAUDE.md 함정 참고).
  다크 테마도 검사 (2026-10-15): vitest `projects` 로 `storybook-light`/`storybook-dark` 두 project, 각각 `storybookTest({ initialGlobals: { theme } })`.
- [x] **ESLint + Prettier** (2026-10-15) — ESLint 9 flat config(`eslint.config.mjs`): js recommended, typescript-eslint, react-hooks(recommended-latest),
  jsx-a11y, storybook, eslint-config-prettier. Prettier: 작은따옴표·세미콜론·trailing comma·120자, `*.md` 제외. 저장소 전체 한 번 포맷.
  CI 에 `pnpm lint`, `pnpm format:check`.
- [x] **번들 크기 검사** (2026-10-15) — `size-limit`(rolldown) + `.size-limit.json`. CI `pnpm size`.
  react 전체 JS 50 kB/55, **Button 하나 2.4 kB/3**, styles.css 20.4 kB/23, 아이콘 하나 366 B/500, tokens 1.15 kB/1.5 (brotli).
  도입하면서 발견: `forwardRef` 에 `/* @__PURE__ */` 가 없어 Button 하나만 써도 40 kB(거의 전체) → 소스에 annotation 추가로 해결.
  (PR 코멘트로 크기 변화를 보여 주는 size-limit-action 은 미도입 — 필요하면 추가)
- [x] **시각 회귀 테스트** (2026-10-15, 사용자 선택: Playwright 스크린샷) — `apps/storybook/visual/`. storybook-static 의 index.json 에서
  모든 스토리를 라이트·다크로 찍어 비교(198장). `.github/workflows/visual.yml` 은 `mcr.microsoft.com/playwright:v1.64.0-noble` 컨테이너에서 실행,
  수동 실행 + update 로 기준 이미지 갱신·봇 커밋. 로컬(macOS)에서 2회 연속 동일, Badge 모양을 바꾸면 해당 스토리만 실패하는 것 확인.
  **기준 이미지(linux)는 아직 없음 — 위 "마지막 상태" 참고.**
- [x] **버전 PR 의 CI ❌ 정리** (2026-10-15, 다음 버전 PR 에서 동작 확인 필요) — 조사 결과: 버전 PR #7~#10 모두 CI run 이 `github-actions[bot]` 으로 생성되지만 **job 0개로 대기하다가
  PR 머지 순간 failure** 로 끝남(머지 시각과 1초 차). 코드 실패가 아니라 run 이 시작되지 못한 것. 봇이 만든 PR 의 workflow 승인 대기로 추정되나
  로그를 볼 수 없어 **사용자에게 버전 PR 의 Checks 화면 메시지 확인을 요청함.**
  - **확인됨:** run 화면 메시지 "This workflow run required approval but was not approved before it expired."
  - **해결:** release.yml 이 `actions/create-github-app-token@v3`(`client-id` 입력 — `app-id` 는 deprecated)로 App 토큰을 받아
    `changesets/action` 의 `github-token` 입력에 넘긴다(v2 는 `GITHUB_TOKEN` 환경 변수를 읽지 않는다). 커밋·태그는 API 로 push 되므로
    checkout 토큰은 그대로, workflow `permissions` 는 `contents: read` + `id-token: write` 로 줄임.
    App: `bestow-ui-release`(Contents·Pull requests 읽기/쓰기, BestOW-UI 에만 설치). 키는 App 설정 Credentials → **Key pairs** 탭
    (예전 General 의 "Private keys"). Variable/Secret 은 **Repository** 범위(Environment 를 쓰면 npm Trusted Publisher 조건이 어긋남).
  - 주의: `pull_request.branches-ignore` 는 base 브랜치 기준이라 head 가 changeset-release/** 인 PR 을 거를 수 없다 → job `if` 로 거른다.

---

## P4. 문서

- [x] **Storybook 시작하기 페이지** (2026-10-15, `apps/storybook/stories/Introduction.mdx`) — 설치, `styles.css` import, ThemeProvider/ToastProvider 설정, 다크모드, 아이콘 사용법, (P1-1 이후) 테마 커스터마이징.
- [x] **디자인 토큰 페이지** (2026-10-15, `apps/storybook/stories/Tokens.stories.tsx` → Foundations/Design Tokens) — Colors(의미 색상 light/dark 나란히 + 팔레트),
  Typography(family·size·weight·lineHeight + variant 스케일), Spacing, Radius, Shadow, Duration·zIndex. `@bestow-ui/tokens` 값을 읽어 자동으로 그리고,
  미리보기 도형은 `vars` 로 그려 브랜드 테마가 반영된다. 일반 스토리라서 axe·시각 회귀 대상.
- [x] **기여 가이드** (2026-10-15, 루트 `CONTRIBUTING.md`) — 개발 환경, 작업 흐름, 컴포넌트 체크리스트·스타일/폼/오버레이/스토리/테스트 규칙,
  아이콘 추가, 토큰 수정, changeset 작성법. README 는 이 문서로 연결.
  - 참고: Storybook MDX 는 GFM 표를 지원하지 않는다(remark-gfm 미설정) → Introduction 에서는 표 대신 목록을 쓴다.
    MDX 안의 `?path=/story/...` 링크는 manager 안에서 정상 이동한다. 사이드바 순서는 `preview.tsx` 의 `storySort`.

---

## P5. 다음 후보 (2026-10-15 정리, 순서는 추천 — 사용자와 확정)

- [x] **npm 패키지 페이지 정리** (2026-10-15, 커밋 b511f80) — 세 패키지에 README(영어 + 한국어, 사용자 선택)·LICENSE(MIT © Dev-BestOW, icons 는 기존 ISC 유지),
  `keywords`·`author`·`bugs`·설명 보강, 루트 `LICENSE` 추가. changeset `npm-readme`(세 패키지 patch) — npm 페이지는 다음 배포부터 바뀐다.
  icons 도 이번에 처음 CI 로 배포되어 provenance·GitHub Release 가 생긴다. (GitHub 저장소 About 의 설명·website·topics 는 비어 있음 — 사용자가 설정)
- [ ] **시각 회귀 기준 이미지 생성** (사용자: Visual regression → Run workflow, update 체크). 없으면 시각 회귀가 동작하지 않는다.
- [x] **CI 러너 고정** (2026-10-15, 커밋 e542386 — 모든 workflow `runs-on: ubuntu-24.04`) — `ubuntu-latest` 가 2026-10-19 부터 Ubuntu 26 으로 바뀐다. ci/release/storybook 은 `playwright install --with-deps`
  등 OS 패키지에 의존하므로 `ubuntu-24.04` 로 고정하고, 26 대응은 따로 확인한다. (visual.yml 은 컨테이너라 영향 적음)
- [x] **다크 모드 shadow** (2026-10-15, 커밋 전 — tokens `darkShadow`, react 테마가 다크에서 사용, Card elevated 테두리 제거) — shadow 토큰이 공통이라 다크에서 그림자가 안 보인다. `shadow` 를 라이트·다크 테마 값으로 옮기면
  CSS 변수 이름(`--bestow-shadow-*`)은 그대로라 breaking 아님. Card elevated 의 다크 보완 테두리도 재검토.
- [x] **`warning` 의미 색** (2026-10-15, 커밋 전 — tokens `palette.amber`·`warning`, Badge/Typography/Toast/createIntentColors.
  함께 발견·수정: 다크 solidHover 흰 글자 대비 3.3~4.38 → 한 단계 어둡게, createIntentColors hover 도 대비 보장) — 지금 intent 는 primary/neutral/danger/success 뿐. Badge·Toast·(향후) Alert 에 흔히 필요.
- [x] **새 컴포넌트 후보** — Alert·IconButton·Progress·Drawer·Link·Breadcrumb·Table·Slider·Combobox 모두 완료 (2026-10-15, 아래).
- [x] **Alert** (2026-10-15, 커밋 전) — `variant`(soft/outline/solid) × `color`(primary/neutral/success/warning/danger), `title`,
  color 별 기본 아이콘(`icon` 교체·`false` 숨김, 감싸는 span 이 aria-hidden), `action`, `onClose`+`closeLabel`(닫기 버튼, hover 는 `color-mix(currentColor)`).
  기본 role 없음 — 동적 메시지는 `role="alert"`/`"status"` (스토리 "동적으로 나타나는 메시지"). Radix 없이 직접 구현, 서버 컴포넌트에서 사용 가능.
- [x] **IconButton** (2026-10-15, 커밋 전) — Button 을 감싸 정사각형(32/40/48) + 아이콘 크기 자동(16/20/24, `globalStyle` 로 svg 크기 지정),
  `aria-label` 타입 필수(`@ts-expect-error` 테스트), 기본 ghost·neutral, `loading` 이면 아이콘 대신 스피너. Tooltip·DropdownMenu·Icons 스토리와
  playground 헤더 다크 모드 토글을 IconButton 으로 교체. react-docgen 이 Omit 상속 타입을 못 풀어 주요 prop 을 직접 선언(CLAUDE.md 함정).
- [x] **Progress** (2026-10-15, 커밋 전) — 직접 구현 `role="progressbar"`, value 생략 시 indeterminate(`indeterminate` keyframes, reducedMotion 시 정지·옅게 채움),
  범위 보정, `label`/`aria-label`, `showValue`·`formatValue`(aria-valuetext 공용, 화면 텍스트는 aria-hidden). 막대는 intent **text** 색 —
  solid 는 다크에서 트랙(bg.muted) 대비 1.9~2.4 라 탈락, text 는 실측 라이트 4.51~10.34 / 다크 5.58~10.34. playground 상호작용 페이지에 업로드 데모.
- [x] **Drawer** (2026-10-15, 커밋 전) — Radix Dialog 기반, Modal 과 같은 API + `side`(right/left/top/bottom, data-side)·`size`(compoundVariants:
  좌우 너비 320/420/640, 위아래 30/50/80vh)·`DrawerClose`. 닫기 버튼은 IconButton 재사용. 슬라이드 keyframes 는 Drawer.css.ts 안(side 별).
  playground 탐색 페이지에 필터(right)·공유(bottom). 다크·Esc·포커스 복귀·바깥 클릭 확인.
- [x] **recipe tree-shaking 수정** (2026-10-15, 커밋 전) — vanilla-extract 가 recipe 를 `_7a468({…})` 로 바꾸며 PURE 표시가 없어
  Button 하나 import 에 모든 컴포넌트 recipe 가 남았다(2.6 kB). `tsup.config.ts` 의 `withPureRecipes` 로 onLoad 결과에 표시 → 1.48 kB,
  size-limit "Button 하나" 3 → 2 kB 로 강화(수정 빼면 598 B 초과로 실패하는 것 확인).
- [x] **Link · Breadcrumb** (2026-10-15, 커밋 전) — Link: 밑줄 기본(always), `external`(새 창·rel·아이콘·"(새 창)"), `as`(클라이언트) /
  `asChild`(서버 컴포넌트, `@radix-ui/react-slot@1.5.0` 의존성 추가). 이름 계산: 숨김 span 안 앞 공백은 jsdom 에서 잘려 "예시(새 창)" 이 되므로
  공백을 링크 직속 텍스트로 둠(inline-flex 라 화면엔 안 보임, Chrome 접근성 트리 "GitHub 저장소 (새 창)" 확인).
  Breadcrumb: nav>ol, 마지막 항목은 href 가 있어도 링크 아님, `linkAs`, Link 덮어쓰기는 '&&' 구체성.
  playground: 헤더 링크 `as={NextLink}`, 서버 페이지 `asChild`+외부 링크+Breadcrumb, 탐색 페이지 Breadcrumb `linkAs` — 라우터 이동 확인.
- [x] **시각 회귀: 새 스토리 기준 이미지 자동 생성** (2026-10-15, 커밋 전) — 비교 단계를 `--update-snapshots=missing` 으로
  (없는 것만 새로 찍고 통과, 기존과 다르면 여전히 실패 — 로컬에서 둘 다 확인). main push 일 때만 봇이 커밋(PR 은 merge ref 라 push 불가 →
  머지 후 main 에서 커밋), main 이 앞서 있으면 rebase 후 push. update 수동 실행은 기존 화면을 의도적으로 바꿨을 때만.
- [x] **Table** (2026-10-15, 커밋 전) — 네이티브 table 7개 컴포넌트. size·striped·stickyHeader·caption/aria-label·align·selected·정렬(aria-sort).
  머리 셀 scope 자동(thead col / tbody·tfoot row, section context). 바깥 스크롤 영역은 이름 있는 region + tabIndex=0
  (axe scrollable-region-focusable, jsx-a11y no-noninteractive-tabindex 는 그 줄만 끔). 한글 word-break: keep-all.
  scope·aria-sort·포커스는 변이 확인, 키보드 스크롤·sticky 브라우저 확인. playground 서버 페이지에 표.
- [x] **Slider** (2026-10-15, 커밋 전) — `@radix-ui/react-slider@1.6.1` 추가. 값 배열, 제어/비제어(비제어도 화면 표시를 위해 내부 state 로 따라감),
  label·helperText·showValue·formatValue(aria-valuetext), 범위 손잡이 이름은 숨김 span + aria-labelledby("가격 최소"; Radix 기본 영어
  "Minimum" 대신). 막대·손잡이 테두리 primary.text (range/track 라이트 6.69, 다크 5.58). 변이 확인 3종, 드래그·키보드·playground 확인.
- [x] **Combobox** (2026-10-15, 커밋 전) — 직접 구현 WAI-ARIA combobox(입력창 role=combobox + aria-activedescendant, 포커스는 입력창 유지)
  + Radix Popover(role="presentation" 으로 dialog 역할 덮어씀, onOpenAutoFocus 막음, anchor 안 클릭은 outside 로 안 봄, 목록 mousedown 막아 포커스 유지).
  목록 항목은 Select.css 의 item 스타일을 data-highlighted/data-state 로 재사용 → CSS +0.6 kB. 결과 없으면 listbox 대신 role=status
  (빈 listbox 는 axe aria-required-children 위반). option 의 jsx-a11y 2개 규칙은 패턴상 끔. play 로 연 스토리로 axe 가 열린 목록도 검사.
  변이 4종 확인, 휠·바깥 클릭·Tab·playground 선택 확인. (가상화·자유 입력·다중 선택은 미지원 — 필요해지면)
- [ ] **기존 컴포넌트 보강** — DropdownMenu CheckboxItem/RadioItem/Sub, Tabs 세로 방향.

---

## P6. 차별화 — "한국 서비스 키트 + 검증된 접근성" (2026-10-15 완료, react 0.10~0.12)

근거: [`POSITIONING.md`](POSITIONING.md). 각 항목의 결정·발견한 문제를 남긴다.

- **P6-1 테마 빌더** — `apps/storybook/stories/ThemeBuilder.stories.tsx`(Foundations › Theme Builder). 대표색 → 라이트·다크 미리보기 +
  intent 별 대비 리포트(글자 4.5 / 그래픽 3) + `createTheme(createIntentColors(...))` 코드 복사. play 테스트로 "미달 0" 을 CI 에서 확인.
  **발견·수정:** 밝은 브랜드 색(노랑·하늘·분홍)이면 라이트 포커스 링 대비 1.5~2.8:1 → 3:1 미만이면 text 색 사용.
- **P6-2 키트 1차** — `AgreementGroup`(전체 동의 ↔ 개별, indeterminate, 필수·선택, 약관 펼치기 버튼 이름 "필수 … 보기", `hasAllRequiredAgreements`),
  `VerificationCodeInput`(입력창 하나 + 표시용 칸, `one-time-code`, 타이머 `role="timer"`·만료 안내 `role="status"`, 재전송).
  **발견·수정:** `maxLength` 때문에 "987-654 321" 붙여넣기가 숫자만 남기기 전에 잘림 → 제거. "필수" 뒤 공백(이름 "필수서비스…" 방지).
- **P6-3 키트 2차** — 공통 `useFormattedInput`(원본/표시 분리, 커서 유지, 서식 문자 뒤 Backspace/Delete, `setRaw`).
  `PhoneNumberInput`·`BusinessNumberInput`(검증 공식)·`AmountInput`(쉼표, "12만 5,000원") + 함수 `formatPhoneNumber` 등.
  `AddressInput`(공급자 교체형, 기본 `kakaoPostcodeProvider` — 공식 가이드 확인: `kakao.Postcode`, `t1.kakaocdn.net`, 검색 시 스크립트 로드).
  `Calendar`(WAI-ARIA grid, 일요일 시작, 일·공휴일 빨강/토 파랑, 키보드) · `DatePicker`(YYYY-MM-DD 입력 + Popover 달력, 값은 문자열, `today` 고정).
  **발견·수정:** ① 커서 테스트는 jsdom 이 커서를 되살려 무의미 → 실제 Chromium play 로, 서식 전후 문자열이 달라지는 입력으로 골라야 변이 확인됨
  ② trigger 없이 제어하는 Modal·Drawer 닫힘 시 포커스가 body 로 사라짐 → `useReturnFocus` ③ 달력 날짜 이름이 보이는 "15" 를 낱말로 담지 않음
  (axe label-content-name-mismatch) → "15, 2026년 10월 목요일" ④ DatePicker 제어 모드에서 올바른 날짜를 없는 날짜로 덮어쓰면 입력이 지워짐 → 가드.
  Modal `onCloseAutoFocus`, Popover `onOpenAutoFocus` 추가.
- **P6-4 KWCAG 2.2 대응 근거** — Storybook › Accessibility(`apps/storybook/stories/accessibility/kwcag.ts` 데이터 + MDX).
  33항목: 지원 18 · 일부 8 · 사용자 몫 3 · 해당 없음 4, "검사로 찾아 고친 문제" 기록. 항목명은 a11ykr·websoul 두 출처 대조(번호 5.x / 1.x 병기).
  **발견·수정:** 달력 공휴일이 색으로만 표시 → 점 표시. 6.5.2 는 Select·DropdownMenu 목록 열기가 pointerdown 이라는 점을 그대로 적음.
  MDX 문서는 스토리 axe 대상이 아니라 수동 axe 로 위반 0 확인.
- **P6-5 다국어·한글** — `LocaleProvider` + `en`(문구 60여 개, 19개 컴포넌트), 우선순위 prop > Provider > 한국어 기본값.
  한국어 기본값은 공용 객체로 모으지 않고 각 컴포넌트에 둔다(모으면 Button → Spinner 로 전체 문구가 번들에 딸려 옴).
  ThemeProvider 기본 `word-break: keep-all` + `overflow-wrap: break-word`. 줄 간격 토큰은 유지.
- **P6-6 메시지** — 루트 README · npm README(영/한) · Storybook Introduction 첫 화면. 비교표는 경쟁 제품 확인 전까지 넣지 않음.
- 그 밖에 P6 기간: CSS 배포 방식 결정(styles.css 하나 유지, 컴포넌트별 선택 import 는 1.0 이후), styles.css 한도 28 → 36 kB.

## P8. 1.0.0 — 공개 API 안정화 (2026-10-16 완료, react·tokens 1.0.0)

**왜:** 컴포넌트 수가 충분해졌고(40개), 0.x 동안 쌓인 이름·타입 불일치를 지금 정리하지 않으면 1.0 이후엔 전부 breaking change 가 된다.

- [x] **API 일관성 감사** (2026-10-16) — `dist/index.d.ts` 에서 모든 `*Props` 를 뽑아 비교. 결과와 "그대로 두는 것"의 이유는
  [`MIGRATION-1.0.md`](MIGRATION-1.0.md). 바꾼 것: Toast `variant`→`color`, DropdownMenuItem `'default'`→`'neutral'`,
  Spinner `'current'`→`'inherit'`, Checkbox `onCheckedChange` 추가.
- [x] **바꿀 것은 0.x 마지막 minor 에서 새 이름 추가 + 옛 이름 deprecated**(JSDoc + 개발 모드 경고 `utils/warnOnce`) → 1.0 에서 제거.
  deprecated 목록(0.12.0 배포, 1.0 에서 제거함): Toast `variant`, DropdownMenuItem `color="default"`, Spinner `color="current"`, `usePortalClassName`.
  changeset `api-consistency-deprecations`(minor). **1.0 에서 제거할 때 이 목록과 MIGRATION-1.0.md 표를 기준으로 한다.**
- [x] **공개 export·타입 점검** — 내부용이 새어 나가지 않았는지, 필요한 `*Props` 타입이 모두 export 되는지. `vars` 토큰 키(=CSS 변수 이름) 확정.
  - [x] d.ts 에 선언됐지만 export 안 된 타입 중 공개 prop 에 쓰이는 것 export: `AlertColor`, `ToastColor`, `ToastContextValue`, `TableSize`, `TableAlign`
    (남은 `ItemType`·`Widen`·`KakaoPostcodeData` 는 내부용).
  - [x] `vars` 토큰 키 확정 (2026-10-16) — 87개 그대로 확정. 색은 모두 vars 경유(하드코딩은 컴포넌트 치수 px 뿐).
    bg 는 subtle 이 muted 보다 옅고, fg 는 muted 가 subtle 보다 진하다 — 어긋나 보이지만 Chakra 와 같은 관례라 유지.
    `src/theme/contract.test.ts` 가 이름 목록을 고정 — 실패하면 breaking(추가는 목록에 더하고 minor).
- [x] **문서** — [x] 0.x → 1.0 마이그레이션 가이드(`docs/MIGRATION-1.0.md`), [x] 컴포넌트별 접근성 메모(키보드·스크린리더)를 Storybook docs 에.
- [x] **번들 한도 재설정** (2026-10-16, 사용자 결정) — react 전체 JS 65 → **70 kB** (현재 63.8 kB). 1.0 이후 새 컴포넌트를 추가할 때 다시 본다.
- [x] **1.0.0 배포 준비** (2026-10-16) — 옛 이름 제거(`@ts-expect-error` 테스트로 제거 고정), changeset `v1-react`·`v1-tokens`(major).
  icons 는 0.1.x 로 아직 세트가 작아 0.x 유지. 버전 규칙(CLAUDE.md·CONTRIBUTING)을 1.0 이후 semver 로 갱신.
  - [x] 버전 PR #18 머지 → npm react·tokens 1.0.0, icons 0.1.2 배포 확인 (2026-10-16)
- 출시 전 점검(2026-10-16, react 1.0.0 에 포함): 패킹한 tarball 을 새 프로젝트에 설치해 React 18/19 · TS 5.4/5.9 · ESM/CJS ·
  Next 서버 컴포넌트 · 브라우저로 확인 → 5건 수정(changeset `cjs-types-and-ssr-fixes`):
  ① CJS 타입(exports 의 require → index.d.cts, TS ≤5.7 TS1479) ② React 18 SSR useLayoutEffect 경고(서식 입력)
  ③ 서버 컴포넌트에서 createTheme·vars·서식 함수 호출 실패("use client" 전체 적용) → ESM 을 client/shared 로 분리
  ④ createIntentColors 중간 밝기 색(343색 중 41색) 버튼 대비 4.5 미달 → solid 밝기 보정 ⑤ 인라인 Calendar SSR "오늘" hydration 불일치.

## P10. 테스트·운영 (2026-10-16 완료)

- [x] **playground E2E 정식화** (2026-10-16) — `apps/playground/e2e`(Playwright, CI "E2E (playground)" 단계, 실패 시 리포트 업로드).
  17개: 페이지별 콘솔·hydration 오류 0 + axe(WCAG 2.2 AA, 라이트·다크+브랜드), portal 테마(DropdownMenu·Popover·Drawer·Select·Modal),
  키보드(DropdownMenu·Modal 포커스 가둠/복귀·Combobox·Select·Tabs·서식 입력), 서버 컴포넌트 함수. 5회 반복 안정성·변이(portal·hydration) 확인.
- [x] 시각 회귀에 열린 상태 스토리 추가 (2026-10-16) — Select·DropdownMenu·Popover·Modal "열린 상태" 새로, Drawer(defaultOpen→play)·
  DatePicker·AddressInput 열린 스토리를 시각 회귀에 포함. visual 스펙이 play 완료를 기다린다. 새 기준 이미지는 main push 때 봇이 커밋.

---

## P7. 번들·성능 (2026-10-19 완료 — 컴포넌트별 CSS(B)는 보류, ROADMAP P16)

- [x] **CSS 배포 방식 결정** (2026-10-15, 사용자 결정: **A 유지** — `styles.css` 하나. 측정: 테마·공통 약 15%, 컴포넌트당 2~5%,
  컴포넌트 10개 앱이면 필요한 CSS 는 절반 정도.) 컴포넌트별 선택 import(B, Mantine 방식 `styles/base.css` + `styles/<컴포넌트>.css`)는
  기존 사용법을 깨지 않는 추가라 **1.0 이후 필요할 때 minor 로**. JS 가 CSS 를 자동 import(C)는 breaking·환경 문제로 하지 않음.
- [ ] (나중에) **컴포넌트별 CSS 선택 import (B)** — 공통(base) + 컴포넌트별 CSS, 컴포넌트 간 CSS 의존(Combobox → Select·Input,
  Drawer → IconButton 등)을 문서화. 빌드는 vanilla-extract 출력에서 컴포넌트별로 나누는 후처리 필요.
  **2026-10-19 재평가: 우선순위 낮춤** — 당시 측정(33 kB)의 3/4 가 vanilla-extract 디버그 주석이었고, 실제 CSS 는 전체 9 kB. 수요가 생기면 다시 검토.
- [x] **서버 컴포넌트 엔트리 분리** — 2026-10-16 함수·값은 `dist/shared.js`(지시어 없음)로 분리. 2026-10-19 hook 없는 표시용 컴포넌트
  7개(Typography·Stack·Card·Badge·Divider·Progress·Skeleton)도 shared 로 → 서버 컴포넌트로 렌더링. `src/shared.test.ts`(import 그래프 검사·이름 중복)
  + playground 첫 페이지가 서버 함수를 Card `as` 로 넘겨 빌드로 감시. changeset `server-components`(minor).
- [x] **styles.css 디버그 주석 제거** (2026-10-19) — esbuild 가 CSS 파일마다 남기는 `vanilla-extract-css-ns:…base64…` 주석·소스맵 이름을 경로만 남김
  (줄 유지 → 소스맵 줄 번호 그대로, 남으면 빌드 실패). brotli 33.1 → 9.2 kB, 한도 36 → 12 kB. 2026-10-15 의 28 → 36 kB 상향도 이 주석 탓이었다.
- [x] **size-limit 결과를 PR 코멘트로** (2026-10-19) — 서드파티 action 대신 `size.yml` + `scripts/size-report.mjs`(base 를 따로 checkout·빌드해 비교, `gh api` 로 코멘트 하나 갱신,
  한도 95% 이상 ⚠️). 보고 전용(실패는 ci.yml). 포크 PR 은 Summary 만. 실제 PR 에서 첫 동작 확인 필요.

---

## P9. 기존 컴포넌트 보강 · 새 컴포넌트 (2026-10-19 완료 — 남은 Combobox 다중 선택·Tag 입력은 ROADMAP P14)

- [x] DropdownMenu `CheckboxItem`/`RadioItem`/하위 메뉴 (2026-10-19) — Radix 위에 스타일. 체크·라디오 표시는 아이콘과 같은 16px 자리,
  RadioGroup 은 Radix 가 상태를 갖지 않아 항상 제어(감싸지 않음). changeset `dropdown-menu-checkbox-radio-sub`(minor).
- [x] **Tabs 세로 방향** (2026-10-19) — `orientation` 을 Radix 로 넘기고 레이아웃은 `data-orientation` 셀렉터(root flex, line 은 오른쪽 테두리 위 표시줄, RTL 대응).
  changeset `tabs-vertical`(minor).
- [x] Combobox **선택 지우기** (2026-10-16) — 글자를 모두 지우고 닫으면 지움 + `clearable` 버튼. changeset `combobox-clear`(minor).
- [ ] Combobox 다중 선택·비동기 검색·긴 목록 가상화.
- [x] **SkipLink**(본문 바로가기) (2026-10-16) — KWCAG 6.4.1 을 "사용자 몫" → "일부" 로. changeset `skip-link`(minor).
- [x] **SegmentedControl** (2026-10-16) — radiogroup 의미를 직접 구현(roving tabindex, 화살표 = 즉시 선택), changeset `segmented-control`(minor).
- [x] **NumberInput** (2026-10-19) — spinbutton, −/+ 버튼(Tab 순서 밖·포커스 유지), ↑/↓·PageUp/Down·Home/End, 쉼표 서식(useFormattedInput),
  입력 중 범위 밖 허용 → blur 때 맞춤, 소수(step 자릿수·부동소수 반올림), 문구 `increment`/`decrement`(선택 키). changeset `number-input`(minor).
- [x] **Stepper** (2026-10-19) — 표시용 순서 목록(ol), aria-current="step", 완료 단계 "(완료)"(숨김 글자), 가로·세로, 문구 `steps`/`stepCompleted`(선택 키).
  useMessages 를 써서 클라이언트 컴포넌트. changeset `stepper`(minor).
- [x] **FileUpload** (2026-10-19) — "파일 선택" 버튼 + 끌어다 놓기, accept·maxSize·maxFiles 검사(이유 표시·status 알림), 삭제 후 포커스 이동,
  name 이면 DataTransfer 로 input.files 동기화(폼 제출 — 실제 브라우저 play 로 확인). 문구 9개 선택 키. changeset `file-upload`(minor).
- [ ] 새 후보: Tag 입력. (수요가 생기면 — DatePicker 는 P6 에서 완료)
