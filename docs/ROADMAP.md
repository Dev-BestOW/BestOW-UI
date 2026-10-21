# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 완료된 단계(P1~P15)의 설계 메모는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md),
> 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md).
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 단계가 끝나면 상세 메모는 ROADMAP-HISTORY.md 로 옮기고 여기에는 한 줄 요약만 남긴다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-21 마무리 기준)

**마지막 상태**
- npm: **react 1.4.0**(2026-10-21 — DateRangePicker·strongInputBorders) · tokens 1.3.0 · icons 0.1.3. 열린 버전 PR 없음.
- origin/main = `eb7535d`(♿️ VoiceOver 점검 수정). 다음 배포 대기 changeset 4개: `strong-control-borders`(minor) +
  `combobox-no-results-announce`·`number-input-announce-value`·`file-upload-announcements`(patch) → 버전 PR 머지 시 **react 1.5.0**.
- **다음에 할 일 1순위: Windows NVDA 점검**(사용자가 Windows PC 준비되면). 방법은 아래 "스크린리더 점검 진행 방식".
- 컴포넌트 약 50개(폴더 49) + 테마·다국어·서식 함수, 아이콘 57종. **P1~P15 완료**(남은 것은 아래 "다음 플랜").
- 프로덕션 권장 선언 기준 **5/6 충족** — 남은 것은 스크린리더 수동 점검 중 **NVDA**(VoiceOver macOS 는 2026-10-21 완료).
- 번들(2026-10-19 측정, minify + brotli): react 전체 JS **68.9/80 kB** · Button 하나 1.51/2 · 앱 기본 3.37/3.7 · 폼 세트 30.1/33 ·
  오버레이 세트 34.8/38 · 한국 키트 30.2/33.5 · styles.css 9.9/12 · 아이콘 하나 0.37/0.5 · tokens 1.27/1.5 kB.
  **조합 한도는 여유가 약 10% 뿐** — 큰 기능(P14-5 등)을 넣기 전에 어느 조합에 들어가는지 보고 필요하면 한도를 사용자와 정한다.
- CI(main, `e49af92`): CI·browsers(WebKit·Firefox)·React 18·시각 회귀 모두 녹색, WebKit flaky 0 (2026-10-20 hydration 대기 수정 후).
- semver 적용 중: 기존 이름·타입·CSS 변수 변경 = major. 이름을 바꿀 땐 새 이름 + 옛 이름 deprecated(minor) 먼저 (CLAUDE.md "작업 규칙").
- 보고할 때 시각 회귀는 "허용치 안 통과" 와 "픽셀 동일" 을 구분한다(RadioGroup 사례).

**스크린리더 점검 진행 방식 (2026-10-21 VoiceOver 에서 잘 된 방식)**
- 로컬 playground 를 운영 빌드로 띄운다: `pnpm build && pnpm build-playground` → `pnpm --filter @bestow-ui/playground exec next start -p 3001`
  (백그라운드, 3000·3107 과 겹치지 않게). 고칠 때마다 다시 빌드·재시작하고 사용자에게 새로고침을 부탁한다 — push 없이 바로 재확인.
  Windows PC 에서 점검하면 맥의 서버에 같은 네트워크로 접속하거나(`next start -H 0.0.0.0`), 배포된 Pages(push 후)를 쓴다.
- 체크리스트 항목 하나씩: 누를 키·기대 문구를 안내 → 사용자가 ✅/⚠️/❌ 와 들린 문장을 알려 줌 → 문제는 바로 원인 확인(실제 브라우저로 DOM 재현 먼저)·수정·테스트(변이)·재확인.
- 결과 기록: `docs/SCREEN-READER-CHECKLIST.md` 의 해당 열(NVDA 는 2번째 열), 끝나면 "점검 기록" 표에 한 줄.
- 배운 것: live region 은 **처음부터 있어야** 하고, **입력·포커스 이동과 같은 순간**에 바꾸면 VoiceOver 가 버린다(늦춰서 넣기).
  Safari 는 텍스트 입력 spinbutton 의 aria-valuetext 를 읽지 않는다. NVDA 에서는 반대로 **두 번 읽히는지**(NumberInput) 확인할 것.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
4. `pnpm install && pnpm build` 후 아래 "다음 플랜" 중 사용자가 고른 작업부터 진행.

**작업 습관 (지난 세션에서 굳어진 것)**
- 컴포넌트: CLAUDE.md 규칙 + 스토리(열린 상태가 있으면 `play` 로 연 스토리) + 테스트 + `src/client.ts` export(순수 함수는 `shared.ts`)
  + changeset + playground 사용 예 + E2E(키보드 등 실제 브라우저에서만 확인되는 동작) + 접근성 문서(`componentA11y.ts`·필요하면 `kwcag.ts`)
  + README 컴포넌트 표(루트·`packages/react/README.md`) + 필요하면 `Guides`(언제 무엇을 쓰나·화면 패턴).
- 핵심 테스트는 구현을 일부러 망가뜨려 실패하는지 확인한다 (**복원은 scratchpad 백업 파일 복사로만 — `git checkout` 금지**).
- 새 Radix 패키지는 올라온 지 24시간 넘은 버전만(pnpm minimumReleaseAge). package.json 을 바꾸기 전에 origin 과 같은지 확인.
- 색을 고를 때는 대비를 계산한다: 글자 4.5:1, 막대·테두리 등 그래픽 3:1. 고대비 모드는 `styles/forcedColors.css.ts` 로 시스템 색 지정.
- 반복되는 브라우저 확인은 `apps/playground/e2e`(포트 3107)에, 일회성 확인만 scratchpad 의 `playwright-core` + 시스템 Chrome 으로.
  사용자 dev 서버(3000)는 건드리지 않는다. 새 E2E 는 `--repeat-each 5` 로 불안정하지 않은지 본다. Firefox 는 로컬 실행 불가(macOS 27) → CI 로 확인.
- 문서는 한국어(npm README 는 영어 한 줄 소개만). `en` 문구 묶음은 기능이라 유지.

## 다음 플랜 (2026-10-21 갱신 — 위에서부터 추천 순서)

### 사람이 할 일

- [x] **PR #22 머지** → react **1.4.0** 배포 확인(2026-10-21 — DateRangePicker·strongInputBorders).
- [ ] **스크린리더 수동 점검** — [`SCREEN-READER-CHECKLIST.md`](SCREEN-READER-CHECKLIST.md) 로 최소 VoiceOver(macOS) + NVDA, 가능하면 iOS VoiceOver·센스리더.
  **VoiceOver(macOS) 완료 2026-10-21 — 13개 모두 ✅(4건 수정 후).** 남은 것: **NVDA**(Windows — NumberInput "2석" 이 두 번 들리는지 꼭 확인), 가능하면 iOS VoiceOver·센스리더.
  배포된 playground 에서 13개 항목, 결과 칸·기록 표를 채운다. **이게 끝나면 프로덕션 권장 선언 기준 6/6.**
- [x] GitHub **Private vulnerability reporting 켜기** (2026-10-21 확인 — API `enabled: true`, Security 탭에 "Report a vulnerability").
- [x] **P13-4 결정** — ② 옵션 토큰으로 (2026-10-20 결정·구현, 2.0 에서 기본값으로).
- [x] **Checkbox·RadioGroup·Switch 테두리 결정** (2026-10-21) — 입력 칸처럼 선택 토큰 `color.border.control` + `strongInputBorders` 에 포함, 2.0 기본값.
- [x] SUPPORT.md 정책 확정 (2026-10-21) — 배포는 **준비되면**(주 1회 → 실제 방식에 맞춤), 이전 major 보안·심각한 버그 수정 **6개월**.
- (선택) 실제 기기 확인: 가상 키보드가 Modal·Drawer 입력을 가리는지(iOS Safari·Android Chrome).

### Claude 가 할 일

1. **스크린리더 점검 결과 반영** — VoiceOver(macOS) 반영 완료(2026-10-21, 4건 수정). **NVDA 점검 후** 같은 방식으로 반영,
   기준 6/6 이면 README(루트·npm)·Storybook Introduction 의 표현을 "프로덕션 권장" 으로 바꾸고 changeset(patch).
   개선 후보(점검 중 메모): 사업자번호 오류를 10자리를 채우는 순간 알림, 한국 공휴일 도움 함수(해마다 갱신 필요 — 수요 확인).
2. ~~**P13-4**~~ ✅ 2026-10-20 — 선택 토큰 `color.border.input`·`inputHover`(기본값 없음 → 화면 그대로) + `strongInputBorders`. changeset `strong-input-borders`(minor).
   시각 회귀 기준 이미지 갱신 완료(봇 `b998dea`·`2ea3e39`), **react 1.4.0 으로 배포**.
3. **P14-5 Combobox 다중 선택·비동기 검색** (수요 확인 후) — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림(`role=status`), 긴 목록 가상화는 따로.
   폼 세트 조합(30.1/33 kB)에 영향 → 별도 컴포넌트(`MultiCombobox` 등)로 나눌지 먼저 판단.
4. **P14-6 Tag 입력** — 쉼표·Enter 로 추가, P14-5 와 칩 공유.
5. **의존성 정비** — 2026-10-20 1차 완료(Playwright 1.64.1·Next 16.4.2·React 19.3.1·vitest 5·tsup 9, Radix·Storybook 은 이미 최신).
   남은 것: **막힘** TypeScript 7(typescript-eslint 가 `<6.1`)·ESLint 10(jsx-a11y 가 9 까지), **보류** jsdom 30(Node ≥22.22.2 필요 — 이 Mac 22.19),
   @types/node 는 Node 22 에 맞춰 22 유지. CI 러너 Ubuntu 26 전환은 Playwright `-resolute` 이미지가 있으니(1.64.1) 모든 workflow 함께 검토.
6. **2.0 후보 모으기** — `docs/MIGRATION-2.0.md` 초안 작성(입력 칸·체크 컨트롤 테두리 기본값, 검토 중 없음). deprecated 이름이 생기면 표에 추가.

### 보류 (수요가 생기면, 구 P16)

- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9.9 kB 라 우선순위 낮음.
- [ ] Figma 변수 ↔ tokens 동기화, Code Connect (구 P11, Figma MCP 연결돼 있음).
- [ ] DateRangePicker 를 한 달력에서 끌어 고르는 방식.
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

### 프로덕션 권장 선언 기준

- [x] Chromium·WebKit·Firefox 에서 스토리 테스트·E2E 통과 (P12-1)
- [x] 모바일(터치·좁은 화면) 주요 시나리오 E2E (P12-2)
- [x] React 18·19 둘 다 CI (P12-3)
- [ ] 주요 컴포넌트 스크린리더 수동 점검 기록 — VoiceOver(macOS·iOS) + NVDA, 가능하면 센스리더 (P13-1)
- [x] 실제 화면 파일럿에서 발견한 문제 해결 (P14-1 — 버그 2개 수정, 빈칸 6개 모두 해결: [`PILOT-FINDINGS.md`](PILOT-FINDINGS.md))
- [x] 지원 범위·배포 주기·보안 문의 경로 문서화 (P12-5)

---

## 현재 상태 (2026-10-19)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 1.3.0 | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex(overlay < modal < dropdown < toast < tooltip), light/dark 의미 색상 |
| `@bestow-ui/icons` | 0.1.3 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 1.4.0 | 아래 컴포넌트 + 테마(ThemeProvider·createTheme·createIntentColors·strongInputBorders·vars·usePortalProps) + 다국어(LocaleProvider·en) + 서식·날짜 함수·focusField |

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃·표시 | Stack, Divider, Card, Typography, VisuallyHidden, Avatar, Badge, DescriptionList, Table(+ TableEmpty·TableSkeleton·useTableSelection) |
| 동작 | Button(loading), IconButton, Link |
| 폼 | Input, TextField, Textarea, Select, Combobox(clearable), NumberInput, FileUpload, SegmentedControl, Checkbox, RadioGroup(네이티브), Switch, Slider |
| 피드백 | Alert, ErrorSummary, Progress, Toast, Spinner, Skeleton |
| 오버레이 | Modal, Drawer, Popover, Tooltip, DropdownMenu(체크·라디오·하위 메뉴) |
| 탐색 | Tabs(가로·세로), Accordion, Pagination, Breadcrumb, SkipLink, Stepper |
| 한국 서비스 키트 | AgreementGroup, VerificationCodeInput, PhoneNumberInput, BusinessNumberInput, AmountInput, AddressInput, Calendar, DatePicker, DateRangePicker(+ dateRangePresets) |

빌드: ESM 은 `dist/client.js`("use client" — 컴포넌트·hook) + `dist/shared.js`(서버 컴포넌트에서도 쓰는 함수·값·표시용 컴포넌트 9개), CJS 는 한 파일.
운영: CI(생성물·lint·format·build·size·typecheck·test·스토리 렌더링+axe 라이트·다크·Storybook·playground 빌드·E2E), browsers job(WebKit·Firefox 스토리·E2E),
react18 job, PR 번들 크기 코멘트(size.yml), 시각 회귀(visual.yml, Chromium), changesets + npm Trusted Publishing(OIDC), CI 러너 ubuntu-24.04 고정.
E2E: 키보드·모바일(Pixel 7·iPhone 15)·고대비·확대/리플로·파일럿(/orders)·react-hook-form(/signup)·portal 테마·axe.
문서: Storybook(Introduction, Foundations, Accessibility — KWCAG 2.2·컴포넌트별 키보드·스크린리더, Guides — 언제 무엇을 쓰나·화면 패턴, Korean Kit),
README·npm README(한국어), CONTRIBUTING.md, SUPPORT.md, SECURITY.md, docs/POSITIONING.md·MIGRATION-1.0.md·SCREEN-READER-CHECKLIST.md·PILOT-FINDINGS.md.
Storybook → https://dev-bestow.github.io/BestOW-UI/ , 예제 앱 → https://dev-bestow.github.io/BestOW-UI/playground/

### 완료한 단계 (상세는 ROADMAP-HISTORY.md)

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
| P13 | 고대비(forced-colors) 대응·E2E, 320px 리플로·글자 간격·글꼴 2배 E2E, 글자 크기 rem, 스크린리더 체크리스트(실행은 사람) |
| P14 | 파일럿 `/orders`(버그 2개 수정), ErrorSummary·focusField·VisuallyHidden·DescriptionList, react-hook-form `/signup`, TableEmpty·TableSkeleton·useTableSelection, DateRangePicker |
| P15 | Storybook Guides(언제 무엇을 쓰나·화면 패턴), 문서 한국어 전환 |

---

## 알려진 동작 (고칠 계획 없음 — 문서에 적어 둠)

- Select·DropdownMenu 의 목록 열기는 pointerdown(Radix 기본). KWCAG 문서 6.5.2 에 적어 둠.
- 해결된 것: Slider·Progress 트랙 대비, RadioGroup 화살표 선택 누락(2026-10-19, 진행 기록 참고). 입력 테두리 대비는 "다음 플랜" P13-4.

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
