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
  빈칸 6개는 `docs/PILOT-FINDINGS.md` — 다음 순서: 오류 요약(P14-2 와 함께) → VisuallyHidden → DescriptionList. 원래 메모: 실제 제품 화면 하나(예: 관리자 목록 + 상세 + 등록 폼)를 이 시스템만으로 만든다. 가능하면 사용자의 실제 제품,
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

## 진행 기록 보관 (2026-10-14 ~ 10-21)

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
