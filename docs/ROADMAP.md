# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md) 참고.
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 설계가 문서와 달라지면 이 문서도 함께 고친다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-15 작업 종료 시점)

**마지막 상태**
- 버전 PR #7 머지 완료 → npm 에 react **0.5.0** 배포됨 (Spinner, Button `loading`).
- **Badge, Card** 구현 완료, **커밋 전 (로컬 변경)**. changeset `badge.md`, `card.md`(react minor) 포함 — 커밋·push 하면 다음 버전 PR(react 0.6.0)이 만들어진다.
- 작업 종료 시점에 로컬 main 이 origin 보다 2커밋 뒤처져 있었다(버전 PR 머지분). 사용자가 `git pull` 후 커밋 예정.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다 (Claude 는 커밋·push 하지 않음).
2. 열린 버전 PR 이 있는지 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open`
   — 있으면 머지 여부를 사용자에게 알린다. 머지 후 npm 반영은 수 분 걸릴 수 있다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
4. `pnpm install && pnpm build` 후 아래 **다음 작업**부터 진행.

**다음 작업: P2-2 표시 컴포넌트 계속** — Divider → Avatar → Skeleton. (Spinner·Button `loading`·Badge·Card 는 완료)
스크린리더 전용 텍스트는 `src/styles/visuallyHidden.css.ts` 를 재사용한다.
각 컴포넌트는 CLAUDE.md "컴포넌트 작성 규칙" + 스토리 + 테스트 + `src/index.ts` export + changeset(react minor) +
playground 에 사용 예 추가 후 브라우저 점검. 끝나면 이 섹션과 체크박스·진행 기록을 갱신한다.

## 현재 상태 (2026-10-15)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 0.2.0 | palette, space, radius, font, shadow, duration, zIndex, light/dark 의미 색상 |
| `@bestow-ui/icons` | 0.1.0 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 0.5.0 (다음: Badge, Card — 커밋 대기) | ThemeProvider(light/dark + 브랜드 테마 `createTheme`/`overrides`), Button(`loading`), Typography, Stack, Input, TextField, Checkbox, Modal, Select, Tooltip, Toast, Switch, RadioGroup, Textarea, Spinner |

운영: CI(생성물 확인·빌드·타입·테스트·Storybook·playground 빌드), changesets + npm Trusted Publishing(OIDC) 자동 배포,
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

**P2-2. 표시**
- [x] **Spinner** — `LoaderIcon` + 회전 애니메이션(reducedMotion 시 느리게). `role="status"` + 숨김 텍스트 `label`(기본 "로딩 중", 빈 문자열이면 장식용).
  이어서 **Button `loading` prop** — startIcon 자리에 스피너, `aria-busy`·`aria-disabled`, 클릭·폼 제출 차단 (`disabled` 를 쓰지 않아 포커스 유지).
- [x] **Badge** — `variant`(solid/soft/outline) × `color`(primary/neutral/danger/success), `size`(sm/md/lg), `startIcon`. 기본 soft/neutral, pill 모양.
  12개 조합 모두 라이트·다크에서 대비 4.5 이상 확인.
- [x] **Card** — `variant`(outline/elevated/soft), `padding`(none/sm/md/lg), `as`. 영역은 named export `CardHeader`/`CardBody`/`CardFooter`
  (`ModalClose` 처럼 점 표기 대신 개별 export). elevated 는 다크에서 그림자가 안 보여 테두리를 함께 둔다.
- [ ] **Divider** — 가로/세로, `role="separator"`.
- [ ] **Avatar** — `@radix-ui/react-avatar`. 이미지 실패 시 이니셜/아이콘 fallback, `size`.
- [ ] **Skeleton** — 로딩 자리 표시, shimmer 애니메이션(reducedMotion 시 정지).

**P2-3. 탐색·오버레이**
- [ ] **Tabs** — `@radix-ui/react-tabs`. `variant`(line/soft).
- [ ] **DropdownMenu** — `@radix-ui/react-dropdown-menu`. 항목 아이콘, 구분선, 위험 항목(danger), 단축키 표시.
- [ ] **Popover** — `@radix-ui/react-popover`. Tooltip 과 같은 위치 옵션.
- [ ] **Accordion** — `@radix-ui/react-accordion`. single/multiple.
- [ ] **Pagination** — 직접 구현. `page`, `totalPages`, `onPageChange`, 생략 부호(…), `aria-current="page"`.

토큰이 더 필요하면(예: `success` 외 `warning` 색) tokens 에 추가하고 light/dark 둘 다 정의한다.

---

## P3. 품질 자동화

- [ ] **접근성 검사를 CI 에서 실행** — `.storybook/preview.tsx` 에 `a11y: { test: 'error' }` 는 설정돼 있지만 실행하는 러너가 없다.
  `@storybook/addon-vitest`(Vitest 브라우저 모드 + Playwright) 로 모든 스토리를 렌더링하고 axe 위반 시 실패시키는 job 추가.
  CI 에서 Playwright Chromium 설치 필요.
- [ ] **ESLint + Prettier** — flat config, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`. CI 단계 추가.
  기존 코드 스타일: 작은따옴표, 세미콜론, trailing comma, 120자 정도 줄 길이.
- [ ] **번들 크기 검사** — `size-limit` 로 `@bestow-ui/react` 전체와 아이콘 1개 import 크기 상한 설정, PR 에서 확인.
- [ ] **시각 회귀 테스트** — Chromatic(외부 서비스, 프로젝트 토큰 시크릿 필요) 또는 Playwright 스크린샷 비교. **어느 쪽으로 할지 사용자에게 먼저 확인.**
- [ ] **버전 PR 의 CI ❌ 정리** — changesets 봇이 만든 PR 에서 CI 가 job 없이 실패로 기록된다(코드 문제 아님).
  `ci.yml` 의 `pull_request` 에서 `changeset-release/**` 브랜치를 제외하거나, GitHub App 토큰으로 PR 을 만들어 CI 가 정상 실행되게 한다.

---

## P4. 문서

- [ ] **Storybook 시작하기 페이지** (`Introduction.mdx`) — 설치, `styles.css` import, ThemeProvider/ToastProvider 설정, 다크모드, 아이콘 사용법, (P1-1 이후) 테마 커스터마이징.
- [ ] **디자인 토큰 페이지** — Colors(light/dark 나란히), Typography 스케일, Spacing, Radius, Shadow, zIndex. `@bestow-ui/tokens` 값을 읽어 자동으로 그린다.
- [ ] **기여 가이드** — 컴포넌트 추가 체크리스트, changeset 작성법, 아이콘 추가 방법 (CLAUDE.md 내용을 사람용으로 정리).

---

## 백로그 / 알려진 이슈

- 브라우저 점검은 playground 에서 자동화 스크립트로 한 번 했다(스크린샷 확인 포함). 반복 실행 가능한 E2E 테스트로 만드는 것은 P3 에서 검토.
- react 번들 전체에 `"use client"` 가 붙어 있다. 서버 전용으로 쓸 수 있는 컴포넌트(Typography, Stack)를 별도 엔트리로 분리할지는 필요해지면 검토.
- `@bestow-ui/icons@0.1.0` 은 수동 배포라 provenance·GitHub Release 가 없다 (다음 버전부터 자동).
- GitHub `ubuntu-latest` 가 2026-10-19 부터 Ubuntu 26 으로 바뀐다는 안내가 있다. CI 가 깨지면 확인.
- 아이콘을 더 늘릴 때: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round)으로 그린다.
- 0.x 를 벗어나 1.0.0 을 낼 시점(공개 API 안정화) 판단 필요.
- `shadow` 토큰이 라이트·다크 공통이라 다크 모드에서 그림자가 거의 안 보인다(Card elevated 가 outline 과 비슷해 보임). 모드별 shadow 토큰 분리 검토.

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
