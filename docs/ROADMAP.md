# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md) 참고.
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 설계가 문서와 달라지면 이 문서도 함께 고친다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-15 작업 종료 시점)

**마지막 상태**
- npm: react **0.8.2**, tokens 0.8.1, icons 0.1.0. P1~P4 체크박스 모두 완료. 로컬 = origin/main (`eec98b8`).
- **P3-5 동작 확인 완료:** 버전 PR #12 작성자가 `bestow-ui-release[bot]`, CI·Visual regression 이 승인 없이 실행돼 성공.
- PR #13 머지 → react·tokens 0.8.3, icons 0.1.1 배포(npm README 반영). 시각 회귀 기준 이미지 생성됨(`de54b29`).
- 다크 shadow, warning 색 + 다크 hover 대비 수정 커밋됨(`02111c5`).
  다크 그림자·Card·Badge·Typography·Toast 스토리 화면이 바뀌므로 **push 후 Visual regression 이 실패한다 → 확인 후 update 로 기준 이미지 갱신.**
- Alert·IconButton 커밋됨(`368b6d5`). **커밋 전: Progress, 번들 한도 상향, Drawer, recipe tree-shaking 수정, Link·Breadcrumb**
  (changeset `progress`, `drawer`, `pure-recipes`, `link-breadcrumb`) → `e63b3b1` 로 커밋됨. 시각 회귀 자동화 `33a3eeb`.
- Table(`240c926`)·Slider(`b17ebf8`) 커밋됨(push 전). **커밋 전: Combobox** (changeset `combobox`).
- 번들: react JS 56.4/65 kB, **styles.css 26.8/28 kB** — 다음 컴포넌트 전에 한도 검토(또는 CSS 분리). 새 스토리 + Tooltip/DropdownMenu/Icons 스토리 화면 변경
  → push 후 Visual regression update 로 기준 이미지 갱신.
- 번들 한도 상향(사용자 결정, 2026-10-15): react 전체 JS 55→65 kB, styles.css 23→28 kB (현재 51.0 / 22.3). Button 하나 3 kB 는 유지.
  styles.css 는 모든 컴포넌트 CSS 를 담은 한 파일이라 컴포넌트가 늘면 커진다. 컴포넌트별 CSS 분리는 필요해지면 검토(백로그).

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다 (Claude 는 커밋·push 하지 않음).
2. 열린 버전 PR 이 있는지 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open`
   — 있으면 머지 여부를 사용자에게 알린다. 머지 후 npm 반영은 수 분 걸릴 수 있다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
4. `pnpm install && pnpm build` 후 아래 **다음 작업**부터 진행.

**다음 작업:** 아래 "P5. 다음 후보" 에서 우선순위대로 (사용자와 정한다).
P2 컴포넌트를 더 만들 때: Radix 패키지는 올라온 지 24시간 넘은 버전을 고른다(pnpm minimumReleaseAge). `package.json` 을 바꾸기 전에
origin 보다 뒤처져 있으면 먼저 `git pull` 을 요청한다(버전 PR 머지분과 충돌 방지).
상호작용 테스트는 `@testing-library/user-event`(`userEvent.setup()`)로 쓰고, 핵심 테스트는 구현을 일부러 망가뜨려 실패하는지 확인한다
(**복원은 scratchpad 백업 파일 복사로만 — `git checkout` 금지**, 커밋 안 된 변경까지 되돌린다).
스크린리더 전용 텍스트는 `src/styles/visuallyHidden.css.ts`, 애니메이션은 `src/styles/animations.css.ts`(`spin`, `shimmer`, `accordionDown/Up` 등)를 재사용한다.
각 컴포넌트는 CLAUDE.md "컴포넌트 작성 규칙" + 스토리 + 테스트 + `src/index.ts` export + changeset(react minor) +
playground 에 사용 예 추가 후 브라우저 점검. 끝나면 이 섹션과 체크박스·진행 기록을 갱신한다.

## 현재 상태 (2026-10-15)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 0.8.1 | palette, space, radius, font, shadow, duration, zIndex, light/dark 의미 색상 |
| `@bestow-ui/icons` | 0.1.0 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 0.8.2 | ThemeProvider(light/dark + 브랜드 테마 `createTheme`/`overrides`), Button(`loading`), Typography, Stack, Input, TextField, Checkbox, Modal, Select, Tooltip, Toast, Switch, RadioGroup, Textarea, Spinner, Badge, Card, Divider, Avatar, Skeleton, Tabs, DropdownMenu, Popover, Accordion, Pagination |

운영: CI(생성물 확인·lint·format·빌드·size·타입·테스트·스토리 렌더링+axe(라이트·다크)·Storybook·playground 빌드), 시각 회귀(visual.yml), changesets + npm Trusted Publishing(OIDC) 자동 배포,
Storybook → https://dev-bestow.github.io/BestOW-UI/ , 예제 앱 → https://dev-bestow.github.io/BestOW-UI/playground/

---

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



- playground 브라우저 점검은 아직 일회성 스크립트(scratchpad)다. 반복 실행 가능한 E2E(playground 대상 Playwright)로 만들지는 필요해지면 검토.
- react 번들 전체에 `"use client"` 가 붙어 있다. 서버 전용으로 쓸 수 있는 컴포넌트(Typography, Stack)를 별도 엔트리로 분리할지는 필요해지면 검토.
- CI 러너는 `ubuntu-24.04` 고정. Ubuntu 26 으로 올리는 건 Playwright 지원 확인 후 (24.04 러너 지원 종료 공지가 나오기 전에).
- 아이콘을 더 늘릴 때: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round)으로 그린다.
- 0.x 를 벗어나 1.0.0 을 낼 시점(공개 API 안정화) 판단 필요.
- styles.css 컴포넌트별 분리 — 지금은 쓰지 않는 컴포넌트 CSS 까지 한 파일로 받는다. 사용법(`styles.css` import)이 바뀌는 큰 작업.

---

## 진행 기록

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
