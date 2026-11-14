# BestOW UI 로드맵 — 완료 기록 (P1 ~ P16)

> 완료된 단계의 설계 메모·결정 이유·함정 기록 보관용. 현재 계획은 [`ROADMAP.md`](ROADMAP.md).
> 여기 적힌 "커밋 전" 등의 표기는 당시 상태다 (모두 커밋·배포됨). 맨 아래에 2026-10-14 ~ 10-21 의 진행 기록 전체를 보관한다.

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

## P7. 번들·성능 (2026-10-19 완료 — 컴포넌트별 CSS(B)는 ROADMAP "보류")

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

---

## P12 ~ P15. 프로덕션 준비 (2026-10-19 — P13-4 는 P16 에서 완료, P13-1 은 VoiceOver 완료·NVDA 는 ROADMAP, P14-5·P14-6 은 ROADMAP)

#### P12. 신뢰성 기반 — 검증 범위 넓히기 (최우선)

- [x] **P12-1. WebKit·Firefox CI** — 4차(`ec9ba2a`)에서 Firefox·WebKit·React 18 모두 녹색. (고대비 E2E 는 Switch 색 전환 중간값을 읽어 실패 → expect.poll 로 수정)
  이전 기록: 3차(`00af1f1`): React 18·WebKit 성공, Firefox 는 스토리 SkipLink(포커스 타이밍)·E2E Combobox(Firefox 성능 안내 경고) 2건 → 수정.
  2차 이전 기록: 2026-10-19 설정 완료(`STORYBOOK_BROWSERS`·`E2E_BROWSERS`, ci.yml `browsers` job). CI 첫 결과(`8585e69`):
  **WebKit 성공 · Firefox 스토리 470 통과 / E2E 실패(원인 미확인 — 로그는 인증 필요)** → github reporter 추가(annotation 으로 원인이 보임), 다음 push 결과로 수정.
  Firefox 는 로컬 실행 불가(macOS 27). 원래 메모: — 스토리 테스트(vitest browser 의 instances 에 webkit·firefox 추가)와 playground E2E(Playwright projects)를
  세 브라우저로. 시각 회귀는 기준 이미지 비용 때문에 Chromium 유지. 처음 돌리면 실패가 나올 것 — 브라우저 차이(포커스·selection·Radix·DataTransfer 등)를 고친다.
  CI 시간이 늘면 WebKit·Firefox 는 main push·PR 의 별도 job 으로 나눈다. (Claude 가 할 수 있음)
- [x] **P12-2. 모바일·터치 E2E** (2026-10-19) — `mobile.spec.ts` + `<브라우저>-mobile` 프로젝트(Pixel 7·iPhone 15): 리플로 3페이지, 탭으로 Select·Combobox·
  DatePicker·Modal·DropdownMenu·Drawer. 발견: playground 머리글·버튼 줄이 좁은 화면에서 넘쳐 화면 폭을 넓히고 버튼을 덮음 → wrap(라이브러리 버그 아님),
  리플로 검사가 넓어진 innerWidth 와 비교해 놓치던 것 수정(변이 확인). 실제 기기(가상 키보드 등)는 사람이 확인. 원래 메모: Playwright 기기 에뮬레이션(iPhone WebKit·Pixel Chromium, 좁은 화면 + touch)으로
  Select·DropdownMenu·Drawer·Modal·DatePicker·Combobox·FileUpload·Slider 를 탭·스크롤로 조작. 가상 키보드가 가리는 문제 등은 실제 기기로 따로(사람).
- [x] **P12-3. React 18 CI** (2026-10-19) — ci.yml `react18` job(pnpm overrides → typecheck·test, 버전 확인). worktree 에서 같은 단계로 타입 오류 0·테스트 374 통과.
  `ssr.test.tsx` 추가(모든 컴포넌트 renderToString 경고 0 — React 18 에서 useLayoutEffect 변이로 확인). 원래 메모: peerDependency 는 `^18 || ^19` 인데 CI 는 19 만. 단위 테스트를 React 18 로도 돌리는 matrix job
  (pnpm overrides 로 react·react-dom·@types 를 18 로). SSR 경고(useLayoutEffect)·useId 형식 차이 확인.
- [x] **P12-4. 번들 한도 결정** (2026-10-19, 사용자 결정: 상향 + 대표 조합) — 전체 70 → 80 kB(큰 회귀만), 대표 조합 4개를 현재 +10% 한도로 추가:
  앱 기본 3.36/3.7 · 폼 세트 30.1/33(Select 가 큼) · 오버레이 세트 34.7/38 · 한국 키트 30.3/33.5 kB. 원래 메모: "react: 전체 JS" 67.3/70 kB(여유 2.7 kB). 이 항목은 모든 컴포넌트를 import 한 크기라 사용자 번들과 다르다.
  선택지: ① 한도 상향(예: 80 kB) ② "전체" 는 느슨하게 두고 대표 조합(폼 세트·오버레이 세트·한국 키트) 항목 추가. **새 컴포넌트 전에 사용자와 결정.**
- [x] **P12-5. 지원 정책 문서** (2026-10-19) — `SUPPORT.md`(지원 범위 표·semver·deprecated·주 1회 배포·이전 major 6개월 보안 수정 — 기본안),
  `SECURITY.md`(GitHub 비공개 취약점 신고·처리 과정·라이브러리 보안 범위·CSP). README·npm README(영/한)·Introduction 에 연결. 원래 메모: 지원 브라우저·React·Next.js 버전 표, 배포 주기(지금은 하루 여러 번 → 주 1회 묶음 권장), 보안 문의(SECURITY.md),
  deprecated 기간. README·Introduction 에 연결.
- 운영: CI 러너는 `ubuntu-24.04` 고정 — Ubuntu 26 으로 올리는 건 Playwright 지원 확인 후(24.04 지원 종료 공지 전에).

#### P13. 접근성 실사용 검증

- [~] **P13-1. 스크린리더 수동 점검 (사람이 실행)** — 2026-10-19 체크리스트 작성: `docs/SCREEN-READER-CHECKLIST.md`(조합 4개 중 최소 VO macOS·NVDA,
  배포된 playground 에서 13개 항목 단계별 기대 동작·결과 칸·기록 표). **남은 것: 사람이 실행해 결과 기록.** 원래 메모: Claude 가 컴포넌트별 점검 체크리스트(조작 순서·기대 낭독)를 만들고, 사람이 VoiceOver(macOS·iOS)·NVDA
  (가능하면 센스리더)로 실행해 결과를 `kwcag.ts`·`componentA11y.ts` 에 "수동 확인" 으로 기록. 우선 대상: Select·Combobox·DatePicker·Modal·Drawer·
  DropdownMenu·Tabs·RadioGroup·NumberInput·FileUpload·Toast·서식 입력(전화·금액). axe 는 자동으로 잡을 수 있는 문제만 본다는 점을 문서에 밝힌다.
- [x] **P13-2. 고대비(forced-colors) 자동 점검** (2026-10-19) — 스크린샷으로 확인: Switch 사라짐, 선택된 탭·SegmentedControl·메뉴/목록 강조·현재 페이지·
  Progress 막대 안 보임, Slider 범위·Stepper 선 안 보임 → `styles/forcedColors.css.ts`(시스템 색) 적용. E2E `forced-colors.spec.ts`(시스템 강조색 일치 확인 —
  처음 "투명 아님" 검사는 버튼 ButtonFace 로 변이가 살아남아 강화, 강화 후 켜진 Switch hover 가 원래 색으로 덮이는 결함까지 발견·수정). 원래 메모: Playwright `forcedColors: 'active'` 로 주요 스토리를 찍어 경계·선택 표시·포커스 링이 보이는지 확인
  (RadioGroup·트랙은 대응해 둠, Checkbox·Switch·SegmentedControl·Stepper·Badge 확인 필요).
- [x] **P13-3. 확대·리플로 점검** (2026-10-19) — `zoom.spec.ts`: 320px 리플로(3페이지 + Modal·Drawer), 글자 간격(1.4.12), 기본 글꼴 2배.
  발견·수정: 인증번호 칸 320px 넘침(라이브러리), 글자 크기 px → rem(사용자 결정: minor, tokens 값은 그대로) + 글자 든 컨트롤 minHeight,
  Avatar 이니셜 잘림 → px. macOS 에서 이전 커밋과 전체 472장 픽셀 비교로 화면 변화 없음 확인. 원래 메모: 320px 너비·200% 글자 확대에서 가로 스크롤·잘림 없는지(WCAG 1.4.10·1.4.4). E2E 또는 스토리 테스트로.
- [x] **P13-4. 입력 테두리 대비** — 사용자 결정 ② 옵션 토큰(2026-10-20). 구현·체크 컨트롤까지 넓힌 기록은 아래 P16-3.

#### P14. 파일럿과 빈칸 채우기 (기능)

- [x] **P14-1. 파일럿 화면** (2026-10-19) — playground `/orders`(주문 관리: 검색·필터·정렬·선택·일괄 취소·페이지·상세 Drawer·등록 폼) + `orders.spec.ts`(6개).
  **버그 2개 발견·수정**: Modal 안 Select 목록이 배경막에 가림(z-index dropdown 1000 → 1320), 메뉴에서 연 Drawer 닫을 때 포커스 사라짐(useReturnFocus).
  빈칸 6개는 `docs/archive/PILOT-FINDINGS.md` — 다음 순서: 오류 요약(P14-2 와 함께) → VisuallyHidden → DescriptionList. 원래 메모: 실제 제품 화면 하나(예: 관리자 목록 + 상세 + 등록 폼)를 이 시스템만으로 만든다. 가능하면 사용자의 실제 제품,
  아니면 playground 에 "실전 예제" 페이지로. 빠진 컴포넌트·불편한 API·성능 문제를 이슈로 모아 아래 순서를 정한다.
- [x] **P14-2. 폼 라이브러리 연동** (2026-10-19) — `ErrorSummary`(포커스·focusKey·링크로 칸 이동) + `focusField` + `VisuallyHidden` 추가, AgreementGroup `id`.
  react-hook-form 통합 테스트 3개(변이 2종) + playground `/signup`(실제 브라우저 E2E), 파일럿 폼을 ErrorSummary 로 교체. 방침: group 컴포넌트는 ref 가 포커스 불가 →
  `shouldFocusError: false` + 오류 요약으로 포커스(GOV.UK). 원래 메모: react-hook-form 으로 TextField(register)·Select·DatePicker·NumberInput·FileUpload·AgreementGroup(Controller)
  예시 + 테스트(ref·name·onBlur·에러 표시·포커스 이동). 에러 요약(제출 시 첫 오류로 포커스) 패턴 문서.
- [x] **P14-3. 데이터 테이블 보강** (2026-10-19) — `TableEmpty`·`TableSkeleton`(aria-busy)·`useTableSelection`(이 페이지 모두 선택·혼합·페이지 넘어 유지),
  Table 스토리 "목록 화면 패턴"·Modal 스토리 "폼 제출(footer 버튼)", 파일럿 교체. PILOT-FINDINGS 빈칸 6개 모두 해결. 정렬은 기존 TableHead onSort. 원래 메모: Table 에 정렬 머리글(aria-sort)·행 선택(Checkbox)·빈 상태·로딩(Skeleton)·Pagination 연결 예시. 가상화는 수요 시.
- [x] **P14-4. DateRangePicker** (2026-10-19) — DatePicker 두 개 + 서로 min/max 제한 + 빠른 선택(`dateRangePresets`·`presetRange`, aria-pressed),
  fieldset/legend, 좁은 화면은 쌓기. 파일럿 주문일 필터 + E2E. 한 달력에서 끌어 고르는 방식은 수요 확인 후. 원래 메모: Calendar 기반 기간 선택(시작·끝, 키보드, `today` 고정).
- [ ] **P14-5. Combobox 다중 선택·비동기 검색** — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림, 긴 목록 가상화.
- [ ] **P14-6. Tag 입력** — 쉼표·Enter 로 태그 추가(P14-5 와 칩 공유).

#### P15. 문서·개발자 경험

- [x] (2026-10-19 `Guides/언제 무엇을 쓰나` — 6묶음 32개 항목) 사용 가이드: 언제 무엇을 쓰나(Select vs Combobox vs SegmentedControl vs RadioGroup, Modal vs Drawer, Tabs vs SegmentedControl).
- [x] (2026-10-19 `Guides/화면 패턴`) 패턴 페이지: 폼 검증·에러 요약, 단계별 흐름(Stepper + 버튼 + 제목 포커스), 파일 업로드 + 진행률.
- [x] 지원 범위 표·업그레이드 가이드를 Storybook Introduction 에 연결 (P12-5 와 함께).

---

## P16. 안정화와 접근성 실사용 검증 (2026-10-20 ~ 10-21, react 1.4.0 · 1.5.0)

#### P16-1. WebKit CI 불안정 수정 (2026-10-20)
- `c402156`·`4e85f8b` 에서 WebKit 만 연속 실패. ① Modal "폼 제출" 스토리 — 닫히는 애니메이션 동안 바깥이 aria-hidden 이라 `findByRole('status')`(1초)를
  넘김 → 대화상자가 사라질 때까지 기다림(닫힘을 1.5초로 늘려 옛 코드 실패·새 코드 통과 확인). ② E2E 첫 조작이 hydration 전에 사라짐(DropdownMenu·
  Combobox·FileUpload) → playground Providers 가 `html[data-hydrated]` 를 남기고 `e2e/fixtures.ts` 의 `page.goto` 가 기다림
  (JS 를 늦게 주는 방식은 load 도 늦어져 재현 안 됨 → CDP CPU 30배 스로틀로 재현: 대기 없으면 3번 중 2번 실패, 대기하면 0). 이후 WebKit flaky 0.

#### P16-2. 의존성 정비 1차 (2026-10-20)
- Playwright 1.64.1(+ visual.yml 이미지 `v1.64.1-noble`)·Next 16.4.2·React 19.3.1(lockfile 만)·vitest 5.0.5·tsup 9.0.0. Radix·Storybook 은 이미 최신.
- tsup 9: JS·CSS 바이트 동일, d.ts 는 `export { type X }` → `export type { X }` 표기만(공개 이름 3패키지 같음), size 동일. 개발 Node `>=22.18`(engines·CONTRIBUTING).
- vitest 5: 변이(옛 Modal 스토리 + 느린 닫힘)가 여전히 실패로 잡힘, React 18 overrides 로컬 재현 통과. 시각 회귀 500장 동일(Playwright 이미지 교체 후).
- 못 올림: TypeScript 7(typescript-eslint `<6.1`), ESLint 10(jsx-a11y 9 까지), jsdom 30(Node ≥22.22.2 — 이 Mac 22.19). @types/node 는 22 유지.

#### P16-3. 입력 칸·체크 컨트롤 테두리 대비 — 선택 토큰 (P13-4, react 1.4.0 · 1.5.0)
- 입력 칸 `border.default` 흰 배경 1.3:1, 체크 컨트롤(Checkbox·Radio·꺼진 Switch·Stepper 예정 단계) `border.strong` 라이트 2.07:1 — WCAG 1.4.11 미달.
- 사용자 결정: 기본 화면을 바꾸지 않는 **선택 토큰** `color.border.input`·`inputHover`(1.4.0)·`control`(1.5.0) + 추천 묶음 `strongInputBorders`
  (라이트 gray600/700·gray600, 다크 gray500/300·gray500 — 다크 gray600 은 bg.subtle 2.98:1 이라 제외). 2.0 에서 기본값(`docs/MIGRATION-2.0.md`).
- 설계: 선택 토큰은 CSS 변수를 **정의하지 않고** 쓰는 곳에서 `fallbackVar` 로 기존 토큰을 따른다(`styles/inputBorder.css.ts`) — 기존 화면 픽셀 동일,
  `border.default` 를 덮어쓴 사용자 설정·하위 영역 CSS 덮어쓰기도 계속 따른다(기본값을 `var(--…default)` 로 정의하면 하위 영역 덮어쓰기를 못 따름).
- 함정: 프리셋이 `palette.gray[600]` 을 읽자 번들러가 tokens 전체를 남겨 "앱 기본" 3.37 → 3.83 kB(한도 초과) → 값으로 적고 테스트로 palette 와 같은지 확인.
  CSS 변수 표 스토리에 "(선택 — 기본값 없음)" 을 붙이자 첫 열이 넓어져 7행이 더 줄바꿈(+574px) → 아래 줄 작은 글자로.
- 테스트: 대비·hover·palette 일치·변수 펼침 단위 테스트, 스토리 "진한 입력 테두리" play(라이트·다크 계산된 색), 변이 8종.

#### P16-4. 2.0 준비 · 운영 (2026-10-20 ~ 10-21)
- `docs/MIGRATION-2.0.md` 초안: 지금 deprecated 이름 없음, 바뀌는 기본값 1개(입력 칸·체크 컨트롤 테두리 — 미리 켜기·예전처럼 쓰기·구현 할 일).
- SUPPORT.md 확정(사용자): 배포 "준비되면"(주 1회 문구가 실제와 달라 수정), 이전 major 6개월. GitHub Private vulnerability reporting 켜짐.
- 배포: react **1.4.0**(DateRangePicker·strongInputBorders, 2026-10-21), **1.5.0**(border.control + VoiceOver 수정 3건, 2026-10-21) — npm·태그·Release·provenance·설치본 확인.

#### P16-5. 스크린리더 수동 점검 — VoiceOver + Safari (P13-1 일부, 2026-10-21)
- 사용자와 함께 13개 항목, 로컬 운영 빌드(`next start -p 3001`)로 고칠 때마다 바로 재확인. 모두 ✅(4건은 고친 뒤).
- 고친 것: ① Combobox "결과가 없어요" — 글자를 담은 채 새로 생긴 live region + 입력과 같은 순간 → 항상 있는 숨은 status, 입력이 0.8초 멈춘 뒤
  (DOM 은 맞는데 안 들려서 타이밍으로 판단, GOV.UK accessible-autocomplete 와 같은 방식) ② NumberInput "선택 항목 대치됨, 2"(단위 없음) — Safari 는
  텍스트 입력 spinbutton 의 aria-valuetext 를 읽지 않음 → 키·버튼으로 바꾼 값을 assertive 로 "2석"(React Aria useSpinButton 과 같은 방식) ③ FileUpload —
  "삭제됨" 이 다음 버튼 포커스에 묻힘 → 0.5초 뒤, Tab 으로는 크기를 못 들음 → 삭제 버튼 설명에 크기 ④ playground DatePicker 에 `isHoliday` 가 없어
  공휴일 확인 불가 → 고정 공휴일 추가(라이브러리는 공휴일을 내장하지 않음).
- 후속: CI React 18 job 실패 — FileUpload `useRef<Timeout>(undefined)` 는 @types/react 18 에 오버로드 없음 → `useRef<Timeout | undefined>`.
- 남은 것(ROADMAP): NVDA(NumberInput "2석" 두 번 읽힘 여부), iOS VoiceOver·센스리더.

---

## 코드 안정화 (2026-10-30 ~ 11-05, react·tokens 2.0.0) — 옛 `docs/STABILIZATION.md` 요약

전체 내용(버그별 재현·원인·수정)은 git 기록의 `docs/STABILIZATION.md`(2026-11-14 삭제 직전 커밋)에 있다.

- **결정(2026-10-30):** 홍보보다 코드 안정화를 먼저, 런칭 게시는 보류. 호환성을 깨는 변경은 외부 사용자가 거의 없을 때 2.0 으로 한 번에. 새 기능은 안정화 뒤에 판단.
- **버그(patch) S1~S7:** Combobox 한글 조합 중 Enter, 서식 입력의 `form.reset()`, `050` 번호 서식·12자리 잘림, `+82` 번호, `0000000000` 사업자번호 통과, 세로 Stepper 간격, 숨긴 SkipLink 그림자.
- **기능 공백(minor) S8~S11:** Button·IconButton `asChild`, Stepper 진행 중 상태, 마스킹 함수의 인식 실패 처리, `fieldset disabled` 모양.
- **2.0(major) S12~S15:** 입력 칸 테두리 3:1 이상(`border.input`·`inputHover`·`control`), CSS `@layer bestow`, `as` 다형성 타입(호환 유지), 비활성 투명도 0.5 통일(`opacity.disabled`). 자세한 것은 `MIGRATION-2.0.md`.
- **재발 방지 S16~S19:** 폼 공통 계약 테스트(`form-contract.test.tsx`), 실제 브라우저 IME E2E, 커버리지 보고(`pnpm test:coverage`), 누락 테스트 보강(카카오 스크립트 재시도 버그 발견).
- **런칭 전 완료 조건(모두 충족, 2026-11-05):** 1~7단계·main CI 녹색, 2.0 배포(11-04), 사람 확인(ResidentNumberInput VoiceOver·iOS Safari 가상 키보드 — NVDA·Android 는 런칭 뒤로), README 비교표 갱신. → 2026-11-05 GeekNews 런칭.

## 로드맵 계획 절 보관 (2026-11-14 정리 전 ROADMAP 의 인수인계·다음 플랜·현재 상태 그대로)

> 2026-10-21 ~ 11-14 의 계획·인수인계 메모. 제목 단계만 하나씩 내렸다. 사용자 유치 플랜 23~30번의 상세 기록도 여기에 있다.

### 🔁 다음 세션 시작하기 (인수인계 — 2026-11-04 기준)

**2026-11-13 세션:** 사용자 할 일 완료 확인(Search Console·네이버 sitemap 제출, force push 금지 규칙, Dependabot) — 버전 PR #30 은 아직 열림(머지는 사용자 판단).
24번 글 초안 2편(사업자등록번호 검증 공식 `business-number-checksum.md`, 인증번호 문자 자동 채우기 `sms-otp-autofill-react.md` — 둘 다 astro-blog draft), 3편 약관 전체 동의 체크박스 접근성 `agreement-checkbox-a11y.md` — 세 편 모두 astro-blog `content-queue/001~003-*.md`(draft: false)로 옮겨 매일 09:00 하나씩 예약 발행.
**25~27번 완료, 28번 토큰·스타일·주요 컴포넌트 완료, 29번 통계 연결(토큰 대기), 30번 준비물 완료**(아래). 다음: 사용자 게시·토큰 등록·블로그 워크플로 켜기, 그다음 28번 남은 정리 또는 새 요청. 이전 다음: 28번 남은 정리(MCP 한도 뒤) 또는 29번 측정(사용자 결정 필요), Context7 등록(사용자), 버전 PR #30 배포 뒤 npm 검색 순위 조회, push 뒤 `create-next-app --example` 실제 설치 확인.

**지금 할 일(2026-11-11 결정): "사용자 유치 플랜" 23번부터** — 아래 "다음 플랜" 맨 위 절. 런칭 6일 뒤 점검에서 막힌 곳이 기능이 아니라
**발견 → 신뢰 → 첫 사용** 경로로 나왔다(스타 4·외부 이슈 0·Discussions 0·웹 검색 결과 없음). 새 컴포넌트(6번 C Tag 입력·B 비동기 검색)는 외부 요청이 생길 때까지 미룬다.
열린 버전 PR #30(MultiCombobox 등) 머지 여부는 사용자에게 확인.
**2026-11-11 세 번째 세션:** 24번 함수 문서 10쪽 + 목록을 소개 사이트에 추가(아래 24번), korean-utils npm 메타 보강(changeset patch).
CI WebKit "다크 모드 토글" 간헐 실패 수정(axe 를 색 전환 뒤에 — 커밋 eac34ea). Dependabot 2건(glob·minimatch, 개발 도구만) pnpm overrides 로 해결(커밋 9d871f5).
다음: ① push 뒤 CI(특히 React 18 job — overrides 블록에 줄을 덧붙이는 방식으로 바꿈)·Dependabot 경고 닫힘 확인 ② 배포 뒤 sitemap 재제출·네이버 소유확인(사용자)
③ main force push 금지 규칙이 다시 켜졌는지(사용자 — 이번에 잘못된 커밋 메시지를 고치려고 잠깐 force push 함) ④ 24번 글 초안 또는 25번.

**2026-11-11 두 번째 세션:** 23번 A·B 배포 확인(루트·/storybook/·/playground/·llms·og·sitemap 200, `lang="ko"`, 실제 배포에서 옛 `?path=`·`iframe.html` 넘겨주기 동작).
main CI 의 site E2E 실패(320px 리플로 — CI Linux 글꼴이 넓어 대표색 칸이 335px, WebKit 넘겨주기 대기 시간 초과, Firefox 경고) 고침 — push 뒤 CI 녹색 확인 필요. 다음은 23번 Search Console(사용자) → 24번.
(그 전 기록) **런칭 뒤 반응 보기** (2026-11-05 GeekNews Show 게시 — https://news.hada.io/topic?id=36655). 아래 줄은 런칭 직전 기록 —
**(완료) 런칭 준비 마무리** — 코드 안정화(STABILIZATION 1~8단계)와 **2.0 배포 완료**(2026-11-04, react·tokens 2.0.0), README 비교표 갱신 완료.
**STABILIZATION 런칭 전 완료 조건 모두 충족(2026-11-05)** → 런칭 게시 완료(2026-11-05). 런칭 뒤 할 사람 확인: ResidentNumberInput NVDA, 가상 키보드 Android Chrome(둘 다 2026-11-05 사용자 결정으로 미룸, VoiceOver·iOS Safari 는 ✅).
(2026-11-05 완료: Storybook 문서 페이지 `@layer` 점검 — 이상 없음, GeekNews Show 본문 2.0 기준 갱신.) 런칭 뒤 반응으로 "다음 플랜" 의 기능을 고른다.
**6번 A(MultiCombobox) 완료(2026-11-06)** — 다음은 6번 C Tag 입력(칩 입력 UI 를 MultiCombobox 와 공유) → B 비동기 검색. **"런칭 뒤 완성도 보강" 17~22번 모두 완료(2026-11-06)** — 그 전 기록: 다음은 런칭 반응을 보고 6번(Combobox 다중 선택·Tag 입력 — Tag 를 칩으로)·14번 TanStack 가이드·15번 Figma 중에서 (17~21번 changeset `more-icons`(icons minor) 포함, changeset `password-search-input`·`tag-empty-state`·`korean-kit-2` minor — 배포 대기) — 런칭 반응에 직접 요청이 있으면 그것이 먼저.
사용자 결정(2026-10-30): **홍보보다 코드 안정화가 먼저**, 런칭 게시는 보류, 호환성을 깨는 변경은 런칭 전에 2.0 으로 묶는다.
아래 "다음 플랜"의 런칭·기능 항목은 안정화가 끝난 뒤 다시 판단한다.

**2026-11-06 세션 끝 — 남은 일(다음 세션에서 먼저)**
1. ✅ 버전 PR #29 머지·배포 확인(2026-11-06) — npm react 2.1.0 · korean-utils 0.4.0 · icons 0.2.0 · tokens 2.0.0, main CI 녹색, examples/vite-starter 를 npm 에서 설치해 tsc·vite build 통과.
2. ✅ **`!visual` 태그 버그**(2026-11-06) — 태그를 `no-visual` 로 바꿈(스토리 11개), `visual/stories.spec.ts` 필터·CLAUDE.md 규칙·함정, 빠진 스토리의 기준 이미지 22장 삭제
   (build-storybook index.json 으로 찍을 이미지 626장 = 남은 기준 이미지 626장 확인 — 기준 이미지 갱신 불필요).
3. ✅ 전역 스킬 정리(2026-11-06) — `.claude/settings.local.json`(전역 gitignore, 커밋 안 됨)의 `skillOverrides`: replica-*·claude-api·morning·import-memory·docx·pptx·xlsx·google-workspace 는 off,
   loop·schedule·브라우저/computer-use·deep-research·pdf·skill-creator·dataviz 등은 user-invocable-only(/이름 으로만). 다음 세션 스킬 목록에서 빠졌는지 확인 — 플러그인 스킬(`anthropic-skills:`·`superpowers:` 접두사) 키가 먹지 않으면 접두사 없는 이름으로 바꾼다.

**마지막 상태**
- npm: **react 2.0.0** · **tokens 2.0.0** · **korean-utils 0.3.0** · icons 0.1.3 (2026-11-04 확인. 버전 PR #28 머지됨, main CI 녹색).
- GitHub 저장소 설정 완료(2026-10-21): 한국어 About·Website, Topics 18개, **Discussions 켜짐**(기본 카테고리 6개). 이슈·PR 템플릿 있음.
- Pages: Storybook + playground + `llms.txt`·`llms-full.txt`. StackBlitz 예제 `examples/vite-starter`(npm 의 react ^2.0.0 — 2026-11-04 설치·빌드·화면 확인: 레이어·진한 입력 테두리 반영).
- 컴포넌트 약 56개(폴더 55 — 10-23 Grid·Container·FormField·CheckboxGroup·ResidentNumberInput 추가) + 테마·다국어·서식·마스킹 함수, 아이콘 57종. **P1~P16 완료**, 이번 플랜 1(노출)·2(번들)·3(korean-utils)·5(런칭 준비물) 완료.
- 프로덕션 권장 선언 기준 **6/6 달성**(2026-10-23 NVDA + Chrome 13개 항목 모두 ✅, VoiceOver 재확인 ✅) — README·npm·Introduction·SUPPORT·POSITIONING 에 반영, 1.6.1 로 배포.
- **런칭: 준비물은 있지만 2026-10-30 부터 보류**(STABILIZATION.md 완료 조건 뒤). 블로그(https://jiwon-seok.com, 저장소 ~/Documents/Project/astro-blog) 기술 글 2편 **공개됨** —
  `oklch-contrast-theme`(10-21)·`kwcag-automated-testing`(10-23, NVDA 결과 포함). 블로그 표 스타일도 2026-10-23 손봄.
  GeekNews Show 본문은 비공개 Artifact https://claude.ai/artifact/EdgazWzz98aH3maLsXFwRT ("복사" 버튼, 2026-11-05 react 2.0 기준 숫자·특징으로 갱신).
  런칭 뒤에는 이슈·Discussions 반응으로 다음 기능(Combobox 다중 선택·Tag 입력)을 정한다.
- **9번 OS 다크 모드(`theme="system"`) 완료**, **10번 반응형 기반 완료**(2026-10-23, changeset `responsive-layout` react·tokens minor — 배포 대기). 11번 info 색·12번 FormField·CheckboxGroup 완료(changeset `info-color`·`form-field-checkbox-group`). 13번 한국 키트 1차(주민번호·마스킹) 완료(changeset `resident-number-masking`). 다음은 14번 컴포넌트 공백.
  **"앱 기본" 번들 여유가 10 B 뿐**(4.09/4.1 kB — system 모드 +390·Stack 구간별 값 +300·info 변수 +40 B) → 다음에 ThemeProvider·Button·Typography·Stack·vars 를 키우면 한도를 사용자와 다시 정한다.
- **2026-10-23 객관 점검**(다음 플랜 9~16번) 중 9~13 완료. 남은 것: 14 컴포넌트 공백(Tag/Chip·EmptyState·TimePicker·앱 뼈대·TanStack 가이드)·15 Figma·16 운영. 모두 안정화 뒤로 미룬다.
- 번들(2026-11-05 2.0 기준, minify + brotli): 전체 72.35/80 · Button 하나 1.74/2 · 앱 기본 4.28/4.4 · 폼 세트(Select) 29.86/33 · NativeSelect 판 4.09/4.3 ·
  오버레이 34.99/38 · 한국 키트 30.87/33.5 · styles.css 10.96/12 · tokens 1.36/1.5 · korean-utils 1.42/1.5 kB. 아래 줄은 10-23 기록.
- (옛 기록) 번들(2026-10-23 13번 뒤 측정, minify + brotli): react 전체 JS **71.68/80 kB** · Button 하나 1.51/2 · 앱 기본 **4.09/4.1** · 폼 세트(Select) 29.66/33 ·
  **폼 세트(NativeSelect) 3.86/4.3** · 오버레이 세트 34.82/38 · 한국 키트 30.4/33.5 · styles.css 10.86/12 · tokens 1.32/1.5 ·
  korean-utils 전체 1.32/1.5 kB(10-23 한도 1 → 1.5, 사용자 결정)·전화번호 서식 하나 179/300 B·maskName 하나 92/200 B. 큰 덩어리는 모두 Radix(점검 결과는 아래 "Claude 가 할 일" 2번).
  **조합 한도는 여유가 약 10% 뿐** — 큰 기능(Combobox 다중 선택 등)을 넣기 전에 어느 조합에 들어가는지 보고 필요하면 한도를 사용자와 정한다.
- semver 적용 중: 기존 이름·타입·CSS 변수 변경 = major. 이름을 바꿀 땐 새 이름 + 옛 이름 deprecated(minor) 먼저 (CLAUDE.md "작업 규칙").
  기본 화면을 바꾸는 개선은 **선택 토큰 + 2.0 기본값**(`MIGRATION-2.0.md`) — 입력 칸·체크 컨트롤 테두리가 이 방식.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
3-1. 기준값: `node scripts/stats.mjs` → 출력 한 줄을 "진행 기록" 에 붙인다(29번).
4. main CI 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/commits/<sha>/check-runs` — 실패면 annotations 로 원인부터.
5. `pnpm install && pnpm build` 후 아래 "다음 플랜" 중 사용자가 고른 작업부터 진행.

**작업 습관 (굳어진 것)**
- 컴포넌트: CLAUDE.md 규칙 + 스토리(열린 상태가 있으면 `play` 로 연 스토리) + 테스트 + `src/client.ts` export(순수 함수는 `shared.ts`)
  + changeset + playground 사용 예 + E2E(키보드 등 실제 브라우저에서만 확인되는 동작) + 접근성 문서(`componentA11y.ts`·필요하면 `kwcag.ts`)
  + README 컴포넌트 표(루트·`packages/react/README.md`) + 필요하면 `Guides`(언제 무엇을 쓰나·화면 패턴) + `ssr.test.tsx`.
- 핵심 테스트는 구현을 일부러 망가뜨려 실패하는지 확인한다 (**복원은 scratchpad 백업 파일 복사로만 — `git checkout` 금지**).
- 로컬에서 재현이 안 되는 CI 실패는 조건을 만들어 재현한다(느린 애니메이션 주입, CDP CPU 스로틀, React 18 overrides) — 추측으로 고치지 않는다.
- 새 Radix 패키지는 올라온 지 24시간 넘은 버전만(pnpm minimumReleaseAge). package.json 을 바꾸기 전에 origin 과 같은지 확인.
- 색을 고를 때는 대비를 계산한다: 글자 4.5:1, 막대·테두리 등 그래픽 3:1. 고대비 모드는 `styles/forcedColors.css.ts` 로 시스템 색 지정.
- 반복되는 브라우저 확인은 `apps/playground/e2e`(포트 3107)에, 일회성 확인만 scratchpad 스크립트로(시스템 Chrome·Playwright WebKit).
  입력 중 생긴 메시지를 스크린리더에 알릴 때는 `utils/useDelayedAnnouncement`(0.8초 뒤, 항상 있는 status 영역)를 쓴다.
  사용자 dev 서버(3000)는 건드리지 않는다. 새 E2E 는 `--repeat-each 5` 로 불안정하지 않은지 본다. Firefox 는 로컬 실행 불가(macOS 27) → CI 로 확인.
- 시각 회귀가 바뀌는 변경은 push 후 visual.yml 수동 update 가 필요하다(job 이 실패하면 새 스토리 기준 이미지도 커밋되지 않음 — update 한 번으로 둘 다).
  보고할 때 "허용치 안 통과" 와 "픽셀 동일" 을 구분한다.
- 문서는 한국어(npm README 는 영어 한 줄 소개만). `en` 문구 묶음은 기능이라 유지.

**스크린리더 점검 진행 방식 (2026-10-21 VoiceOver 에서 잘 된 방식)**
- 로컬 playground 를 운영 빌드로 띄운다: `pnpm build && pnpm build-playground` → `pnpm --filter @bestow-ui/playground exec next start -p 3001`
  (백그라운드, 3000·3107 과 겹치지 않게). 고칠 때마다 다시 빌드·재시작하고 사용자에게 새로고침을 부탁한다 — push 없이 바로 재확인. 끝나면 서버를 끈다.
  Windows PC 에서 점검하면 맥의 서버에 같은 네트워크로 접속하거나(`next start -H 0.0.0.0 -p 3001`), 배포된 Pages(push 후)를 쓴다.
- [`SCREEN-READER-CHECKLIST.md`](SCREEN-READER-CHECKLIST.md) 항목 하나씩: 누를 키·기대 문구를 안내 → 사용자가 ✅/⚠️/❌ 와 들린 문장을 알려 줌 →
  문제는 바로 원인 확인(실제 브라우저로 DOM 재현 먼저)·수정·테스트(변이)·재확인. 결과는 해당 열(NVDA 는 2번째 열)에, 끝나면 "점검 기록" 표에 한 줄.
- 배운 것: live region 은 **처음부터 있어야** 하고, **입력·포커스 이동과 같은 순간**에 바꾸면 VoiceOver 가 버린다(늦춰서 넣기).
  Safari 는 텍스트 입력 spinbutton 의 aria-valuetext 를 읽지 않는다(NumberInput 은 따로 알림). 맥 키보드 F8 은 fn + F8.

### 다음 플랜 (2026-10-21 재정리 — 알리기·도입 장벽 낮추기 우선, 위에서부터 추천 순서)

> **2026-10-30 변경:** 이 플랜보다 코드 안정화(ROADMAP-HISTORY "코드 안정화", 2026-11-05 완료)가 먼저였다. 아래 "품질은 충분하다" 는 판단은 같은 날 점검에서 찾은 버그로 바뀌었다.

> 방향: 품질은 충분하다. 부족한 것은 **알리기**와 **도입 장벽**이다(스타 1, npm 월 다운로드 react 665 는 1주 24개 버전 배포·CI 설치로 부풀려진 값 —
> 실사용자는 거의 없다고 보고 시작). 공개 런칭(GeekNews 등)은 **NVDA 점검으로 "프로덕션 권장 6/6" 을 채운 뒤 한 번에** 한다.
> 첫 런칭은 한 번뿐이라 그 문구와 번들 숫자를 쓸 수 있을 때 한다.

#### 사용자 유치 플랜 (2026-11-11 — 위에서부터 추천 순서, 이 절이 지금 1순위)

> 2026-11-11 점검(런칭 6일 뒤): GitHub 스타 4(런칭 전 1)·포크 0·외부 이슈 0·Discussions 글 0, npm react 평소 하루 15~30(큰 값은 배포·CI 설치),
> 웹 검색 "BestOW UI" 결과 없음, npm 검색은 `kwcag` 3위뿐 — `한국 디자인 시스템`·`사업자등록번호`·`korean phone number format` 은 20위 밖.
> 비교: Vapor UI 40·HANUI 36·es-hangul 1,887 스타(한국 DS 시장은 작고 유틸 함수 수요가 훨씬 크다). GeekNews 글의 추천·댓글 수는 읽지 못함.
> 판단: 컴포넌트·테스트·접근성에 더 투자해도 사용자는 늘지 않는다. **검색에 잡히기 → 일부만 써 볼 길 → 실사용 증거** 순으로 한다.
> 새 컴포넌트·테스트 추가·번들 미세 조정은 외부 요청이 생길 때까지 하지 않는다.

23. **검색·공유에 잡히는 홈페이지** — 지금 Pages 루트는 Storybook 이라 제목이 `storybook - Storybook`, description·OG 태그·sitemap.xml·robots.txt 없음(본문도 iframe 안이라 색인이 약함).
    - [x] A(2026-11-11 완료 — push 뒤 배포 확인 남음): Storybook 제목(`main.ts` 의 `title` 프리셋 → "BestOW UI — 한국 서비스를 위한 접근성 검증 React 디자인 시스템 - Storybook"),
      `.storybook/manager-head.html`(description·canonical·OG·트위터 카드), `public/og.png`(1200×630 — `node scripts/generate-og.mjs` 가 `scripts/og-image.html` + 히어로 이미지를 찍음),
      `public/sitemap.xml`(루트 + playground 5쪽), playground `layout.tsx` metadata 에 OG. **robots.txt 는 두지 않음** — 호스트 루트(dev-bestow.github.io/robots.txt)에서만 읽혀 프로젝트 Pages 에서는 소용없다(sitemap 은 Search Console 에 직접 제출).
      못 바꾼 것: Storybook 껍데기의 `<html lang="en">`(템플릿 고정 — B 에서 랜딩을 만들면 해결). push 뒤 확인: `curl` 로 배포된 태그, 카카오톡·슬랙 미리보기(사용자, 카카오는 캐시 초기화 도구 필요할 수 있음).
    - [x] B(2026-11-11 완료 — push 뒤 배포 확인 남음): 새 앱 `apps/site`(Next.js 정적 export — playground 는 예제 앱이라 섞지 않음)를 Pages 루트에, Storybook 은 `/storybook/`, 예제 앱은 그대로 `/playground/`
      (`scripts/assemble-pages.sh` 가 모으고 빠진 파일이 있으면 실패, llms*.txt 는 루트에도). 첫 화면은 **직접 입력해 보는 한국 키트 데모 + 대표색 바꾸기**(버튼 글자 대비 숫자 표시),
      그 아래 무엇이 다른가요·크기·Next.js 시작 3단계·더 알아보기. `<html lang="ko">`, OG·canonical·sitemap 은 site 로 옮김.
      옛 주소: layout 의 beforeInteractive 스크립트가 `?path=`·`?id=`·`?viewMode=` 를 쿼리·해시 그대로 /storybook/ 으로, `public/iframe.html` 이 옛 스토리 단독 주소를 넘김.
      E2E 14개(`apps/site/e2e`, Pages 와 같은 경로의 정적 서버 + 가짜 Storybook): 넘겨주기 6·axe 라이트·다크·토글·데모·메타·320/390px 리플로, 변이 2(넘겨주기 조건·휴대폰 여백).
      README·npm README·POSITIONING·CONTRIBUTING·llms.txt·이슈 템플릿 링크를 `/storybook/` 으로(npm 페이지는 다음 배포 때 반영). CI 는 check·browsers job 에 build-site + site E2E.
      push 뒤 확인: 루트·/storybook/·/playground/·/llms.txt 열림, 옛 링크(README 의 예전 주소·GeekNews 글) 넘어가는지, 카카오톡·슬랙 미리보기.
    - [x] Google Search Console·네이버 서치어드바이저 등록(사용자 — 2026-11-13 확인·sitemap 제출 완료).
      Google: URL 접두어 속성, HTML 태그 확인 — `apps/site/app/layout.tsx` metadata `verification.google` 에 넣음(2026-11-11, E2E 가 태그 확인). push·배포 뒤 "확인" → sitemap 제출(사용자). 네이버는 호스트 단위만 받아 조직 루트 사이트 저장소 `Dev-BestOW/dev-bestow.github.io`(index.html → /BestOW-UI/ 이동·robots.txt(sitemap 위치)·네이버 확인 파일)를 만듦 — 2026-11-11 배포 확인, 기존 경로 영향 없음. 남은 것: 네이버 소유확인·sitemap 제출(사용자). **그 저장소에 `BestOW-UI` 폴더를 만들지 않는다**(경로 충돌).
24. **korean-utils 를 입구로** — 함수(전화번호 하이픈·사업자등록번호 검증·금액 한글 읽기·마스킹·주민번호·카드·계좌)마다 검색되는 문서 페이지:
    문제 → 코드 한 줄 → 직접 쳐 보는 입력 → 같은 동작의 react 입력 컴포넌트 링크. 23번 B 의 사이트에 둔다(B 전에는 korean-utils README 를 함수별 절로 보강).
    - [x] 함수 문서(2026-11-11): `apps/site/app/korean-utils/` — 목록 `/korean-utils/` + 10쪽(`guides.ts` 데이터 → `[slug]/page.tsx`, 직접 입력은 `Try.tsx`):
      전화번호·사업자·금액·주민번호·마스킹·카드·법인·계좌(은행 코드 표 26곳)·날짜·주소 참고항목. 쪽마다 제목·description·canonical·OG(`seo.ts`), 헤더 "서식 함수"·홈 "더 알아보기" 링크.
      sitemap 은 `app/sitemap.ts` 가 guides 로 만든다(public/sitemap.xml 제거). E2E `korean-utils.spec.ts`: 메타·링크·직접 입력·은행 표·sitemap·axe 라이트·다크·320px,
      **코드 예시의 `호출; // 결과` 37줄을 node 에서 실제 계산해 비교**(결과를 일부러 틀리면 실패하는 것 확인).
    - [x] npm description·keywords 보강(하이픈·법인등록번호·카드번호·계좌번호·은행코드·luhn 등), homepage → 함수 문서, README 에 함수별 문서 링크(changeset patch — 다음 배포 때 npm 반영).
    - [ ] 배포 뒤: ~~Search Console 에 sitemap 다시 제출(사용자)~~ 완료(2026-11-13), `사업자등록번호`·`전화번호` npm 검색 순위 다시 조회(버전 PR #30 배포 뒤 — npm 메타가 그때 반영).
    - [ ] 문제 단위 글 초안(게시는 사용자 — 블로그·velog) — 1편 완료(2026-11-13): astro-blog `src/content/posts/business-number-checksum.md`(`draft: true` — 공개는 사용자가 false 로 바꿔 push).
      2편(2026-11-13): `sms-otp-autofill-react.md`(draft) — 칸 여섯 개 대신 입력창 하나 + 칸 그림, maxLength·type=number 를 피하는 이유, iOS one-time-code·Android WebOTP(문자 마지막 줄 `@도메인 #번호`), 자동 제출 한 번만, timer·status 만료 알림.
      3편(2026-11-13): `agreement-checkbox-a11y.md`(draft) — fieldset·indeterminate(항목에서 계산)·이름 앞 필수/선택(공백)·보기 버튼 aria-labelledby·스크롤 영역 region+tabIndex·disabled 대신 오류 표시, 개인정보 보호법상 선택 동의(법무 검토 권고). 처음 계획한 세 주제 모두 초안.
      9번째 자리 몫 항이 왜 있는지(없으면 5d 의 일의 자리가 0·5 뿐), 한 자리 오타 100%·이웃 자리 바꿈 89% 검출(무작위 2만 개로 계산), 입력 시점·지연 알림. 남은 주제: "React 인증번호 입력에 문자 자동 채우기", "사업자등록번호 검증 공식", "약관 전체 동의 체크박스 접근성" 등. 라이브러리 소개가 아니라 문제 해결 글.
25. ✅ (2026-11-13) **기존 스택에 일부만 얹기** — `examples/shadcn-starter`(Vite + Tailwind v4 + shadcn Button·Card 줄여 옮김 + BestOW 사업자·휴대폰·인증번호·약관 동의, 다크 토글),
    `src/bestow-theme.ts`(shadcn 변수 → ThemeProvider overrides: bg·fg·border·primary·radius·font — `--input` 1.26:1·`--ring` 2.59:1·`--muted-foreground` on muted 4.34:1 은 일부러 잇지 않음),
    Storybook `Guides/shadcn·Tailwind 프로젝트에 한국 키트만 쓰기`(ShadcnKoreanKit.mdx — axe 0·링크 index.json 확인), README·npm README·llms.txt 링크. 크기: 키트 4개 + ThemeProvider 8.69 kB·휴대폰 하나 5.09 kB(br, React 제외).
    일회성 확인(Chrome, vite preview): 라이트·다크·오류 상태 axe 0, 글꼴 `var(--font-sans)`(`'inherit'` 는 CSS 변수에서 바깥 변수를 이어받아 안 됨). 공개 API 변화 없음(changeset 없음). push 뒤 StackBlitz 링크 동작 확인.
    원래 계획: Guides 에 "shadcn/ui·Tailwind 프로젝트에 한국 키트만 쓰기": `styles.css` + `@layer` 순서, shadcn CSS 변수(`--primary` 등) → `--bestow-*` 매핑 예시,
    ThemeProvider 최소 설정, 번들 숫자. `examples/` 에 shadcn 예제(StackBlitz, npm 배포본만 사용) + E2E 는 일회성 확인. 포지셔닝("Tailwind 전용 복사형은 하지 않는다")은 그대로 — 보류 중인 shadcn 레지스트리와 다르다.
26. ✅ (2026-11-14, 템플릿 부분) `examples/next-starter` — `npx create-next-app@latest my-app --example "https://github.com/Dev-BestOW/BestOW-UI/tree/main/examples/next-starter"`
    (주소 형식은 main 에 있는 vite-starter 로 내려받아 확인). 3단계 가입(계정·약관 → 이름·통신사·휴대폰·인증번호 → 사업자·은행·계좌·예금주)·로그인·내 정보(서버 컴포넌트, 마스킹·서식 서버 호출)·로그아웃.
    `lib/schemas.ts` 를 zodResolver 와 서버 액션이 함께 씀, **단계마다 useForm** (한 폼이면 `.refine`(비밀번호 확인)이 다른 단계 칸이 비어 1단계에서 안 돌아감 — Patterns 단계별 흐름에도 적음),
    서버 오류(이미 가입한 이메일·틀린 인증번호·로그인 실패)는 setError → ErrorSummary. 저장소·세션·인증번호는 예제용(⚠️ 주석, README "실제 서비스로 바꿀 곳").
    일회성 확인(Chrome, next start): 흐름 16개 PASS(오류 요약 포커스·단계 제목 포커스·이전으로 값 유지·가입 후 /account·320px), 모든 화면 라이트·다크 axe 0, 콘솔 오류 0.
    README·npm README·Patterns·llms.txt·CLAUDE.md 연결. 공개 API 변화 없음(changeset 없음). 남은 것: 실사용 증거("사용 사례" 절)는 그대로 사람이 할 일.
    원래 계획: 회원가입·로그인·본인인증·정산 정보가 완성된 Next.js 템플릿(`examples/next-starter`, `create-next-app -e` 로 받는 형태, react-hook-form + zod — Guides 패턴 코드 그대로).
    README "사용 사례" 절은 실제 서비스가 생기면(사람이 할 일 — 사용자 본인 프로젝트가 가장 강한 증거).
27. ✅ (2026-11-14, 규칙 파일) **AI 코딩 도구 경로** — `docs/ai/bestow-ui.md`(한국 입력 → 컴포넌트·값 형태 표, 서버 컴포넌트·asChild, 폼(RHF + zod·ErrorSummary·validate={false}), 테마·접근성 규칙).
    `scripts/generate-llms.mjs` 가 Pages `/ai/bestow-ui.md`·`/ai/bestow-ui.mdc`(Cursor frontmatter, globs tsx·jsx)로 내보내고, 규칙 속 이름이 dist export 에 없으면 빌드 실패(변이 확인 — 처음 쓴 `Toast` 가 실제로 걸림).
    README "AI 코딩 도구와 함께 쓰기"(Claude Code `@bestow-ui.md`·Cursor·AGENTS.md 한 줄 명령)·npm README·llms.txt. 남은 것: Context7 등록(사용자), MCP 서버는 반응을 보고. push·배포 뒤 /ai/ 두 파일 200 확인.
    원래 계획: llms.txt 는 있음. 다음: Cursor·Claude Code 규칙 파일 예시(README 에 복사용), Context7 등록(사용자), MCP 서버(컴포넌트 검색·props·예제 — SEED 참고, 새 패키지라 첫 배포 절차 주의)는 반응을 보고.
28. 🟡 (2026-11-14 토큰·스타일·주요 컴포넌트 완료, 정리 2건 남음) **Figma 라이브러리** — 파일 "BestOW UI Library"(`tHxrcOkPvOAPxVQhJj8hvS`, 사용자 팀 drafts, 비공개). `docs/FIGMA.md`.
    `scripts/generate-figma-tokens.mjs`(tokens dist → JSON, CSS 변수 이름을 contract.test 목록과 대조) → use_figma: 변수 133개(Primitives 53 hidden·Color 51(라이트 50개 alias)·Space 11·Radius 6·Typography 12),
    모든 변수 scopes(ALL_SCOPES 0)·WEB codeSyntax `var(--bestow-…)`, 글자 스타일 9(Typography variant, 크기는 변수 연결)·그림자 6(라이트·다크), Foundations 견본 페이지(색 51·글자 9, 스크린샷 확인).
    **제약:** Starter 요금제 = 컬렉션당 모드 1개(addMode 실패) → Color 다크 모드 없음(요금제 올리면 같은 JSON 으로 추가). Pretendard 가 Figma 클라우드 글꼴에 없어 Noto Sans KR(600 없음 → Bold). Code Connect 는 Organization 이상이라 제외.
    **2단계(2026-11-14) 컴포넌트:** Components 페이지 Button 36·TextField 12·Checkbox 18·Badge 18, Korean Kit 페이지 VerificationCodeInput 3·Phone/Business/AccountNumberInput(TextField 인스턴스), 글자 스타일 4 추가.
    속성 이름은 코드 props 그대로, 색·간격·모서리·글자 크기 변수 연결(감사: Components 페이지 미연결 색 = Checkbox icon 프레임 흰 배경 12곳뿐), 스크린샷 확인. Starter 제약: 페이지 3개, **MCP 호출 한도에 걸림** →
    남은 일: Checkbox icon 프레임 배경 삭제·Korean Kit 감사(docs/FIGMA.md). 다음 후보: Select·RadioGroup·Switch·AgreementGroup·Alert·Modal, 아이콘 컴포넌트. 공개·게시 여부는 사용자 결정. 원래 계획: 기존 15번 그대로(tokens → Figma 변수 → 주요 컴포넌트·Code Connect). 팀 도입용이라 23~26 뒤.
29. 🟡 (2026-11-14, 토큰만 남음) **측정** — 사용자 결정: **Cloudflare Web Analytics**(쿠키 없음). 소개 사이트·playground `app/analytics.tsx`, Storybook `main.ts` managerHead 가
    저장소 변수 `CF_WEB_ANALYTICS_TOKEN`(16진수 32자, 형식이 틀리면 빌드 실패)이 있는 배포 빌드에서만 beacon 을 넣는다(storybook.yml 두 단계에 env). 가짜 토큰 빌드로 세 곳 확인(Storybook 은 manager 에만,
    OG 태그 유지), 브라우저에서 data-cf-beacon 확인, site E2E "첫 화면" 에 토큰 없으면 스크립트 0개(토큰 빌드로 실패 확인). SECURITY.md "웹사이트 방문 통계".
    **사람이 할 일:** Cloudflare 대시보드 › Web Analytics › 사이트 추가(dev-bestow.github.io) → 토큰을 GitHub 저장소 Settings › Secrets and variables › Actions › **Variables** 에 `CF_WEB_ANALYTICS_TOKEN` 으로 → 다음 배포부터 집계.
    기준값: `node scripts/stats.mjs`(스타·포크·이슈·npm 평일 중앙값 — 배포일·다음날·주말 제외, `GITHUB_TOKEN` 있으면 Discussions)를 세션 시작 때 돌려 진행 기록에 붙인다.
    원래 계획: Pages 방문 통계가 없어 유입·이탈을 모른다. 쿠키 없는 통계 도구를 붙일지 **사용자 결정 필요**(붙이면 SECURITY·문서에 밝힌다).
    그 전에는 세션 시작 때 스타·이슈·Discussions·npm 평일 기준값을 진행 기록에 남긴다(배포일 제외).
30. 🟡 (2026-11-14 준비 완료, 게시는 사용자) **꾸준한 노출·안정 인상** — 배포 주기: **격주 목요일**(2026-11-19 첫 배포 — PR #30, 이후 12/3·12/17), 보안·심각한 버그만 즉시 — SUPPORT.md·CLAUDE.md "배포".
    알리기 준비물(비공개 Artifact https://claude.ai/artifact/LvPgoSsmGKHjLd34FP789u): velog 옮겨 올리기 5편(원문 줄·태그·시리즈), 요즘IT 기고 제안 메일(KWCAG 글), FEConf·JSConf 발표 제안서(25분 목차), 접근성 커뮤니티 소개 글.
    **발견:** astro-blog 예약 발행 워크플로가 2026-09-13 이후 돌지 않음(60일 무활동 자동 비활성으로 보임) → 3편이 content-queue 에 그대로. 사용자: Actions › Daily post › Enable workflow.
    원래 계획: 24번 글을 velog·요즘IT → 접근성 커뮤니티 → 발표 지원 순으로(사람이 할 일의 런칭 순서와 같음). 배포는 SUPPORT.md 주기대로 묶는다(한 달 30개 버전은 불안정해 보임 — 기존 16번).

#### 사람이 할 일

- [x] **GitHub 저장소 설정** (2026-10-21 완료 — Claude 가 API 로 확인) — About 설명(지금 영어·옛 문구 "React design system — vanilla-extract + Radix")을 한국어로,
  Topics 추가(react, design-system, korean, accessibility, kwcag, vanilla-extract, radix-ui, nextjs 등), Discussions 켜기.
- [x] **NVDA 스크린리더 점검** (2026-10-23 완료 — NVDA + Chrome, 13개 항목 모두 ✅, 체크리스트·점검 기록에 반영) — 준비: Windows PC 에 NVDA(nvaccess.org, 무료) 설치, Chrome 또는 Firefox,
  배포된 예제 앱(https://dev-bestow.github.io/BestOW-UI/playground/interactive — 1.6 반영됨)을 쓴다(맥의 로컬 서버는 같은 네트워크면 `next start -H 0.0.0.0 -p 3001`).
  Claude 가 항목마다 누를 키·기대 문장을 안내 → 들은 문장을 받아 문제는 바로 수정. 13번 표에 1.6 의 Switch(재구현)·NativeSelect(신규)가 추가됨 —
  두 줄은 VoiceOver 로도 다시 확인(맥에서 가능). 체크리스트 13개 항목. **NumberInput "2석" 이 두 번 들리는지 꼭 확인**(VoiceOver 때문에 추가한 알림).
  끝나면 프로덕션 권장 선언 기준 6/6 → 런칭 가능.
- [x] **`@bestow-ui/korean-utils` 0.1.0 첫 배포** (2026-10-21 완료, Trusted Publisher 설정함 — 다음 버전부터 changeset) — 코드는 2026-10-21 완료(changeset 없이 package.json 0.1.0). **순서가 중요:**
  ① 이 변경을 main 에 머지(release.yml 은 react patch changeset 때문에 버전 PR 만 만든다) →
  ② 로컬에서 `git pull && pnpm install && pnpm build` → `cd packages/korean-utils && npm login && pnpm publish --access public`
  (pnpm 11 이 workspace 를 처리, 2FA 면 OTP) → ③ npmjs.com 에서 Trusted Publisher(`Dev-BestOW` / `BestOW-UI` / `release.yml`,
  **Direct publishing 체크**) 생성 → ④ 그 다음에 react 버전 PR 머지. ②보다 ④가 먼저면 react 가 npm 에 없는 패키지를 의존한다.
- [x] **VoiceOver(macOS) 짧은 재확인** (2026-10-23 완료, 모두 ✅) — 체크리스트 13번의 Switch(1.6 재구현)·NativeSelect(VO 열 비어 있음), 그리고 이번에 추가한
  사업자등록번호 10자리·DatePicker 8자리 오류 알림(입력 0.8초 뒤 "올바른 …가 아니에요" 가 들리는지). 로컬 `next start -p 3001` 로 push 없이 가능.
- [x] **런칭 게시** (2026-11-05 GeekNews Show 게시 https://news.hada.io/topic?id=36655 — Artifact 본문 그대로. 다음: velog·요즘IT 기술 글 → 접근성 커뮤니티 → 발표 지원) (2026-10-30 보류 — STABILIZATION.md 완료 조건 뒤, 본문의 버전·문구는 그때 다시 맞춘다) — 준비 끝(2026-10-23: react 1.6.1 배포, 블로그 기술 글 2편 공개, Artifact 의 GeekNews 본문 NVDA 반영). 순서: GeekNews Show(1순위) → velog·요즘IT 등에 기술 글 → 접근성 커뮤니티·공공/SI/에이전시 쪽 → FEConf·JSConf Korea 발표 지원.
- [ ] **ResidentNumberInput 스크린리더 확인**(VoiceOver·NVDA, 2026-10-23 추가 — **VoiceOver + Safari ✅ 2026-11-05**, NVDA 는 런칭 뒤 — 2026-11-05 사용자 결정) — 묶음 이름 "주민등록번호" → "앞 6자리", 뒷칸이 "보안 텍스트" 로 읽히는지, 다 채운 뒤 검증 오류가 0.8초 뒤 들리는지. playground /interactive 정산 정보.
- [ ] (가능하면) iOS VoiceOver·센스리더 점검 — 같은 체크리스트, 3·4번째 열.
- [ ] (선택) 실제 기기 확인: 가상 키보드가 Modal·Drawer 입력을 가리는지(iOS Safari·Android Chrome) — **iOS Safari ✅ 2026-11-05**, Android Chrome 은 런칭 뒤(2026-11-05 사용자 결정).
  확인 화면: /orders "주문 등록" Modal(고객 이름·메모), /navigation 아래쪽 Drawer "공유하기"(받는 사람 이메일 — 이 확인용으로 추가한 칸). 맥에서 `next start -H 0.0.0.0 -p 3001`.
- [ ] 이 라이브러리로 만든 **실제 서비스**(개인 프로젝트라도)가 생기면 알려 주기 — README "사용 사례" 에 넣는다(2026-10-21 기준 없음. playground 는 데모라 사례로 약함).
- [ ] 수요 확인: Combobox 다중 선택·비동기 검색, Tag 입력 — 런칭 반응(이슈·Discussions)으로 판단.

#### Claude 가 할 일

1. ✅ **노출 정비** (2026-10-21 완료 — 남은 것: 사용자의 GitHub 설정, push 뒤 README 이미지·배지 확인)
   - 히어로 이미지 `docs/images/hero.png` 는 playground `/signup` 운영 빌드(3001)를 Playwright 로 라이트 기본·다크+브랜드(#7c3aed)로 찍어
     나란히 합친 것(2x). 화면이 크게 바뀌면 같은 방법으로 다시 찍는다(값 입력: 이메일 hello@bestow.dev·비밀번호·전화·플랜 "프로"·연간·필수 약관 2개, 이메일 ~ 약관 동의 영역 + 14px 여백, 아래 설명 13px).
     2026-11-06 비밀번호 칸·2.0 입력 테두리 반영해 다시 찍음(2152×1676, 약 150 kB).
   - GitHub About·Topics 문구 제안(설정은 사용자).
   - 루트 README 재구성: 맨 위 **히어로 이미지**(playground `/signup` 같은 한국 서비스 키트 화면의 라이트·다크 비교 — Playwright 로 찍어 저장소에 둠),
     **배지**(npm·CI·license — 번들 크기 배지는 패키지 전체 크기를 보여 줘 "Button 하나 1.5 kB" 장점을 가리므로 달지 않고 본문에 숫자로),
     설치 예시는 **npm 먼저**, "Next.js 에서 5분 만에 시작하기", 컴포넌트 목록(썸네일 그리드 또는 표).
     메인테이너용 "개발·배포·CI/CD" 절은 CONTRIBUTING.md 로 옮긴다.
   - **비교표**(shadcn/ui·Radix Themes·MUI 등 대비: 한국형 입력, KWCAG 대응 근거, 런타임 CSS, RSC 지원, 한국어 기본 문구) — `POSITIONING.md` 의 비교 절을 바탕으로,
     **다른 라이브러리 기능은 각 공식 문서로 다시 확인한 것만** 적는다(틀리면 신뢰를 잃음).
   - 이슈·PR 템플릿(`.github/ISSUE_TEMPLATE`, 버그·기능 요청·질문은 Discussions 로).
2. **번들 줄이기** (2026-10-21 esbuild 분석: 폼 세트 minify 110 kB 중 BestOW 코드 15 kB, Radix Select + popper·floating-ui·collection·remove-scroll 약 55 kB.
   전체 266 kB 중 BestOW 코드 96 kB) — 효과 순서:
   - ✅ Switch 를 네이티브 button 으로(2026-10-21, patch) — `<button role="switch">` + form 안에서만 숨긴 checkbox(제출·required·reset·바깥 change 전달,
     Radix 와 같은 방식). 폼 세트 30.08 → 29.64 kB, 전체 69.12 → 68.62 kB — Radix 공용 부품(primitive 등)을 Select 가 계속 써서 작게 줄었다.
   - ✅ **`NativeSelect` 추가**(2026-10-21, minor) — 기존 Select 유지. size-limit 에 "폼 세트 — NativeSelect 판" 추가: **3.87 kB**(한도 4.3)
     vs Select 판 29.64 kB → 폼 세트 번들의 대부분이 Radix Select(+ popper·floating-ui). README·Guides 에 "가볍게는 NativeSelect" 로 안내.
   - ✅ BestOW 코드 96 kB 점검(2026-10-21) — **낭비 없음.** dist 를 소스 파일별로 나눠 minify: 합계 약 102 kB = 컴포넌트 66% · `.css.ts` 클래스 매핑 18%
     (이미 짧은 해시 이름) · 함수·테마 16%. 한 곳에 몰린 것 없이 컴포넌트 기능만큼(FileUpload·Combobox·AddressInput 각 ~4.5 kB) 퍼져 있다.
     export 별 단독 번들도 엉뚱한 의존성이 딸려 오는 곳 없음(tree-shaking 정상). 측정 메모: react 를 external 로 두면 tsup 이 소스 파일마다 남긴
     `import … from "react"` 60여 개가 남아 minify 크기가 부풀지만(Spinner 8.2 kB 중 5.2 kB), brotli·실제 번들(react 포함)에서는 사라진다 —
     react 포함 실측 Spinner +1.48 · Button +1.74 · NativeSelect 판 폼 세트 +4.26 · Select 판 +31.7 kB(br). **큰 덩어리는 모두 Radix**
     (Select·Popover/floating-ui 를 쓰는 DatePicker 27.6·Tooltip 18.9·Dialog 를 쓰는 AddressInput 17 kB 등).
   - 남은 후보(효과 작음, 필요하면): Avatar 를 네이티브로(Radix Avatar+Slot 로 단독 4.8 kB → 약 2 kB 예상, 이미지 로드 실패 시 이니셜 대체만 구현).
     Tabs·Accordion·Tooltip 은 Radix 의 키보드·포커스 동작을 다시 만들어야 해 위험 대비 이득이 작다 — 하지 않는다.
   - 줄인 뒤 size-limit 한도 재설정(사용자와 결정) → Combobox 다중 선택을 넣을 여유 확보. 결과 숫자는 README·런칭 글에 쓴다.
3. ✅ **`@bestow-ui/korean-utils` 패키지** (2026-10-21 코드 완료 — **첫 배포는 사용자, react 버전 PR 머지 전에**) — 의존성 없는 headless 함수 패키지. 어떤 UI 라이브러리를 쓰든 쓸 수 있게 해 본체로 들어오는 통로로 쓴다.
   - 내용: `utils/koreanFormat.ts`(전화번호·사업자등록번호 서식·검증, 금액 한글 읽기 — 이미 import 없는 순수 함수). **공휴일 데이터는 넣지 않는다**(해마다 갱신 부담, 아래 보류).
     `useFormattedInput`(입력 중 커서 유지) 같은 headless hook 을 넣을지(React peer 가 생김) 또는 별도 진입점으로 둘지 검토 — 금액 한글 변환은 `es-hangul` 등
     이미 있는 패키지가 있어 함수만으로는 차별점이 약하다.
   - react 패키지는 korean-utils 에 의존하고 **같은 이름을 다시 export** 한다(기존 사용자 breaking 없음, 새 API 없음 → react patch). `shared.test.ts` 가 같은 함수인지 확인.
     `KOREAN_WEEKDAYS`·`phoneNumberMaxDigits` 는 korean-utils 에만 공개(react 에는 새로 내보내지 않음). `parseISODate`·`toISODate` 는 한국과 무관해 react 에 남김.
   - README(한국어 + 영어 한 줄, 입력창 예시), size-limit(전체 1 kB·함수 하나 300 B), CI 는 `pnpm build`·`pnpm -r test` 가 자동으로 포함.
     korean-utils 는 changeset 없이 package.json 0.1.0 으로 첫 배포(사용자, 위 "사람이 할 일" 순서). 다음 버전부터 changeset.
   - 다음 후보(반응을 보고): 입력 중 커서를 지키는 headless 함수(`useFormattedInput` 의 계산 부분), 주민·법인등록번호 서식 등.
4. ✅ **NVDA 점검 반영** (2026-10-23 — 문제 0건. 사업자번호·DatePicker 자동 검증 오류를 `useDelayedAnnouncement`(utils, 0.8초 뒤 status)로 알림, 테스트·변이 3개,
   componentA11y·kwcag(caughtIssues)·Kwcag.mdx·README·Introduction·SUPPORT·POSITIONING·llms.txt 갱신, changeset patch. 그 밖의 입력 중 자동 오류는 없음 — AmountInput 은 max 로 조용히 자름) — 원래 계획: 발견한 문제 수정(테스트·변이 확인), `kwcag.ts`·`componentA11y.ts`·체크리스트 기록.
   기준 6/6 이면 README(루트·npm)·Storybook Introduction·POSITIONING 의 표현을 "프로덕션 권장" 으로 바꾸고 changeset(patch).
   함께: **BusinessNumberInput** 10자리를 채워 오류가 생기는 순간 알림(지금은 다시 들어가야 설명으로 들림) — Combobox 처럼 항상 있는 영역 + 늦춰서.
   같은 패턴(입력 중 자동 검증 오류)이 있는 곳도 점검(PhoneNumberInput·VerificationCodeInput 만료 알림은 이미 있음).
5. ✅ **런칭 준비물** (2026-10-21 — 게시는 사용자) — `examples/vite-starter`(StackBlitz, npm 의 react ^1.5.0 로 설치·빌드·화면 확인. 아직 배포 안 된 API 는 쓰지 않는다),
   README(루트·npm)의 "StackBlitz 에서 바로 써 보기" 링크(push 뒤 동작), `apps/storybook/public/llms.txt` + 빌드 때 생성하는 `llms-full.txt`
   (`scripts/generate-llms.mjs` — README·모든 컴포넌트 props 정의·choosing·componentA11y, 약 80 KB, Pages 루트), 초안 3편은 비공개 Artifact 페이지
   (GeekNews Show GN·기술 글 2편, 숫자는 데이터·실제 계산으로 확인. [NVDA 점검 완료 후] 자리 있음). 원래 계획:
   StackBlitz(또는 CodeSandbox) 예제와 README 의 "바로 써 보기" 링크, `llms.txt`·컴포넌트 사용법 요약(AI 코딩 도구가 찾고 쓰기 쉽게),
   GeekNews Show 소개 글 초안, 기술 글 초안 2편("KWCAG 2.2 33개 항목을 CI 로 검증하기", "대표색 하나로 대비 4.5:1 을 보장하는 테마 만들기" —
   라이브러리 홍보 없이도 읽히게). 게시는 사용자.
6. **Combobox 다중 선택·비동기 검색** (구 P14-5) — 2026-11-06 A·B·C 로 나눔: **A 다중 선택 ✅ `MultiCombobox`**(설계 `docs/archive/2026-11-06-multi-combobox-design.md`, changeset `multi-combobox`) → C Tag 입력 → B 비동기 검색. 원래 메모: — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림(`role=status`), 긴 목록 가상화는 따로.
   폼 세트 조합에 영향 → 별도 컴포넌트(`MultiCombobox` 등)로 나눌지 먼저 판단. **Tag 입력**(구 P14-6)은 쉼표·Enter 로 추가, 칩 공유.
7. **의존성 정비 2차** — 막힌 것이 풀리면: TypeScript 7(typescript-eslint 가 `<6.1`), ESLint 10(jsx-a11y 가 9 까지).
   jsdom 30 은 Node ≥22.22.2 필요(로컬 Node 를 올리면). CI 러너 Ubuntu 26 전환은 Playwright `-resolute` 이미지(1.64.1 부터 있음)로 모든 workflow 함께 검토.
8. **2.0 준비** — 후보가 쌓이면 `MIGRATION-2.0.md` 에 추가(지금: 입력 칸·체크 컨트롤 테두리 기본값 1개, deprecated 이름 없음). 출시 시점은 사용자와 결정.

#### 객관 점검에서 나온 보완 (2026-10-23 — 위에서부터 추천 순서)

> 점검 결론: 테스트·접근성·한국 키트는 충분히 강하다(오히려 검증에 과투자). 약점은 **실사용 증거 0**(스타 1·이슈 0·사례 0)과
> **실서비스 도입 때 바로 부딪힐 기초 기능 공백**. 런칭 게시가 1순위이고, 반응을 기다리는 동안 9 → 10 → 11 을 minor 하나로 묶는다.

9. ✅ **OS 다크 모드 따르기** (2026-10-23 완료, react minor changeset `theme-system-mode` — 배포 대기) — `ThemeProvider theme="system"` + 타입 `ThemeMode`(공개 `ThemeName` 은 그대로).
   서버·hydration 첫 렌더는 `systemThemeClass`(CSS 미디어쿼리) + 오버라이드 `<style>`(라이트·다크 둘 다)로 그려 깜빡임 없음, 그 뒤 `useSystemTheme`(useSyncExternalStore)로 실제 값.
   테마 클래스마다 `color-scheme`. playground 는 system 으로 시작(토글은 보이는 모드의 반대로 고정). 단위 9·SSR 1·E2E 3(JS 끈 페이지 포함), 변이 5.
   Introduction 에 쿠키 저장 예시(서버에서 읽어 첫 HTML 부터). 번들 "앱 기본" 3.37 → 3.75 kB(+390 B — 구독·서버용 오버라이드 CSS) → 사용자와 결정해 한도 3.7 → **4.1 kB**.
   남은 것: push 뒤 시각 회귀 확인(다크 스토리의 스크롤바·네이티브 컨트롤이 `color-scheme` 으로 바뀌었을 수 있음 → 바뀌면 visual.yml 수동 update). 원래 계획: `ThemeName` 이 `light | dark` 뿐이고 패키지에 `prefers-color-scheme` 대응이 없다.
   - `ThemeProvider theme="system"`(OS 설정을 따르고 바뀌면 반영 — SSR 첫 값·hydration 주의, `useIsClient` 참고).
   - 루트 `color-scheme` 지정(지금은 NativeSelect 만 — 다크에서 스크롤바·네이티브 컨트롤이 밝게 남음).
   - 사용자 선택 저장 + SSR 첫 화면 깜빡임(FOUC) 방지 가이드(Next.js `<head>` 인라인 스크립트로 `data-theme` 먼저 지정), playground 토글에 적용 + E2E.
10. ✅ **반응형 기반** (2026-10-23 완료) — tokens `breakpoint`(sm 640·md 768·lg 1024·xl 1280px), react `media`(em 미디어쿼리 — 값을 적고 테스트로 tokens 와 비교)·`Responsive<T>`·`Breakpoint`,
    Stack 구간별 `direction`·`gap`·`align`·`justify`(한 값은 기존 recipe 그대로), 새 `Grid`(columns·minItemWidth·gap)·`Container`(size·flush) — 셋 다 shared(서버 컴포넌트).
    구간별 값은 인라인 CSS 변수 + 미디어쿼리 클래스(`styles/responsiveProperty.ts`, 변수 initial 초기화로 중첩 안전) — 구간별 클래스보다 CSS·JS 가 작다.
    playground 첫 페이지 카드 Grid·본문 Container, E2E `responsive.spec.ts`(767/768/1280px 열 수·Container 폭), 스토리 play(실제 브라우저 계산값·중첩),
    Design Tokens 에 breakpoint 표, Guides(선택 기준 "배치 · 페이지 틀"·화면 패턴 "반응형 페이지 틀"), componentA11y. 변이 3(초기화 제거·md 경계 2).
    번들: 앱 기본 3.75 → 4.05 kB(한도 4.1), styles.css 10.26 → 10.66 kB. 남은 것: push 뒤 시각 회귀 확인 — 새 스토리 기준 이미지는 자동 생성, Design Tokens 페이지는 표가 늘어 수동 update 필요.
    원래 계획: tokens 에 breakpoint 없음, 컴포넌트 미디어쿼리는 Drawer `30rem` 한 곳뿐.
    - tokens 에 `breakpoint`(minor) + vanilla-extract 를 안 쓰는 사용자도 쓸 수 있는 형태(CSS 변수로는 미디어쿼리 불가 → 값 export·문서).
    - `Stack` 의 `direction`·`gap` 반응형 값(`{ base, md }` 등), 필요하면 `Grid`·`Container`. 번들 "앱 기본" 한도(4.1 kB, 지금 3.75) 확인.
11. ✅ **토큰 보강** (2026-10-23 완료 — 사용자 결정: info 만, border width·opacity 는 보류) — `info` 의미 색(기본 파랑, `SemanticColors.info` 는 선택 키 + `DefaultSemanticColors`),
    `--bestow-color-info-*`, Alert·Badge·Toast `color="info"`, `createIntentColors('info')`, Theme Builder·Design Tokens·Introduction·Guides, playground 점검 안내 Alert 를 info 로.
    border width·opacity: 쓰는 곳 없는 토큰은 만들지 않음. disabled 투명도 0.4·0.5·0.6 불일치·Alert 기본 color → info 는 `MIGRATION-2.0.md` 검토 표로.
    차트·카테고리 색: 차트 컴포넌트가 없어 보류 — 필요해지면 palette 5색으로는 부족하니 OKLCH 로 밝기를 맞춘 카테고리 8색 + 색맹 구분 검사부터.
    함정 발견: vitest 5 모듈 캐시(`node_modules/.vitest-cache`)가 tokens 변경을 모름 → CLAUDE.md 에 기록. 원래 계획: 의미 색 **`info`** 추가(Alert·Badge·Toast 안내용 — `createIntentColors` 로 대비 4.5 확인, `contract.test.ts` 목록 추가),
    border width·opacity 토큰, 차트·카테고리용 색 검토(palette 5색뿐).
12. ✅ **공용 폼 필드** (2026-10-23 완료) — `FormField`(render prop: 첫째 인자 id·aria-describedby·aria-invalid·aria-required, 둘째 인자 labelId·helperId — DOM 에 모르는 속성이 가지 않게 분리,
    이름은 Formik `Field` 와 겹치지 않게 FormField, shared) + `CheckboxGroup`(RadioGroup 모양, 네이티브 checkbox, group 엔 aria-required 가 없어 이름에 숨김 "(필수)",
    오류는 체크박스마다 aria-invalid, 값은 options 순서). 단위 13·rhf 통합 1·스토리 8(play 1)·SSR·E2E 1(WebKit Tab 이 체크박스를 건너뛰어 직접 focus), 변이 3.
    playground /interactive "알림 설정"(CheckboxGroup + FormField 로 time 입력). componentA11y·Guides(선택 기준·폼 패턴)·README. 원래 계획: `Field`(label·helperText·error·required·`aria-describedby` 연결을 직접 만든·서드파티 입력에도) +
    `CheckboxGroup`(묶음 label·그룹 오류. AgreementGroup 은 약관 전용). react-hook-form 통합 테스트에 추가.
13. ✅ **한국 키트 확장 1차** (2026-10-23 — 사용자 결정: 마스킹 + 주민번호 입력, 카드·계좌+은행은 런칭 반응 뒤) — korean-utils `formatResidentNumber`·`parseResidentNumber`·`isValidResidentNumber`
    (마지막 검증 숫자는 안 봄 — 2020-10 이후 임의 번호), `maskName`·`maskPhoneNumber`·`maskResidentNumber`·`maskCardNumber`·`maskDigits`, react 다시 export.
    `ResidentNumberInput`(두 칸: 앞 text maxLength 6 + 뒤 password, 붙여넣기는 onPaste 로 두 칸에 나눔, 앞칸 채워도 포커스 이동 없음 — KWCAG 7.2.1,
    빈 뒷칸 Backspace → 앞칸, 두 칸 값을 따로 들고 제어 값과 다를 때만 다시 나눔, digits={7}, name 은 숨긴 input). 단위 korean-utils 27·react 9 + rhf 1·스토리 4(play 1)·SSR·E2E 1, 변이 4.
    korean-utils 전체 한도 1 → 1.5 kB(사용자 결정, 1.32 kB) + "maskName 하나" tree-shaking 감시(92 B). playground 정산 정보에 대표자 주민번호(다 채우면 maskResidentNumber 로 표시).
    **스크린리더 점검 필요**(password 칸 읽기, 두 칸 묶음) — 사람이 할 일에 추가. 원래 계획: korean-utils 에 마스킹 함수(이름 `홍*동`, 전화 `010-****-1234`) 먼저(작고 수요 확실),
    그다음 주민·외국인등록번호 입력(뒷자리 마스킹), 카드번호, 계좌번호 + 은행 선택.
14. ✅ (2026-11-14 TanStack 가이드로 마무리) **컴포넌트 공백** — Guides "TanStack Table 과 함께 쓰기"(TanStackTable.mdx + 예시 스토리 2: 정렬·검색·페이지·선택·결과 없음, play 상호작용 테스트 — sortDescFirst 를 지우면 실패 확인, 서버 정렬·페이지(manual*·rowCount·getRowId), React Compiler 경고 안내). @tanstack/react-table 은 storybook devDependency 만(패키지·번들 영향 없음). 이전 메모: (2026-11-06 아래 "런칭 뒤 완성도 보강" 17~20번으로 나눠 옮김 — TanStack 가이드만 여기 남음) — Tag/Chip(표시·필터용, 6번 Tag 입력과 칩 부품 공유), 범용 `EmptyState`(지금은 TableEmpty 만),
    TimePicker(예약·배송 시간), 앱 뼈대 패턴(헤더·사이드바·모바일 하단 탭바 — Guides 화면 패턴 예시로 먼저).
    데이터 표는 직접 키우지 말고 **TanStack Table 과 함께 쓰는 패턴 가이드**(정렬·필터·페이지·선택).
15. **Figma 라이브러리** (아래 보류에서 올림) — 팀 도입은 디자이너가 함께 결정하는 경우가 많아 코드만 있는 DS 는 불리하다.
    먼저 tokens → Figma 변수 동기화(Figma MCP 연결됨), 그다음 주요 컴포넌트·Code Connect.
16. ✅ (2026-11-14) **운영** — 배포 주기는 30번(격주 목요일). CONTRIBUTING 맨 위 "처음 기여하기"(무엇부터 — good first issue, fork → PR 10분 명령, 메인테이너가 맡는 것: changeset·기준 이미지·배포), README "참여하기" 에서 링크.
    good first issue 초안 4개(알리기 준비물 Artifact): presetRange 예외 테스트·en verificationCodeHint·dayLabel 테스트·vite-starter 영어 전환·Tag 분기 테스트 — 모두 커버리지로 확인한 실제 빈 곳, 기대값은 실제 계산, 확인 명령은 직접 돌려 봄. **등록은 사용자.**
    원래 계획: 런칭 뒤 배포는 SUPPORT.md 의 주기대로 묶는다(1주 24개 버전은 "불안정" 인상). 외부 기여자용 짧은 입구(CONTRIBUTING 첫 화면에
    "처음 기여하기" — CLAUDE.md·ROADMAP 은 너무 길다). 큰 기능 전 번들 조합 한도(여유 약 10%) 확인은 6번과 같음.

#### 런칭 뒤 완성도 보강 (2026-11-06 — 위에서부터 추천 순서)

> 판단: 테스트·접근성·한국 키트는 이미 강하다. 완성도를 막는 것은 **실서비스 화면(회원가입·로그인·목록·정산)을 만들 때 바로 부딪히는 빈칸**이다.
> 런칭 반응(GeekNews 댓글·이슈·Discussions)에서 직접 요청이 오면 그것을 이 순서보다 먼저 한다. 큰 기능 전에는 어느 size-limit 조합에 들어가는지 먼저 본다.

17. ✅ **PasswordInput · SearchInput** (2026-11-06 완료, changeset `password-search-input` react minor — 배포 대기) — 보기 버튼(aria-pressed·Tab 순서·mousedown 으로 포커스 유지), Enter 검색(IME 무시)·Escape 지우기·지우기 후 포커스,
    문구 선택 키 4개, 단위 21·계약 2(+제어 1)·SSR·스토리 13(play 2, !visual)·E2E 2(/signup 비밀번호, /orders 검색 Escape·지우기), 변이 7. 커서 복원 코드는 Chromium·WebKit 에서 불필요해 넣지 않음(스토리 CaretStays 가 CI 3개 브라우저에서 감시).
    Caps Lock 안내는 하지 않음(필요하면 따로). 번들: 전체 72.35 → 73.07 kB, CSS 10.96 → 11.05 kB, 조합 변화 없음. 히어로 이미지는 2026-11-06 다시 찍음(비밀번호 칸 포함). 원래 계획(작고 수요가 확실하다):
    - PasswordInput: 보기/숨기기 버튼(이름·`aria-pressed` 상태, 눌러도 입력 포커스·커서 유지), `autoComplete` current/new-password, Caps Lock 안내 검토, 한국어·`en` 문구.
    - SearchInput: `type="search"` + 지우기 버튼(지운 뒤 입력으로 포커스), Enter → `onSearch`, IME 조합 중 Enter 무시(S1 Combobox 와 같은 처리), `role="search"` 는 쓰는 쪽 form 에 두도록 안내.
    - /orders 파일럿의 검색 칸을 SearchInput 으로 바꿔 확인. 폼 계약 테스트(`form-contract.test.tsx`)·SSR·componentA11y.
18. ✅ **Tag/Chip · EmptyState** (2026-11-06 완료, changeset `tag-empty-state` react minor — 배포 대기) — `Tag`(표시·`onRemove` 삭제·`selected` 고르는 칩 — 이름은 Chip 대신 Tag 하나로, 삭제 버튼 위 Delete·Backspace,
    켜짐은 aria-pressed + 체크 아이콘 + 고대비 Highlight(일회성 확인), 삭제 태그는 글자를 흐리게 하지 않음 — span 이라 axe 대비 예외가 없음), `TagGroup`(ul, 지우면 다음 → 앞 → 목록으로 포커스, 0.5초 뒤 "… 삭제됨",
    삭제를 누르고 1초 안에 줄지 않으면 포커스를 옮기지 않음 — 단위 테스트가 이 버그를 찾음), `EmptyState`(shared, titleAs 기본 h3). /orders 에 "적용한 조건" 태그와 표 안 EmptyState + E2E 1.
    단위 26·SSR·스토리 11(play 1)·변이 6, 문구 선택 키 removeTag·tagRemoved. 번들: 전체 73.07 → 74.09 kB, CSS 11.05 → 11.47/12 kB(여유 0.5 kB — CSS 한도에 가까워짐), 조합 변화 없음.
    6번 Combobox 다중 선택·Tag 입력은 이 Tag 를 칩으로 쓴다. 원래 계획: Tag/Chip 은 표시·필터용(삭제 버튼 이름 "… 삭제", 선택 가능한 칩은 `aria-pressed`)으로 먼저 내고, 6번 Combobox 다중 선택·Tag 입력이 같은 부품을 쓴다.
    EmptyState 는 아이콘·제목·설명·행동 버튼(hook 없는 표시용이면 shared). TableEmpty 와 관계 정리(안에서 EmptyState 를 쓰게).
19. ✅ **한국 키트 2차** (2026-11-06 완료, changeset `korean-kit-2` korean-utils·react minor — 배포 대기) — 사용자 결정: 은행 기본 목록 제공, 카드는 서식 + Luhn.
    korean-utils: 카드(`formatCardNumber`·`isValidCardNumber`·`cardNumberLength`, 아멕스 4-6-5), 법인등록번호(`formatCorporateNumber`·`isValidCorporateNumber`), 계좌(`accountNumberDigits`·`isValidAccountNumber` — 서식 없음, 10~16자리),
    `KOREAN_BANKS` 26곳(금융결제원 코드, 토스페이먼츠 기관 코드 문서로 대조 — **합병·이름 변경 때 갱신**). react: `CardNumberInput`·`CorporateNumberInput`·`AccountNumberInput`(은행 선택은 묶지 않고 Combobox·NativeSelect + KOREAN_BANKS 로),
    공통 동작은 내부 `Input/CheckedNumberField` 로 모으고 BusinessNumberInput 도 옮김(기존 테스트 그대로 통과). 외국인등록번호는 이미 ResidentNumberInput 이 지원(뒷자리 5~8).
    단위(korean-utils 32·react 10)·계약 3·SSR·스토리 10·E2E 1(/interactive 결제 카드·법인등록번호·정산 은행·계좌), 공식 변이 4. 번들: korean-utils 전체 1.42 → 2.02 kB(**한도 1.5 → 2.2 kB, 사용자 결정**) +
    "카드번호 서식·검증" 감시 260/300 B, react 전체 74.09 → 75.09 kB, 한국 키트 30.98/33.5. 원래 계획(13번 때 "런칭 반응 뒤" 로 미룬 것 — 차별점을 키운다):
    - 계좌번호 + 은행 선택(은행마다 자릿수·서식이 달라 은행 목록·서식 데이터를 korean-utils 에 둘지 먼저 판단 — 공휴일처럼 갱신 부담이 있는지 확인).
    - 카드번호 입력(4자리씩, 표시할 때 `maskCardNumber`), 법인등록번호·외국인등록번호(ResidentNumberInput 구조 재사용).
    - 한국 키트 size-limit 조합(30.87/33.5 kB)에 들어가는지 확인.
20. ✅ **앱 뼈대 패턴 · TimePicker** (2026-11-06 완료 — 새 컴포넌트·공개 API 없음, changeset 없음) — Guides 화면 패턴에 "앱 뼈대"(SkipLink·nav aria-label·aria-current, 사이드바/탭바는 display 로 하나만,
    탭바 safe-area·44px, 메뉴 Drawer 는 링크를 누르면 닫기, 실제 페이지용 media 코드)와 "시간 고르기"(정해진 시간대 → RadioGroup·Select, 아무 시각 → FormField + input time). 스토리 `Guides/앱 뼈대`
    3개(넓은 화면·휴대폰 폭·메뉴 열기 play — 스토리는 컨테이너 쿼리, 구간 변이 1), 목록 화면 패턴을 SearchInput·Tag·EmptyState 로 갱신, Guides 선택 기준에 "시간" 줄. TimePicker 는 수요가 보이면.
    playground 에는 넣지 않음(예제 앱에 이미 머리글이 있어 뼈대를 겹치면 랜드마크가 중복). 원래 계획: 헤더·사이드바·모바일 하단 탭바는 컴포넌트보다 Guides "화면 패턴" 예시로 먼저(playground 에도). TimePicker 는 예약·배송 시간 —
    지금 대안(FormField + 네이티브 time)을 먼저 Guides 에 적고, 수요가 보이면 만든다.
21. ✅ **아이콘 확장** (2026-11-06 완료, changeset `more-icons` icons minor — 배포 대기) — 사용자가 고른 목록으로 91개 추가(57 → 148종, lucide-static 1.61.0 — 2주 넘은 버전, 라이선스 주석·class 만 빼서 기존 파일과 같은 형식),
    상거래·결제·장소·일정·동작·소통·상태·파일·사람·데이터. 뺀 13개(미디어 재생·확대·창 조절 등)는 필요하면. icons README 에 lucide-react 함께 쓰기. "아이콘 하나" size-limit 그대로.
    **Foundations/Icons Gallery 스크린샷이 바뀜 → push 뒤 visual.yml 수동 update 필요.** 원래 계획: 57종은 실서비스에 모자란다. 자주 쓰는 Lucide 아이콘을 100~150종으로(svg/ + generate, LICENSE 유지), 또는 `lucide-react` 를 함께 써도 된다는 안내(크기·stroke 맞추는 법).
    "아이콘 하나" size-limit 은 그대로여야 한다(tree-shaking).
22. ✅ **폼 검증 가이드** (2026-11-06 완료 — 새 API 없음, changeset 없음) — 화면 패턴 "스키마로 검증하기(zod)": zodResolver + shouldFocusError false + ErrorSummary, 한국 키트 검증 함수 재사용(컴포넌트 자동 검증은 validate={false}),
    Controller 로 숫자만 있는 값, refine path(비밀번호 확인 — zod 는 칸 오류가 없을 때 돈다), 서버 오류 setError → 요약이 다시 나타나며 포커스. 같은 코드의 통합 테스트 `src/test/zod-form.test.tsx`(3개)
    — react devDependencies 에 zod ^4.6.7·@hookform/resolvers ^6.0.2. 원래 계획: react-hook-form + zod 스키마 + ErrorSummary 예시를 Guides "화면 패턴" 에(서버 오류를 칸에 붙이는 법 포함). 새 API 없음.
    (Figma 는 15번, 실사용 사례는 "사람이 할 일" 그대로.)

#### 보류 (수요가 생기면)

- [ ] **shadcn/ui 레지스트리로 제공** (2026-10-21 외부 추천, 보류) — `POSITIONING.md` "하지 않을 것"(Tailwind 전용 복사형)과 충돌하고,
  컴포넌트가 vanilla-extract `.css.ts`·`vars` 에 기대어 복사해 가는 쪽이 빌드 플러그인을 따로 설정해야 한다(도입 장벽이 오히려 커짐).
  하려면 포지셔닝 변경을 사용자가 먼저 결정. korean-utils 반응을 본 뒤 headless 부분부터 검토.
- [ ] 한국 공휴일 도움 함수(`koreanHolidays(year)` 등) — 음력·대체·임시공휴일 때문에 해마다 갱신 필요. 지금은 `isHoliday` 로 받는다. korean-utils 에도 넣지 않음.
- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9.9 kB 라 우선순위 낮음.
- [ ] ~~Figma 변수 ↔ tokens 동기화, Code Connect (구 P11)~~ → 2026-10-23 "Claude 가 할 일" 15번으로 올림.
- [ ] DateRangePicker 를 한 달력에서 끌어 고르는 방식.
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

#### 프로덕션 권장 선언 기준

- [x] Chromium·WebKit·Firefox 에서 스토리 테스트·E2E 통과 (P12-1)
- [x] 모바일(터치·좁은 화면) 주요 시나리오 E2E (P12-2)
- [x] React 18·19 둘 다 CI (P12-3)
- [x] 주요 컴포넌트 스크린리더 수동 점검 기록 — VoiceOver(macOS) ✅ 2026-10-21 · NVDA(Chrome) ✅ 2026-10-23 · 가능하면 iOS VoiceOver·센스리더 (P13-1 · P16-5)
- [x] 실제 화면 파일럿에서 발견한 문제 해결 (P14-1 — 버그 2개 수정, 빈칸 6개 모두 해결: [`archive/PILOT-FINDINGS.md`](archive/PILOT-FINDINGS.md))
- [x] 지원 범위·배포 주기·보안 문의 경로 문서화 (P12-5, 2026-10-21 정책 확정·비공개 취약점 신고 켜짐)

---

### 현재 상태 (2026-10-23)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 1.3.0 (1.7.0 대기) | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex(overlay < modal < dropdown < toast < tooltip), light/dark 의미 색상(1.7: + info, `DefaultSemanticColors`), 1.7: breakpoint |
| `@bestow-ui/icons` | 0.1.3 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/korean-utils` | 0.1.0 (0.2.0 대기) | 전화·사업자번호·금액·한국어 날짜·주소 참고항목, 0.2: 주민번호(서식·읽기·구조 검사)·마스킹 5종 |
| `@bestow-ui/react` | 1.6.1 (1.7.0 대기) | 아래 컴포넌트 + 테마(ThemeProvider — 1.7: `theme="system"`·createTheme·createIntentColors·strongInputBorders·vars·usePortalProps, 선택 토큰 border.input·inputHover·control) + 다국어(LocaleProvider·en) + 서식·날짜·마스킹 함수·focusField + 1.7: `media`·`Responsive` |

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃·표시 | Stack(1.7: 구간별 값), Grid(1.7), Container(1.7), Divider, Card, Typography, VisuallyHidden, Avatar, Badge, DescriptionList, Table(+ TableEmpty·TableSkeleton·useTableSelection) |
| 동작 | Button(loading), IconButton, Link |
| 폼 | Input, TextField, FormField(1.7), Textarea, Select, Combobox(clearable), NumberInput, FileUpload, SegmentedControl, Checkbox, CheckboxGroup(1.7), RadioGroup(네이티브), Switch, Slider |
| 피드백 | Alert(1.7: color info), ErrorSummary, Progress, Toast, Spinner, Skeleton |
| 오버레이 | Modal, Drawer, Popover, Tooltip, DropdownMenu(체크·라디오·하위 메뉴) |
| 탐색 | Tabs(가로·세로), Accordion, Pagination, Breadcrumb, SkipLink, Stepper |
| 한국 서비스 키트 | AgreementGroup, VerificationCodeInput, PhoneNumberInput, BusinessNumberInput, ResidentNumberInput(1.7), AmountInput, AddressInput, Calendar, DatePicker, DateRangePicker(+ dateRangePresets) |

빌드: ESM 은 `dist/client.js`("use client" — 컴포넌트·hook) + `dist/shared.js`(서버 컴포넌트에서도 쓰는 함수·값·표시용 컴포넌트 12개 — 1.7 에 Grid·Container·FormField), CJS 는 한 파일. tsup 9.
운영: CI(생성물·lint·format·build·size·typecheck·test·스토리 렌더링+axe 라이트·다크·Storybook·playground 빌드·E2E), browsers job(WebKit·Firefox 스토리·E2E),
react18 job, PR 번들 크기 코멘트(size.yml), 시각 회귀(visual.yml, Chromium, Playwright 1.64.1 이미지), changesets + npm Trusted Publishing(OIDC), CI 러너 ubuntu-24.04 고정.
테스트: vitest 5(단위 514 — react 444·korean-utils 66·icons 4, 스토리 560, 라이트·다크 axe), E2E 77(테마 system·반응형 구간 포함, 키보드·모바일 Pixel 7·iPhone 15·고대비·확대/리플로·파일럿 /orders·react-hook-form /signup·portal 테마·axe, hydration 대기).
문서: Storybook(Introduction, Foundations, Accessibility — KWCAG 2.2·컴포넌트별 키보드·스크린리더, Guides — 언제 무엇을 쓰나·화면 패턴, Korean Kit),
README·npm README(한국어), CONTRIBUTING.md, SUPPORT.md, SECURITY.md, docs/POSITIONING.md·MIGRATION-1.0.md·MIGRATION-2.0.md(초안)·SCREEN-READER-CHECKLIST.md·PILOT-FINDINGS.md.
Storybook → https://dev-bestow.github.io/BestOW-UI/ , 예제 앱 → https://dev-bestow.github.io/BestOW-UI/playground/

#### 완료한 단계 (상세는 ROADMAP-HISTORY.md)

| 단계 | 내용 |
|---|---|
| P1 | 브랜드 테마(`createTheme`/`overrides`, 고정 CSS 변수 `--bestow-*`), Next.js playground |
| P2 | 폼·표시·탐색·오버레이 컴포넌트 1차 (Switch ~ Pagination) |
| P3 | ESLint/Prettier, 스토리 axe(라이트·다크), size-limit, 시각 회귀, 버전 PR CI(GitHub App) |
| P4 | Storybook Introduction·Design Tokens, CONTRIBUTING.md |
| P5 | npm README/LICENSE, 러너 고정, 다크 shadow, warning 색, Alert·IconButton·Progress·Drawer·Link·Breadcrumb·Table·Slider·Combobox, recipe tree-shaking 수정, 시각 회귀 자동화 |
| P6 | 차별화: 테마 빌더, 한국 서비스 키트 8종, KWCAG 2.2 대응 근거 문서, LocaleProvider·한글 줄바꿈, README 메시지 |
| P8 | **1.0.0 출시**(2026-10-16): API 감사 → deprecated → 제거, `vars` 고정 테스트, 마이그레이션 가이드, 컴포넌트별 접근성 문서 |
| P10 | playground E2E(Playwright, CI), 열린 상태 스토리를 시각 회귀에 포함 |
| P7 | 서버 컴포넌트 엔트리, styles.css 디버그 이름 제거(33 → 9 kB), size-limit PR 코멘트 |
| P9 | DropdownMenu 체크·라디오·하위 메뉴, Tabs 세로, Combobox 선택 지우기, SkipLink, SegmentedControl, NumberInput, Stepper, FileUpload |
| P12 | WebKit·Firefox CI, 모바일·터치 E2E, React 18 CI + SSR 경고 테스트, 번들 한도 80 kB + 대표 조합 4개, SUPPORT.md·SECURITY.md |
| P13 | 고대비(forced-colors) 대응·E2E, 320px 리플로·글자 간격·글꼴 2배 E2E, 글자 크기 rem, 스크린리더 체크리스트 |
| P14 | 파일럿 `/orders`(버그 2개 수정), ErrorSummary·focusField·VisuallyHidden·DescriptionList, react-hook-form `/signup`, TableEmpty·TableSkeleton·useTableSelection, DateRangePicker |
| P15 | Storybook Guides(언제 무엇을 쓰나·화면 패턴), 문서 한국어 전환 |
| P16 | WebKit CI 불안정 수정(hydration 대기), 의존성 1차(vitest 5·tsup 9·Playwright 1.64.1), 입력 칸·체크 컨트롤 테두리 선택 토큰 + `strongInputBorders`, MIGRATION-2.0 초안, 지원 정책 확정, **VoiceOver 점검**(알림 4건 수정) — react 1.4.0·1.5.0 |

## 진행 기록 보관 (2026-10-14 ~ 11-10)

| 날짜 | 내용 |
|---|---|
| 2026-10-14 | 모노레포·tokens·react 기본 컴포넌트·Storybook·CI/CD 구축, npm `@bestow-ui` org 생성 |
| 2026-10-14 | 0.1.0 첫 배포 (토큰), Trusted Publishing 전환 → pnpm 11 업그레이드, Direct publishing 권한 이슈 해결 |
| 2026-10-14 | react 0.2.0 (Modal/Select/Tooltip/Toast), icons 0.1.0 + react 0.2.1 배포. 이 로드맵 작성 |
| 2026-10-14 | P1-1 완료: CSS 변수 이름 고정(`--bestow-*`), `createTheme`/`overrides`/`createIntentColors`/`usePortalProps`, 중첩 시 모드·브랜드 상속, Theming 스토리. react 0.3.0 배포 |
| 2026-10-14 | P1-2 완료: `apps/playground`(Next.js 16, dist 사용), CI 빌드 단계, 브라우저 자동 점검. 포커스 링 브랜드색·Select 제어 모드 경고 수정. 다음은 P2-1 (Switch, RadioGroup, Textarea) |
| 2026-10-14 | playground 를 GitHub Pages `/playground/` 에 정적 export 로 함께 배포하도록 storybook.yml 확장 |
| 2026-10-14 | P2-1 완료: Switch, RadioGroup(options 배열, 보조 설명은 aria-describedby), Textarea(autoResize, showCount). playground 폼에 추가, 브라우저 점검(키보드 조작·다크·브랜드) 통과. 다음은 P2-2 (Spinner + Button loading, Badge, Card …) |
| 2026-10-14 | 세션 종료. react 0.3.1 배포 완료, 0.4.0 은 버전 PR #6 머지 대기. 인수인계 섹션 작성 |
| 2026-10-15 | PR #6 머지·react 0.4.0 배포 확인. P2-2 Spinner + Button `loading` 구현(공용 `visuallyHidden`·`spin` 추가), playground 가입 버튼에 적용, 브라우저 점검(포커스 유지·중복 제출 차단·콘솔 경고 0) 통과. 다음은 Badge |
| 2026-10-15 | P2-2 Badge 구현, playground 서버 컴포넌트 페이지에 추가. 라이트·다크 12개 조합 대비 4.5 이상, 콘솔 경고 0. 다음은 Card |
| 2026-10-15 | react 0.5.0 배포 확인(Spinner). P2-2 Card(+Header/Body/Footer) 구현, playground 서버 컴포넌트 페이지에 추가, 라이트·다크 점검·콘솔 경고 0. 다음은 Divider |
| 2026-10-15 | Badge·Card push 확인(버전 PR #8). P2-2 Divider 구현, playground 서버 컴포넌트 페이지에 추가, 라이트·다크 점검·콘솔 경고 0. 다음은 Avatar |
| 2026-10-15 | react 0.6.0 배포 확인(Badge, Card). P2-2 Avatar 구현(`@radix-ui/react-avatar` 추가), playground 에 추가. dev·prod 모두 hydration 경고 0, fallback 대비 라이트 10.3/다크 12.9. 다음은 Skeleton |
| 2026-10-15 | P2-2 완료: Skeleton 구현, playground 상호작용 페이지에 "게시글 다시 불러오기"(Button loading + Skeleton + aria-busy) 예시. reducedMotion 정지·콘솔 경고 0 확인. 다음은 P2-3 Tabs |
| 2026-10-15 | react 0.7.0 배포 확인. P2-3 완료: Tabs, DropdownMenu, Popover, Accordion, Pagination + playground `/navigation`. user-event 도입, 테스트 63개 추가(react 총 153), 핵심 테스트는 변이 확인. 라이트·다크+브랜드, 키보드, portal 색, reducedMotion, dev·prod 콘솔/hydration 경고 0 확인. 다음은 P3 |
| 2026-10-15 | P3 1~4 완료: ESLint 9 + Prettier(전체 포맷), 스토리 테스트(addon-vitest, axe) CI, size-limit, 시각 회귀(Playwright Docker, 198장). 도입하며 발견·수정: fg.subtle 대비(3.32→5.18), RadioGroup 비활성 설명, tree-shaking(Button 40→2.4 kB). P3-5 는 원인 조사 후 사용자 확인 대기 |
| 2026-10-15 | P3-5: 원인 확인(봇 PR workflow 승인 대기 → 만료). release.yml 을 GitHub App(`bestow-ui-release`) 토큰으로 변경, 사용자가 App·variable·secret 등록. 다음 버전 PR 에서 동작 확인 필요 |
| 2026-10-15 | P4 완료: Storybook Introduction(설치·설정·Next.js·다크 모드·브랜드 테마·아이콘·토큰 사용·접근성), Foundations/Design Tokens 스토리 6개, CONTRIBUTING.md, README 정리. 사이드바 순서 지정. 스토리 105개 axe 통과, 라이트·다크 화면 확인 |
| 2026-10-15 | Accordion: `type="multiple"` 에 `collapsible` 이 섞여 오면(Storybook args 병합 등) Radix 가 DOM 으로 넘겨 React 경고 → 컴포넌트에서 제거. 회귀 테스트 추가(수정 전 실패 확인), react 154 테스트·스토리 105개 통과, 경고 사라짐 |
| 2026-10-15 | 스토리 axe 를 라이트·다크 두 project 로 실행(210개 통과, 시간 약 2배). 다크 fg.muted 를 일부러 낮춰 다크 project 만 21개 실패하는 것 확인 후 원복 |
| 2026-10-15 | npm 페이지 정리: 패키지별 README(영/한)·LICENSE, package.json 메타데이터, 루트 LICENSE. `npm pack --dry-run` 으로 README·LICENSE 포함 확인 |
| 2026-10-15 | CI 러너 고정: ci/release/storybook/visual 의 `ubuntu-latest` → `ubuntu-24.04` (2026-10-19 Ubuntu 26 전환 대비). CLAUDE.md 함정에 기록 |
| 2026-10-15 | 다크 shadow(`darkShadow` + ring, Card elevated 테두리 제거), warning 의미 색(amber, 대비 4.5 이상) 추가. 기본 intent 대비 테스트를 넣다가 다크 solidHover 대비 미달(3.3~4.38) 발견 → 수정, createIntentColors hover 도 대비 보장(이전 방식이면 #7c3aed 등 실패하는 것 확인). react 160 테스트·스토리 210개 통과 |
| 2026-10-15 | Alert 구현(스토리 9개, 테스트 8개 — 아이콘 aria-hidden·닫기 버튼은 변이 확인), playground 서버 컴포넌트 페이지에 추가. 라이트·다크 axe 228개 통과, 키보드 닫기·RSC 렌더링·콘솔 경고 없음 확인 |
| 2026-10-15 | IconButton 구현(테스트 6개 — loading 처리는 변이 확인, aria-label 필수는 타입 테스트), 아이콘 전용 Button 사용처 교체. Storybook "Control of type color" 경고 원인(react-docgen 의 Omit 상속 미해석) 찾아 해결. 라이트·다크 axe 238개 통과 |
| 2026-10-15 | Progress 구현(테스트 6개, 범위 보정·indeterminate 는 변이 확인), playground 업로드 데모. 막대 색을 solid → text 로(다크 대비). 스토리 252개 통과, reducedMotion·콘솔 경고 확인. styles.css 22.3/23 kB |
| 2026-10-15 | Drawer 구현(테스트 6개, portal 테마는 변이 확인). Button 단독 크기 증가 추적 → vanilla-extract recipe 에 PURE 누락 발견, 빌드 플러그인 래퍼로 수정(2.6→1.48 kB), 감시 한도 2 kB. 스토리 264개 통과 |
| 2026-10-15 | Link·Breadcrumb 구현(테스트 10개 — Breadcrumb 마지막 항목·구분 기호는 변이 확인). 테스트가 외부 링크 이름 붙음("예시(새 창)") 발견 → 수정. 서버 컴포넌트용 asChild 추가. 스토리 278개 통과 |
| 2026-10-15 | visual.yml: 새 스토리 기준 이미지 자동 생성·커밋(main), 기존 화면 변경만 수동 update. Playwright 1.64 의 missing 모드 동작을 로컬에서 검증 |
| 2026-10-15 | Table 구현(테스트 7개, scope·aria-sort·포커스 변이 확인). 좁은 스크롤 표에서 한글 단어 중간 줄바꿈 발견 → keep-all. 스토리 288개 통과 |
| 2026-10-15 | Slider 구현(테스트 7개, 범위 이름·제어 모드·valuetext 변이 확인). 스토리 300개 통과. styles.css 26.2/28 kB |
| 2026-10-15 | Combobox 구현(테스트 8개, 변이 4종 확인, play 스토리로 열린 목록 axe). P5 새 컴포넌트 후보 모두 완료. 스토리 312개 통과 |
| 2026-10-15 | 로드맵 재정리: P1~P5 상세를 ROADMAP-HISTORY.md 로 보관, 현재 상태(0.9.0, 컴포넌트 32개) 갱신, 다음 단계 P6(1.0 API 안정화)~P10 제안. API 불일치 발견(Toast variant vs color, DropdownMenu default vs neutral, Button intent 범위) |
| 2026-10-15 | 포지셔닝 문서(POSITIONING.md) 작성 — 대상·약속 4축·비교(SEED·Vapor·Bezier 확인 출처)·KWCAG 2.2(KS X OT0003:2022). 로드맵에 P6 차별화 추가, 1.0 은 P8 로 |
| 2026-10-15 | P6-1 테마 빌더(입력·라이트/다크 미리보기·대비 리포트 42항목·코드 복사, play 테스트). 리포트가 createIntentColors 포커스 링 대비 미달(#facc15 1.53 등) 을 찾아 수정·회귀 테스트(변이 확인) |
| 2026-10-15 | P6-2 한국 서비스 키트 1차: AgreementGroup·VerificationCodeInput(테스트 10개, 변이 4종). 붙여넣기 maxLength 버그 발견·수정. 스토리 "Korean Kit" 그룹, playground 가입 폼 교체 |
| 2026-10-15 | styles.css 28.49 kB 로 한도 초과 → 사용자 결정으로 36 kB 로 상향(분리는 P7). |
| 2026-10-15 | P7 CSS 결정: styles.css 하나 유지(A), 컴포넌트별 선택 import(B)는 1.0 이후 minor 로. CSS 비중 측정(테마·공통 15%, 컴포넌트당 2~5%) |
| 2026-10-15 | P6-3 일부: PhoneNumberInput·BusinessNumberInput·AmountInput + 서식 함수. 커서 유지 테스트를 jsdom → 실제 브라우저 play 로 옮기고 변이 확인(처음 고른 예시는 서식 전후가 같아 무의미했음) |
| 2026-10-15 | P6-3 주소 검색: AddressInput(+카카오 우편번호 공급자, 가짜 공급자로 테스트). 테스트가 Modal·Drawer 제어 모드 포커스 유실 발견 → useReturnFocus 로 수정(변이 확인). |
| 2026-10-15 | P6-3 날짜 선택: Calendar·DatePicker(+date 유틸). axe 가 날짜 버튼의 레이블-이름 불일치(WCAG 2.5.3) 발견 → 이름을 보이는 숫자로 시작. 제어 모드 입력 지워짐 버그 재현 테스트(덮어쓰기)로 찾아 수정. |
| 2026-10-15 | P6-4 KWCAG 2.2 대응 근거 문서(Storybook Accessibility). 항목 대조 중 달력 공휴일 색 의존 발견·수정. 문서 페이지 axe 위반 0 |
| 2026-10-15 | P6-5: LocaleProvider·en(다국어 문구, 테스트 4개 — 중첩 병합 변이 확인), 한글 줄바꿈 기본값(keep-all). |
| 2026-10-15 | P6-6 메시지 반영(README·npm README·Introduction). P6 차별화 단계 완료. |
| 2026-10-16 | 문서 점검: ROADMAP 인수인계·현재 상태 갱신(0.11.0, 컴포넌트 40개), P6 상세를 ROADMAP-HISTORY 로 이동, CLAUDE.md·CONTRIBUTING·POSITIONING·npm README 보완 |
| 2026-10-16 | visual.yml: update 실행이 도중의 push 실행에 취소되던 문제(같은 concurrency 그룹) → update 를 별도 그룹·취소 안 함, 갱신 커밋 push 실패 시 rebase 후 재시도 |
| 2026-10-16 | P8 API 감사(d.ts 의 모든 Props 비교) → Toast `color`·DropdownMenuItem `neutral`·Spinner `inherit`·Checkbox `onCheckedChange` 추가, 옛 이름 deprecated(warnOnce, 변이 확인), 타입 5개 export, MIGRATION-1.0.md |
| 2026-10-16 | P8: `vars` 이름 87개 확정 + 고정 테스트(변이 확인), Storybook "Accessibility/컴포넌트별 키보드·스크린리더" 문서(코드 대조로 8곳 정정, 문서 페이지 axe 위반 0) |
| 2026-10-16 | 사용자 결정: react 전체 JS 한도 65 → 70 kB |
| 2026-10-16 | react 0.12.0 배포 확인(npm·태그·GitHub Release, d.ts 에 새 타입·dist 에 deprecated 경고 포함) |
| 2026-10-16 | 1.0 준비: 옛 이름 4개 제거(타입 오류로 고정, 변이 확인), changeset major(react·tokens), 버전 규칙·MIGRATION·CONTRIBUTING 갱신 |
| 2026-10-16 | 1.0 출시 전 점검 — 고친 것: ① CJS 타입(exports require→d.cts, TS ≤5.7 TS1479) ② React 18 SSR useLayoutEffect 경고(서식 입력) ③ Next 서버 컴포넌트에서 createTheme·vars·서식 함수 호출 실패("use client" 전체 적용) → ESM 을 client/shared 로 분리, playground 서버 페이지가 회귀 감시 ④ createIntentColors 중간 밝기 색(#059669·#ea580c 등 343색 중 41색) 버튼 대비 4.5 미달 → solid 밝기 보정 + 표본 테스트 ⑤ 인라인 Calendar SSR "오늘" hydration 불일치(UTC 서버) → hydration 뒤 결정. 모두 변이 확인. 그 외 playground 제목 순서·패널 없는 Tabs 수정. 확인만: Radix Select·DropdownMenu 열림 중 axe aria-hidden-focus 는 Radix 의 포커스 가둠 방식이라 유지 |
| 2026-10-16 | 🎉 **1.0.0 출시** — react·tokens 1.0.0, icons 0.1.2. npm 설치본으로 ESM·CJS·SSR·타입·색 대비 재확인 |
| 2026-10-16 | P10: playground E2E 17개(CI 단계 추가, 반복·변이 확인 — Select 타이핑 타이밍 불안정 1건 수정), 열린 상태 스토리 7개 시각 회귀 포함(play 완료 대기 — Storybook 10 의 마지막 phase 는 'finished') |
| 2026-10-16 | Storybook 다크 배경이 스토리 높이까지만 칠해지던 문제 — 스토리 화면에서 테마 영역 min-height 100vh(문서 페이지는 그대로). 다크 기준 이미지 전체 갱신 필요 |
| 2026-10-16 | P9: Combobox 선택 지우기(글자 모두 지우고 닫기 + clearable 버튼, 테스트 4개·변이 3종 확인, 새 문구 키 clearSelection 은 선택 키). 자동 문서 prop 누락 수정 — Phone·Business·Amount·TextField 주요 prop 직접 선언(DatePicker 는 이미 직접 선언), Accordion 은 argTypes |
| 2026-10-16 | P9: SkipLink 추가(테스트 6개·변이 3종, playground 맨 앞 배치 + E2E), KWCAG 6.4.1 사용자 몫 → 일부, 컴포넌트별 접근성 문서 추가 |
| 2026-10-16 | P9: SegmentedControl(radiogroup 의미, 테스트 9개·변이 2종, E2E 연속 화살표 5회 반복). 처음엔 Radix RadioGroup 위로 만들었으나 Radix 가 "포커스 이동 때 화살표가 아직 눌려 있는지" 로 선택해 빠른 키 입력에서 약 20% 선택 누락 → 직접 구현. playground 정렬 예제 |
| 2026-10-19 | 문서 점검: ROADMAP 인수인계·현재 상태(1.0.0·PR #19·43개·번들) 갱신, P8·P10 상세를 ROADMAP-HISTORY 로 이동, README·Introduction·POSITIONING·npm README 보완 |
| 2026-10-19 | 1.1.0 배포 확인. P9 DropdownMenu `CheckboxItem`·`RadioGroup`/`RadioItem`·`Sub`/`SubTrigger`/`SubContent` 추가 — 테스트 7개(변이 확인: 하위 메뉴 portal 테마), 스토리 4개(열린 상태 2개 play), playground "보기 옵션" 메뉴·"이동" 하위 메뉴 + E2E 3개(5회 반복 안정), 접근성 문서. 다음은 Tabs 세로 |
| 2026-10-19 | P9 Tabs `orientation="vertical"` — 테스트 2개(변이 확인), 스토리 Vertical·VerticalSoft, playground 세로 탭 + E2E(↑/↓·레이아웃 위치, 5회 반복 안정), 접근성 문서. P9 기존 컴포넌트 보강 마무리 |
| 2026-10-19 | P7 size-limit PR 코멘트: `size.yml`(PR·base 각각 빌드·측정 → 코멘트 하나 갱신, 포크는 Summary) + `scripts/size-report.mjs`. 로컬에서 87537ab 를 base 로 실제 비교·경계 사례(초과·근접·추가/삭제) 확인, actionlint 통과. 실제 PR 동작은 미확인 |
| 2026-10-19 | 백로그 RadioGroup: E2E 로 재현(키를 바로 떼는 화살표 입력에서 20회 중 19회 선택 누락) → 네이티브 `<input type="radio">` 로 재구현(props·ref 동일, Radix 의존성 제거). 테스트 6개 추가(변이 2종), E2E 20회 반복 통과, 시각 회귀는 macOS 에서 이전 커밋과 픽셀 동일(허용치 0) 확인 |
| 2026-10-19 | 백로그 Slider·Progress 트랙 대비: 트랙 1.11(라이트)/1.55(다크):1 → 후보 3개(현행·fg.subtle 테두리·새 토큰)를 그려 비교, 사용자 결정으로 **fg.subtle 안쪽 테두리**(새 토큰 없음, 고대비 모드 외곽선). 기준 이미지 30장 갱신 필요 |
| 2026-10-19 | P7 서버 컴포넌트: hook 없는 표시용 7개를 shared 로(서버 컴포넌트 렌더링). `shared.test.ts`(import 그래프에 hook·Context·Radix·핸들러·"use client" 없음, 이름 중복 없음 — 변이 확인), playground 서버 페이지에 Card `as`=서버 함수(Card 를 client 로 되돌리면 빌드 실패 확인) + E2E |
| 2026-10-19 | 기준 이미지 갱신(봇 `419095c`, 37장) 확인: 예상 30장 외 RadioGroup·Drawer(opened) 7장은 선택 점 가장자리 안티앨리어싱 차이(156px, 0.03%), AgreementGroup 1장은 잡음. 1.2.0 배포 준비 완료 |
| 2026-10-19 | P9 NumberInput: 테스트 18개(변이 4종 — 처음엔 반올림 변이가 살아남아 0.7+0.1 테스트로 강화), 스토리 9개(키보드·커서 play), playground 좌석 수 + E2E, 접근성 문서·README |
| 2026-10-19 | P9 Stepper: 테스트 6개(변이 3종), 스토리 5개, playground 회원가입 단계 + E2E(aria-current 이동), 접근성 문서·README |
| 2026-10-19 | react 1.2.0 배포 확인. styles.css 디버그 주석 제거: brotli 33.1 → 9.2 kB(실제 CSS), 소스맵 위치 검증(4곳), 남으면 빌드 실패(변이 확인), 한도 12 kB. P7-B(컴포넌트별 CSS) 우선순위 낮춤 |
| 2026-10-19 | 문서 정리: 인수인계를 현재 상태(1.2.0 배포, PR #21 = 1.3.0)로 다시 씀, 추천 순서 갱신 |
| 2026-10-19 | P9 FileUpload: 테스트 9개(변이 4종 — 제어 모드 변이는 결과가 같은 변이), 스토리 7개(폼 제출 play 는 실제 브라우저에서 input.files 동기화 변이 확인), 비활성 대비 수정(영역 투명도 제거), playground 통장 사본 + E2E |
| 2026-10-19 | 로드맵 재정리: 프로덕션 수준 평가를 바탕으로 P12(신뢰성: 크로스 브라우저·모바일·React 18·번들 한도·지원 정책) → P13(접근성 실사용 검증) → P14(파일럿·빈칸) → P15(문서), 보류 P16. 프로덕션 권장 선언 기준 추가. 완료한 P7·P9 상세는 ROADMAP-HISTORY 로 이동 |
| 2026-10-19 | P12-1 크로스 브라우저: 스토리 테스트·E2E 브라우저 선택(env) + ci.yml browsers job(webkit·firefox). 로컬 WebKit 스토리 470 통과, E2E 실패 2건은 Safari 기본 동작(Tab 이 링크 건너뜀·클릭 시 포커스 없음·라디오 끝에서 안 돎) → 테스트 수정·문서화, 3회 반복 84/84. Firefox 는 로컬 실행 불가 → CI 확인 |
| 2026-10-19 | CI 첫 크로스 브라우저 결과: WebKit 성공, Firefox 스토리 통과·E2E 실패(로그 미확인) → github reporter 추가. P12-2 모바일 E2E(Pixel·iPhone 9개, 3회 반복 안정): playground 좁은 화면 넘침 수정, 리플로 검사 기준을 기기 폭으로 |
| 2026-10-19 | P12-4 번들 한도: 전체 80 kB + 대표 조합 4개(앱 기본·폼·오버레이·한국 키트, +10%) |
| 2026-10-19 | CI 2차: Firefox 스토리 1건(NumberInput 키보드 play, 가끔 실패로 추정) → 클릭 포커스 + 포커스 확인으로 보강, 스토리가 실패해도 E2E 가 돌게. P12-3 React 18 job + SSR 스모크 테스트 |
| 2026-10-19 | CI 3차: React 18 job 성공. Firefox 2건(SkipLink 스토리 포커스 타이밍, Firefox 의 scroll-linked 성능 안내 경고) 수정. P13-2 고대비: 9개 컴포넌트 시스템 색 대응 + E2E(변이 확인, hover 결함 발견) |
| 2026-10-19 | CI 4차: Firefox 녹색 → P12-1 완료, 고대비 E2E 색 전환 중간값 → poll. P13-3 확대·리플로: 인증번호 칸 320px 넘침 수정, 글자 크기 rem(minor, 사용자 결정)·minHeight, Avatar 이니셜 px, zoom.spec(10개, 변이 확인). 전체 472장 macOS 픽셀 비교 동일 |
| 2026-10-19 | P12-5 SUPPORT.md·SECURITY.md 작성, README·npm README·Introduction 연결. 프로덕션 권장 선언 기준 6개 중 4개 충족(남은 것: 스크린리더 수동 점검, 파일럿) |
| 2026-10-19 | P13-1 스크린리더 점검 체크리스트 작성(13개 항목, 조합 4개, 결과 기록 방법) — 실행은 사람 |
| 2026-10-19 | CI 5차(`5d62d21`): 시각 회귀(Linux) 성공 — rem 전환 화면 변화 없음 확인. Firefox 만 /navigation 320px 리플로 1px → 반올림 오차로 1px 허용 |
| 2026-10-19 | P14-1 파일럿 `/orders`: Modal 안 Select 가림(z-index)·메뉴→Drawer 포커스 복귀 버그 수정, 빈칸 6개 PILOT-FINDINGS.md. 프로덕션 권장 선언 기준 5/6 (남은 것: 스크린리더 수동 점검) |
| 2026-10-19 | P14-2: ErrorSummary·VisuallyHidden·focusField 추가, AgreementGroup id, react-hook-form 통합 테스트·/signup 예제·E2E, 파일럿 폼 교체. FileUpload 테스트의 .at()(ES2022)을 lastCall 로 |
| 2026-10-19 | DescriptionList 추가(서버 컴포넌트, 파일럿 상세 교체). CI Firefox 스토리 포커스 실패(Combobox·NumberInput)를 공통 원인(iframe 창 포커스)으로 보고 vitest.setup 에서 window.focus(). 시각 회귀 annotation 으로 바뀐 스토리 확인(zIndex 2장만) |
| 2026-10-19 | CI 전부 녹색: Firefox 스토리 포커스(창 포커스 설정) 해결 확인, 시각 회귀 update(zIndex). P14-3: TableEmpty·TableSkeleton·useTableSelection(변이 확인), 목록 패턴·Modal 폼 제출 스토리, 파일럿 교체 |
| 2026-10-19 | P15 문서: Storybook Guides 섹션 — 언제 무엇을 쓰나(6묶음), 화면 패턴(폼 검증·RHF·Modal 폼, 목록, 단계별 흐름, 업로드). 링크 전수 검사·axe(라이트·다크) 0. ErrorSummary 의 불필요한 eslint-disable 제거 |
| 2026-10-19 | 문서 언어 결정(사용자): 한국 시장 타깃 → npm README 3개 한국어로(영어 한 줄 소개), package.json 설명 한국어·키워드 정리(korean·kwcag·a11y 등). `en` 문구 묶음은 기능이라 유지. changeset `korean-readme`(3패키지 patch) |
| 2026-10-19 | P14-4 DateRangePicker: 테스트 7개(변이 2종), 스토리 4개(빠른 선택 play), 파일럿 주문일 필터 + E2E, 좁은 화면 "~" 홀로 남음 → 쌓기로 수정. 문구 3개·presets 는 shared |
| 2026-10-19 | 세션 마무리: ROADMAP 정리(인수인계 1.3.0·PR #22, 다음 플랜을 사람/Claude 로 나눔), P12~P15 상세를 ROADMAP-HISTORY 로. 번들 재측정(전체 68.9/80 kB) |
| 2026-10-20 | WebKit CI 실패 수정: ① Modal "폼 제출" 스토리 — 닫힘 애니메이션 동안 바깥이 aria-hidden 이라 status 를 못 찾음(느린 CI) → 대화상자가 사라질 때까지 대기(닫힘 1.5초로 늘려 옛 코드 실패·새 코드 통과 확인) ② E2E 첫 조작이 hydration 전에 사라지는 불안정(DropdownMenu·Combobox·FileUpload) → playground 가 `html[data-hydrated]` 를 남기고 fixtures 의 `page.goto` 가 기다림(CPU 30배 스로틀에서 대기 없으면 3번 중 2번 실패, 대기하면 0) |
| 2026-10-20 | CI `f1cfa77` 전부 녹색(WebKit flaky 0) 확인. 의존성 1차: Playwright 1.64.1(+ visual.yml 이미지 태그)·Next 16.4.2·React 19.3.1(lockfile)·vitest 5.0.5·tsup 9.0.0. tsup 9 출력은 JS·CSS 동일, d.ts 는 `export type { }` 표기만 바뀜(공개 이름 3패키지 같음), size 동일. vitest 5 에서 변이 실패 확인, React 18 overrides 로컬 재현 통과. 개발 Node `>=22.18`(tsup 9). CI `e49af92` 전부 녹색 — 시각 회귀 500장 통과(Playwright 1.64.1 이미지), flaky 0 |
| 2026-10-20 | P13-4(사용자 결정 ②): 선택 토큰 `color.border.input`·`inputHover` — CSS 변수를 정의하지 않고 `fallbackVar` 로 border.default·strong 을 따름(기본 화면·기존 오버라이드 유지), `strongInputBorders`(라이트 gray600/700, 다크 gray500/300 — 다크 gray600 은 bg.subtle 2.98:1 이라 제외). Input(→ Select·Combobox·DatePicker·서식 입력)·Textarea·인증번호 칸. 단위 테스트 4개(대비·hover·변수 펼침), 스토리 play(라이트·다크 계산된 테두리색) — 변이 3종 확인. 발견: 체크 컨트롤 border.strong 2.07:1. `docs/MIGRATION-2.0.md` 초안 |
| 2026-10-20 | CI `fe6ab93`: 시각 회귀만 CSS 변수 2장 실패(예상). 높이 +574px 는 "(선택 — 기본값 없음)" 이 첫 열을 넓혀 7행이 더 줄바꿈된 탓 → 경로 아래 작은 줄로(열 폭 원래대로 212/243/297px 측정). 나머지 job 녹색 |
| 2026-10-21 | 기준 이미지 갱신 확인(`2ea3e39`, CSS 변수 2장만). PR #22 머지 → **react 1.4.0 배포 확인**: npm latest·태그·GitHub Release·provenance, 설치본 ESM·CJS 에 DateRangePicker·strongInputBorders·border.input, d.ts·d.cts 포함, CSS 에 선택 변수 미정의(fallback 3곳) |
| 2026-10-21 | Private vulnerability reporting 켜짐 확인(API). SUPPORT.md 확정(사용자 결정): 배포 "준비되면"(주 1회 문구 수정), 이전 major 6개월 유지 |
| 2026-10-21 | 체크 컨트롤 테두리(사용자 결정 — 선택 토큰): `color.border.control`(기본값 없음 → border.strong) — Checkbox·Radio 테두리, 꺼진 Switch 트랙, Stepper 예정 단계(원·연결선). `strongInputBorders` 에 라이트 gray600·다크 gray500 추가. 스토리 play 에 4종 확인, 변이 5종(컨트롤 4 + 프리셋 값) 확인. changeset `strong-control-borders`(minor), MIGRATION-2.0 1번에 합침 |
| 2026-10-21 | 스크린리더 수동 점검 VoiceOver+Safari(사용자와 함께, 로컬 playground 3001): 13개 모두 ✅. 고친 것 — Combobox 결과 없음 알림(항상 있는 status + 입력 멈춘 뒤 0.8초), NumberInput 키·버튼 값 알림(assertive "2석"), FileUpload 삭제 알림(포커스 이동 0.5초 뒤)·삭제 버튼 설명에 크기, playground DatePicker 에 고정 공휴일(isHoliday). 각각 단위 테스트·변이 확인 후 VoiceOver 재확인. changeset 3개(patch). 남은 것: NVDA·iOS·센스리더. 개선 후보: 사업자번호 오류를 입력 순간 알림, 공휴일 도움 함수 |
| 2026-10-21 | 세션 마무리: NVDA 점검은 다음으로(사용자). 인수인계에 커밋 대기 내용·스크린리더 점검 진행 방식·배운 것 정리 |
| 2026-10-21 | CI `eb7535d`: React 18 job 만 실패 — FileUpload `useRef<Timeout>(undefined)` 가 @types/react 18 에 없는 오버로드 → `useRef<Timeout \| undefined>`. overrides 로 로컬 재현·해결(typecheck 0, 테스트 410). 버전 PR #23(1.5.0)은 이 수정 push 후 머지 |
| 2026-10-21 | react 1.5.0 배포 확인(npm·Release·설치본에 border.control·알림 지연 코드). 로드맵 정리: 10/20~21 작업을 HISTORY P16 으로, 진행 기록 99줄을 HISTORY 로 보관, 다음 플랜을 NVDA 점검 → 개선 후보 → 수요 기반 기능 → 의존성 2차 → 2.0 준비 순으로 |
| 2026-10-21 | 다음 플랜 재정리: 알리기·도입 장벽 우선 — 노출 정비(README·Topics·비교표) → 번들 줄이기(Switch 네이티브·NativeSelect) → `@bestow-ui/korean-utils` → NVDA → 런칭 준비물·게시. 런칭은 프로덕션 권장 6/6 뒤. shadcn 레지스트리는 포지셔닝과 충돌해 보류, 실제 서비스 사례는 아직 없음 |
| 2026-10-21 | 노출 정비: 루트 README 재구성(배지 npm·CI·license, 히어로 이미지, 비교표 — 공식 문서 확인, npm 설치 먼저, Next.js 5분 시작 — 예제 코드 playground 에서 타입 검사, 컴포넌트 표), 개발·배포·CI/CD 절을 CONTRIBUTING 으로, npm README 에 CI 배지·히어로 이미지(raw URL), 이슈 템플릿(버그·기능 제안·config)·PR 템플릿 |
| 2026-10-21 | 번들 줄이기 1차: Switch 네이티브 구현(`@radix-ui/react-switch` 제거, 테스트 12·변이 6), NativeSelect 추가(테스트 8·변이 5, rhf register·SSR·E2E·스토리 play) — NativeSelect 판 폼 세트 3.87 kB(Select 판 29.64 kB) |
| 2026-10-21 | BestOW 코드 번들 점검: 소스별·export 별 측정 — 낭비·tree-shaking 누수 없음, 큰 덩어리는 Radix. 남은 후보 Avatar 네이티브(효과 작음). playground NativeSelect 선택지를 권역으로(Combobox "부산" 과 이름이 겹쳐 E2E 2개 실패했던 것) |
| 2026-10-21 | `@bestow-ui/korean-utils` 0.1.0 준비: 전화·사업자번호·금액·한국어 날짜·주소 참고항목 순수 함수(의존성 0, 전체 838 B·함수 하나 179 B br), react 는 같은 이름으로 다시 export(호환 테스트), 테스트 39(공개 이름 목록 고정), README(예시 값 dist 로 확인)·size-limit·SUPPORT·SECURITY·CLAUDE.md. react changeset patch. 첫 배포는 사용자(순서 주의) |
| 2026-10-21 | 런칭 준비물: StackBlitz 예제(examples/vite-starter — npm 1.5.0 으로 빌드·화면·콘솔 확인), llms.txt·llms-full.txt(빌드 때 생성, storybook.yml 경로에 스크립트 추가), README 링크, 초안 3편(비공개 Artifact). CLAUDE.md 에 examples·llms 설명 |
| 2026-10-21 | react 1.6.0·korean-utils 0.1.0 배포 확인(react 가 ^0.1.0 의존), GitHub About·Website·Topics 18개·Discussions 설정 확인, 블로그에 기술 글 2편(테마 공개 대기, KWCAG draft), 인수인계 갱신 |
| 2026-10-21 | StackBlitz 예제를 react ^1.6.0 으로, 통신사 선택(NativeSelect) 추가 — npm 설치·빌드·브라우저 확인 |
| 2026-10-23 | **NVDA + Chrome 점검 완료**(13개 항목 모두 ✅, NumberInput "2석" 중복 없음) → 프로덕션 권장 6/6. BusinessNumberInput·DatePicker 자동 검증 오류를 입력이 멈춘 뒤 status 로 알림(`utils/useDelayedAnnouncement`, Combobox 와 지연 값 공유, 테스트 3·변이 3), 접근성 문서·README·Introduction·SUPPORT·POSITIONING·llms.txt 에 점검 결과·프로덕션 권장 문구, changeset patch. 검증 전체 통과(단위 402·스토리 516·E2E 68) |
| 2026-10-23 | VoiceOver 재확인(Switch 1.6·NativeSelect·입력 순간 오류 알림) ✅. 블로그 `kwcag-automated-testing.md` 에 NVDA 단락을 넣고 공개 준비(draft: false, pubDate 10-23, astro check·build 통과) |
| 2026-10-23 | 런칭 초안 Artifact 갱신: GeekNews 본문에 VoiceOver·NVDA 점검 결과, 기술 글 ① 원문을 블로그 파일과 같게, 확인 상자 정리 |
| 2026-10-23 | react 1.6.1 배포 확인(npm 패키지에 알림 코드·README 문구, Release, Pages llms.txt), main CI 전부 녹색. 블로그 KWCAG 글 공개(Cloudflare 첫 빌드 실패 → 재시도 성공), 블로그 표 스타일 수정. 인수인계를 "런칭 게시만 남음" 으로 정리 |
| 2026-10-23 | 디자인 시스템 객관 점검(코드·토큰·문서 확인): OS 다크 모드·반응형·info 색·공용 Field/CheckboxGroup·한국 키트 확장·컴포넌트 공백·Figma·운영을 "Claude 가 할 일" 9~16번으로 추가, Figma 를 보류에서 올림 |
| 2026-10-23 | 9번 OS 다크 모드: `theme="system"`·`ThemeMode`·`useSystemTheme`·`systemThemeClass`(서버 렌더링 미디어쿼리 + 오버라이드 `<style>`)·`color-scheme`, playground system 시작, 단위 9·SSR 1·E2E `theme.spec.ts` 3(변이 5 — 서버 스냅숏·구독·이스케이프·서버 인라인·미디어쿼리 제거), Introduction 쿠키 저장 가이드·README·llms.txt·CLAUDE.md, changeset minor. 앱 기본 3.75 kB → 한도 4.1 kB(사용자 결정) |
| 2026-10-23 | 10번 반응형 기반: tokens `breakpoint`, react `media`·`Responsive`, Stack 구간별 값, `Grid`·`Container`(shared), 인라인 CSS 변수 + 미디어쿼리 방식(중첩 초기화), 단위 11·스토리 9(play 2)·SSR·E2E 4(변이 3), 문서(Design Tokens·Guides·componentA11y·README·CLAUDE.md), changeset react·tokens minor. 앱 기본 4.05/4.1 kB(여유 50 B) |
| 2026-10-23 | 11번 토큰 보강: `info` 의미 색(tokens 선택 키 + `DefaultSemanticColors`, react 변수·Alert·Badge·Toast·createIntentColors), 스토리(Alert "info 와 브랜드 색")·Theme Builder·문서, MIGRATION-2.0 검토 2건(Alert 기본 info, disabled 투명도). border width·opacity·차트 색은 보류(사용자 결정). vitest 모듈 캐시 함정 CLAUDE.md |
| 2026-10-23 | 12번 공용 폼 필드: `FormField`(shared, render prop + meta 인자)·`CheckboxGroup`(client), rhf 통합 테스트·스토리·SSR·E2E(알림 설정), 문서(componentA11y·Guides·README), changeset minor |
| 2026-10-23 | 13번 한국 키트 1차: korean-utils 주민번호(서식·읽기·구조 검사)·마스킹 5종, react 다시 export + `ResidentNumberInput`(두 칸, 붙여넣기 나눔, 포커스 자동 이동 없음), 테스트·변이 4·E2E·문서(componentA11y·kwcag 7.2.1·README·korean-utils README), korean-utils 한도 1.5 kB(사용자 결정) |
| 2026-10-30 | 코드 안정화 점검: 패키지 구조·CI·의존성·코드 규칙은 문제없음, Combobox IME·서식 입력 form.reset·0507·+82·사업자번호 0000000000 재현, 파일럿 2 버그 2건 미해결 확인. 사용자 결정으로 런칭 보류, 호환성을 깨는 변경은 런칭 전 2.0 으로. `STABILIZATION.md` 작성, 인수인계를 그 문서 기준으로 갱신 |
| 2026-10-30 | S1·S17 Combobox IME: 조합 중 키 무시, 실제 Chrome 에서 `국민은행국` 깨짐 재현 뒤 수정, 단위 2·E2E 1(CDP), playground /interactive 폼에 결제 은행 Combobox 추가, changeset patch |
| 2026-10-31 | S2·S16 form.reset: `useFormReset` 추가, 14개 컴포넌트 수정, Switch 제어 모드 알림 제거, `form-contract.test.tsx`(22개 컴포넌트·RHF reset·누락 검사), E2E 1, playground 다시 입력 버튼, 변이 6, changeset patch |
| 2026-10-31 | S3~S5 korean-utils: 050 번호 11·12자리 서식(12자리 잘림 수정, 점검 문서의 기대값 정정), `+82` 처리와 새 함수 `phoneNumberDigits`, 사업자번호 모두 0 거부, PhoneNumberInput 붙여 넣기 테스트, changeset korean-utils minor·react patch |
| 2026-10-31 | S6~S7: 세로 Stepper 가 설명이 섞여도 원 사이 간격을 맞춤(스토리 play 로 측정), 숨은 SkipLink 그림자 제거(스토리 play), changeset patch. `Vertical` 기준 이미지 갱신 필요 |
| 2026-10-31 | S8 Button·IconButton `asChild`: cloneElement 직접 구현(사용자 결정, Radix Slot 은 +1.18 kB), 앱 기본 한도 4.4 kB, 스토리 2·단위·SSR·E2E, playground 서버 컴포넌트 예, 문서, changeset minor |
| 2026-10-31 | S9~S11: Stepper `loading`, 마스킹 실패 시 모두 가림, `fieldset:disabled` 스타일, Slider 키보드·FileUpload 끌어다 놓기 차단(`useFieldsetDisabled`), 계약 테스트·스토리·문서, changeset minor 2 |
| 2026-10-31 | S18~S19: `pnpm test:coverage`(CI 는 보고만), 전용 테스트 추가, 카카오 우편번호 스크립트 재시도 버그 수정, changeset patch |
| 2026-11-04 | react 1.8.0·korean-utils 0.3.0 배포 확인(PR #27). S12 입력 칸 테두리 2.0 기본값: tokens `border.input`·`inputHover`·`control`, 선택 토큰·`inputBorder.css.ts` 제거, `strongInputBorders` deprecated, 스토리 `InputBorders`(옛 `StrongInputBorders` 기준 이미지 삭제), 변이 2, MIGRATION-2.0·README·kwcag 갱신, changeset react major·tokens minor. 기준 이미지 전체 갱신 필요 |
| 2026-11-04 | S15 비활성 투명도: 0.5 로 통일(Input·Textarea·인증번호 0.6, Pagination·Calendar 0.4 → 0.5), tokens `opacity` + `vars.opacity.disabled`, 가드 테스트(변이 확인), Design Tokens 스토리·MIGRATION-2.0·CLAUDE.md, changeset react major·tokens minor. 해당 비활성 스토리 기준 이미지 갱신 필요 |
| 2026-11-04 | S14 `as` 다형성 타입: `PolymorphicComponent`(as 가 있으면 그 요소·컴포넌트의 props·ref, 아니면 1.x 타입 — 호환 유지), 6개 컴포넌트, 타입 테스트(@ts-expect-error, 변이 2), docgen 결과 동일 확인, changeset react minor. 화면 변화 없음 |
| 2026-11-04 | S13 CSS `@layer bestow`: `styles/cssLayer.ts` 를 tsup(dist/index.css, 소스맵 줄 보정)·Storybook Vite 플러그인이 함께 씀, 스토리 `CssLayer`(!visual)·E2E 3·단위 3, 변이 3(Storybook 플러그인·빌드 감싸기·레이어 순서), 가이드 MDX·README·llms.txt·MIGRATION-2.0, changeset react major |
| 2026-11-04 | PR #28 시각 회귀 실패 원인: 기준 이미지 봇 커밋(`f4841fd`)을 기본 GITHUB_TOKEN 으로 push 해 release.yml·CI 가 돌지 않음 → 버전 PR 이 옛 기준 이미지 위에 남음. visual.yml 이 커밋하는 실행에서 GitHub App 토큰으로 checkout·push 하도록 수정 |
| 2026-11-04 | react·tokens 2.0.0 배포 확인(PR #28, tokens 는 changeset `linked` 로 함께 2.0.0), main CI 녹색. `examples/vite-starter` 를 `^2.0.0` 으로 — npm 설치·tsc·vite build·Chrome 화면 확인 |
| 2026-11-04 | README 비교표를 Vapor UI·HANUI·shadcn/ui·MUI 로 갱신(공식 문서·README·npm 으로 확인, Radix Themes 뺌), "누구를 위해" 행과 공공→HANUI 안내, 특징에 입력 테두리 3:1·CSS 레이어, CSS 약 11 kB. POSITIONING 출처 메모, STABILIZATION 완료 조건 3개 체크 |
| 2026-11-05 | Storybook 문서 페이지 `@layer` 점검: 로컬 빌드 두 벌(레이어 그대로 / `@layer bestow{` → `@media all{`)로 문서 62쪽 × 라이트·다크 124장을 픽셀 비교 — 차이 0(레이어 동작은 바깥 `button{padding:0}` 이 레이어판에서만 이기는 것으로 확인). GeekNews Show 본문 Artifact 를 2.0 기준으로 갱신(스토리 약 290·Button 1.7 kB·CSS 약 11 kB·korean-utils 약 1.4 kB, 주민번호·마스킹·입력 테두리 3:1·OS 다크 모드·CSS 레이어) |
| 2026-11-05 | ResidentNumberInput VoiceOver + Safari 점검 ✅(사용자 — 이름·보안 텍스트·포커스 유지·0.8초 뒤 오류 알림 모두 기대대로). 체크리스트 VO 열·점검 기록, STABILIZATION·인수인계 갱신. NVDA 남음 |
| 2026-11-05 | ResidentNumberInput NVDA 점검은 런칭 뒤로(사용자 결정). CheckboxGroup VoiceOver + Safari 점검 ✅(로컬 운영 빌드 3001 — 묶음 이름·도움말 설명·별표 숨김·모두 끈 뒤 잘못됨 + 오류 설명), 체크리스트 VO 열·점검 기록 |
| 2026-11-05 | 가상 키보드 점검 iOS Safari ✅(사용자 — /orders 주문 등록 Modal, /navigation 아래쪽 Drawer). playground 아래쪽 Drawer 에 편집 가능한 "받는 사람 이메일" 칸 추가(Drawer 에 입력 칸이 있는 화면이 없었음). Android Chrome 남음 |
| 2026-11-05 | 가상 키보드 Android Chrome 확인은 런칭 뒤로(사용자 결정) → STABILIZATION "사람이 확인할 것"·런칭 전 완료 조건 모두 체크. 남은 것은 런칭 게시 |
| 2026-11-06 | GeekNews Show 게시 확인(2026-11-05, https://news.hada.io/topic?id=36655 — Artifact 본문과 같음, Button 1.7 kB). 런칭 전 기준값: GitHub 스타 1·이슈 0·포크 0, npm 주간(10-29~11-04) react 417·korean-utils 219·tokens 219·icons 38(배포·CI 설치 포함) |
| 2026-11-06 | README 크기 숫자를 런칭 글·실측과 맞춤: Button 하나 1.8 → 1.7 kB(루트·react README·POSITIONING), react README CSS 10 → 11 kB, korean-utils README 전체 1.3 → 1.4 kB·maskName 92 → 99 B. npm 페이지 README 는 다음 배포 때 반영 |
| 2026-11-06 | "런칭 뒤 완성도 보강" 17~22번 추가(PasswordInput·SearchInput → Tag/Chip·EmptyState → 한국 키트 2차 → 앱 뼈대·TimePicker → 아이콘 확장 → 폼 검증 가이드). 14번 항목은 17~20번으로 나눠 옮김(TanStack 가이드만 남음), 인수인계에 다음 작업 표시 |
| 2026-11-06 | 17번 PasswordInput·SearchInput: 컴포넌트·문구 키·단위·계약·SSR·스토리·E2E(/signup 비밀번호, /orders 검색), componentA11y·kwcag 7.3.3·Guides "글자 입력"·README, changeset react minor. 변이 7(커서 복원은 불필요해 제거). 새 스토리 기준 이미지는 push 뒤 자동 생성 |
| 2026-11-06 | README 히어로 이미지 다시 찍음 — /signup 운영 빌드(3001)에 비밀번호 칸 포함, 2.0 입력 테두리 반영(2152×1676, 209 → 152 kB) |
| 2026-11-06 | 18번 Tag·TagGroup·EmptyState: 컴포넌트·문구 키·단위·SSR·스토리·E2E(/orders 적용한 조건 태그·표 안 EmptyState), componentA11y·Guides·README, 비활성 투명도 목록에 Tag, changeset react minor. 변이 6, 고대비 일회성 확인. CSS 11.47/12 kB |
| 2026-11-06 | 19번 한국 키트 2차: korean-utils 카드·법인·계좌 함수 + KOREAN_BANKS, react CardNumberInput·CorporateNumberInput·AccountNumberInput(내부 CheckedNumberField 로 BusinessNumberInput 과 공유), 계약·SSR·스토리·E2E, 접근성 문서·README, korean-utils 한도 2.2 kB(사용자 결정), changeset minor 2 |
| 2026-11-06 | 20번: Guides 화면 패턴 "앱 뼈대"·"시간 고르기", 스토리 Guides/앱 뼈대 3개(axe 라이트·다크, play), 목록 패턴을 새 컴포넌트로, 선택 기준 "시간". 링크 index.json 대조. 새 공개 API 없음 |
| 2026-11-06 | 21번 아이콘 91개 추가(148종, Lucide 1.61.0), generate, icons README lucide-react 안내, 루트 README 아이콘 수, changeset icons minor. Icons Gallery 기준 이미지 갱신 필요 |
| 2026-11-06 | 22번 폼 검증 가이드(zod): 화면 패턴 절 + 같은 코드 통합 테스트 3, react devDependencies zod·@hookform/resolvers. 17~22번 완료 |
| 2026-11-06 | 버전 PR #29 배포 확인(react 2.1.0·korean-utils 0.4.0·icons 0.2.0, vite-starter 설치·빌드 통과). 전역 스킬 정리: `.claude/settings.local.json` skillOverrides(off 18·명령만 16) |
| 2026-11-06 | `!visual` 태그 버그: Storybook 이 `!이름` 을 태그 빼기로 처리해 필터가 동작하지 않았음 → `no-visual` 로 변경(스토리 11개·spec·CLAUDE.md), 안 쓰이게 된 기준 이미지 22장 삭제(남은 626장 = 찍을 626장) |
| 2026-11-06 | 6번 A `MultiCombobox`: Combobox 목록 로직을 내부 `useComboboxList`·`ComboboxListbox` 로 나눠 공유, 칸 안 칩·Backspace·칩 삭제 포커스·삭제/최대 개수 지연 알림·maxSelected·값마다 hidden input. 단위 12(변이 5개 확인)·폼 계약·SSR·스토리 9(axe 라이트·다크)·E2E(Chromium·WebKit 5회), 선택 기준·접근성 문서·README, 새 선택 키 2, changeset minor. 새 스토리 기준 이미지 생성 필요 |
