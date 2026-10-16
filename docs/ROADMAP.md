# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 완료된 단계(P1~P5)의 설계 메모는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md),
> 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md).
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 단계가 끝나면 상세 메모는 ROADMAP-HISTORY.md 로 옮기고 여기에는 한 줄 요약만 남긴다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-16 작업 종료 시점)

**마지막 상태**
- npm: **react 1.0.0 · tokens 1.0.0**(2026-10-16 정식 출시), icons 0.1.2. 열린 버전 PR 없음.
  배포본을 npm 에서 새로 설치해 확인함(ESM·CJS·SSR, TS 5.4 CJS 타입, 서버 컴포넌트용 client/shared 분리, 색 대비 보정).
- 컴포넌트 40개(한국 서비스 키트 8개 포함) + 테마·다국어(LocaleProvider). **P1~P6, P8(1.0) 완료.**
- main 의 CI·Visual regression·Release·Storybook 배포 모두 성공(`a433bdd`, 로컬 = origin/main).
- 번들: react 전체 JS **63.7/70 kB**(2026-10-16 65 → 70 kB 상향), styles.css 30.2/36 kB, Button 하나 1.51/2 kB.
- **1.0.0 출시 완료(2026-10-16)** — 옛 이름 4개 제거 + changeset major(react·tokens → 1.0.0, icons 는 0.x 유지).
  출시 전 점검(패킹한 tarball 을 새 프로젝트에 설치·React 18/19·TS 5.4/5.9·ESM/CJS·Next 서버 컴포넌트·브라우저)에서 5건을 찾아 고침
  — changeset `cjs-types-and-ssr-fixes`(진행 기록 참고).
  이제부터 semver: 기존 이름·타입·CSS 변수 변경 = major (CLAUDE.md "배포" 참고).
- **그다음 작업:** P9 보강·새 컴포넌트 (P10 완료 2026-10-16 · P7 남은 항목은 1.0 이후 minor 로).

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
4. `pnpm install && pnpm build` 후 아래 단계 중 사용자가 고른 작업부터 진행.

**작업 습관 (지난 세션에서 굳어진 것)**
- 컴포넌트: CLAUDE.md 규칙 + 스토리(열린 상태가 있으면 `play` 로 연 스토리) + 테스트 + `src/index.ts` export + changeset + playground 사용 예 + 브라우저 점검.
- 핵심 테스트는 구현을 일부러 망가뜨려 실패하는지 확인한다 (**복원은 scratchpad 백업 파일 복사로만 — `git checkout` 금지**).
- 새 Radix 패키지는 올라온 지 24시간 넘은 버전만(pnpm minimumReleaseAge). package.json 을 바꾸기 전에 origin 과 같은지 확인.
- 색을 고를 때는 대비를 계산한다: 글자 4.5:1, 막대·테두리 등 그래픽 3:1. solid 색은 다크에서 트랙 대비가 낮아 막대에는 `text` 색을 쓴다(Progress·Slider).
- 브라우저 점검은 scratchpad 의 `playwright-core` + 시스템 Chrome. 사용자 dev 서버(3000)는 건드리지 않고 `next start -p 3107` 등 다른 포트를 쓴다.

## 현재 상태 (2026-10-16)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 0.9.0 | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex, light/dark 의미 색상(primary·neutral·danger·success·warning) |
| `@bestow-ui/icons` | 0.1.1 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 0.11.0 (0.12.0 버전 PR 대기) | 아래 40개 + 테마(ThemeProvider·createTheme·createIntentColors·vars·usePortalProps) + 다국어(LocaleProvider·en) |

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃·표시 | Stack, Divider, Card, Typography, Avatar, Badge, Table |
| 동작 | Button(loading), IconButton, Link |
| 폼 | Input, TextField, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Slider |
| 피드백 | Alert, Progress, Toast, Spinner, Skeleton |
| 오버레이 | Modal, Drawer, Popover, Tooltip, DropdownMenu |
| 탐색 | Tabs, Accordion, Pagination, Breadcrumb |
| 한국 서비스 키트 | AgreementGroup, VerificationCodeInput, PhoneNumberInput, BusinessNumberInput, AmountInput, AddressInput, Calendar, DatePicker |

운영: CI(생성물·lint·format·build·size·typecheck·test·스토리 렌더링+axe 라이트·다크·Storybook·playground 빌드), 시각 회귀(visual.yml, 새 스토리 자동),
changesets + npm Trusted Publishing(OIDC, 버전 PR 은 GitHub App 토큰), CI 러너 ubuntu-24.04 고정.
문서: Storybook(Introduction, Foundations — Design Tokens·Theming·Theme Builder·Icons, Accessibility — KWCAG 2.2 대응, Korean Kit),
README(GitHub)·npm README(영/한), CONTRIBUTING.md, docs/POSITIONING.md.
Storybook → https://dev-bestow.github.io/BestOW-UI/ , 예제 앱 → https://dev-bestow.github.io/BestOW-UI/playground/

### 완료한 단계 (상세는 ROADMAP-HISTORY.md)

| 단계 | 내용 |
|---|---|
| P1 | 브랜드 테마(`createTheme`/`overrides`, 고정 CSS 변수 `--bestow-*`), Next.js playground |
| P2 | 폼·표시·탐색·오버레이 컴포넌트 1차 (Switch ~ Pagination) |
| P3 | ESLint/Prettier, 스토리 axe(라이트·다크), size-limit, 시각 회귀, 버전 PR CI(GitHub App) |
| P4 | Storybook Introduction·Design Tokens, CONTRIBUTING.md |
| P5 | npm README/LICENSE, 러너 고정, 다크 shadow, warning 색, Alert·IconButton·Progress·Drawer·Link·Breadcrumb·Table·Slider·Combobox, recipe tree-shaking 수정, 시각 회귀 자동화 |
| P6 | 차별화: 테마 빌더, 한국 서비스 키트 8종(약관·인증번호·전화·사업자번호·금액·주소·달력·날짜), KWCAG 2.2 대응 근거 문서, LocaleProvider·한글 줄바꿈, README 메시지. CSS 배포 방식 결정 |

---

## 다음 단계 (순서는 사용자와 확정)

**추천 순서:** (P8·P10 완료) P9 보강·새 컴포넌트.
P7 의 남은 항목(컴포넌트별 CSS, 서버 컴포넌트 엔트리)은 기존 사용법을 깨지 않는 추가라 1.0 이후에 해도 된다.

### P7. 번들·성능

- [x] **CSS 배포 방식 결정** (2026-10-15, 사용자 결정: **A 유지** — `styles.css` 하나. 측정: 테마·공통 약 15%, 컴포넌트당 2~5%,
  컴포넌트 10개 앱이면 필요한 CSS 는 절반 정도.) 컴포넌트별 선택 import(B, Mantine 방식 `styles/base.css` + `styles/<컴포넌트>.css`)는
  기존 사용법을 깨지 않는 추가라 **1.0 이후 필요할 때 minor 로**. JS 가 CSS 를 자동 import(C)는 breaking·환경 문제로 하지 않음.
- [ ] (나중에) **컴포넌트별 CSS 선택 import (B)** — 공통(base) + 컴포넌트별 CSS, 컴포넌트 간 CSS 의존(Combobox → Select·Input,
  Drawer → IconButton 등)을 문서화. 빌드는 vanilla-extract 출력에서 컴포넌트별로 나누는 후처리 필요.
- [~] **서버 컴포넌트 엔트리 분리** — 2026-10-16 함수·값은 `dist/shared.js`(지시어 없음)로 분리해 서버에서 호출 가능(1.0 점검 중 버그로 발견).
  남은 것: Typography·Stack 처럼 hook 없는 **컴포넌트**도 지금은 클라이언트 경계 — 필요하면 1.0 이후 minor 로.
- [ ] size-limit 결과를 PR 코멘트로 (size-limit-action).

### P8. 1.0.0 준비 — 공개 API 안정화 ✅ (2026-10-16 출시)

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

### P9. 기존 컴포넌트 보강 · 새 컴포넌트

- [ ] DropdownMenu `CheckboxItem`/`RadioItem`/하위 메뉴, Tabs 세로 방향.
- [ ] Combobox 다중 선택·비동기 검색·긴 목록 가상화, **선택 지우기**(지금은 한 번 고르면 빈 값으로 되돌릴 수 없음 — 1.0 점검에서 확인).
- [ ] 새 후보: NumberInput, SegmentedControl(Toggle group), FileUpload, Stepper, Tag 입력. (수요가 생기면 — DatePicker 는 P6 에서 완료)

### P10. 테스트·운영

- [x] **playground E2E 정식화** (2026-10-16) — `apps/playground/e2e`(Playwright, CI "E2E (playground)" 단계, 실패 시 리포트 업로드).
  17개: 페이지별 콘솔·hydration 오류 0 + axe(WCAG 2.2 AA, 라이트·다크+브랜드), portal 테마(DropdownMenu·Popover·Drawer·Select·Modal),
  키보드(DropdownMenu·Modal 포커스 가둠/복귀·Combobox·Select·Tabs·서식 입력), 서버 컴포넌트 함수. 5회 반복 안정성·변이(portal·hydration) 확인.
- [x] 시각 회귀에 열린 상태 스토리 추가 (2026-10-16) — Select·DropdownMenu·Popover·Modal "열린 상태" 새로, Drawer(defaultOpen→play)·
  DatePicker·AddressInput 열린 스토리를 시각 회귀에 포함. visual 스펙이 play 완료를 기다린다. 새 기준 이미지는 main push 때 봇이 커밋.

### P11. (선택) 디자인 도구 연동

- [ ] Figma 변수 ↔ `@bestow-ui/tokens` 동기화, Figma Code Connect 로 컴포넌트 매핑. (이 환경에 Figma MCP 가 연결돼 있음)

---

## 백로그 / 알려진 이슈

- CI 러너는 `ubuntu-24.04` 고정. Ubuntu 26 으로 올리는 건 Playwright 지원 확인 후 (24.04 러너 지원 종료 공지가 나오기 전에).
- 아이콘을 더 늘릴 때: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round)으로 그린다.
- 라이트 모드 Slider·Progress 트랙(bg.muted)은 흰 배경과 대비가 낮다(값을 알리는 막대·손잡이는 3:1 이상). 필요하면 트랙 색 토큰 검토.
- 건너뛰기 링크(SkipLink) 컴포넌트 없음 — KWCAG 6.4.1 이 "사용자 몫" 으로 남아 있다. 만들면 KWCAG 문서도 갱신.
- Select·DropdownMenu 의 목록 열기는 pointerdown(Radix 기본). KWCAG 문서 6.5.2 에 적어 둠.
- 한국 키트 입력(Phone/Business/Amount)과 DatePicker 는 TextField props 를 Omit 으로 물려받아 Storybook 자동 문서에 상속 prop(label·error 등)이
  보이지 않는다(react-docgen 한계, CLAUDE.md 함정). 1.0 문서 작업 때 주요 prop 직접 선언 검토.

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
