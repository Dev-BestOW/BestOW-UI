# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 완료된 단계(P1~P16)의 설계 메모·진행 기록 전체는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md),
> 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md), 2.0 에 모으는 변경은 [`MIGRATION-2.0.md`](MIGRATION-2.0.md).
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 단계가 끝나면 상세 메모는 ROADMAP-HISTORY.md 로 옮기고 여기에는 한 줄 요약만 남긴다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-21 마무리 기준)

**마지막 상태**
- npm: **react 1.5.0**(2026-10-21) · tokens 1.3.0 · icons 0.1.3. 열린 버전 PR 없음, 배포 대기 changeset 없음.
- origin/main = `e4cfa48`(버전 PR #23 머지). CI·browsers(WebKit·Firefox)·React 18·시각 회귀 모두 녹색, WebKit flaky 0.
- 컴포넌트 약 50개(폴더 49) + 테마·다국어·서식 함수, 아이콘 57종. **P1~P16 완료**.
- 프로덕션 권장 선언 기준 **5/6** — 남은 것은 스크린리더 점검 중 **NVDA**(VoiceOver macOS 는 2026-10-21 완료).
- 번들(2026-10-21 측정, minify + brotli): react 전체 JS **69.1/80 kB** · Button 하나 1.51/2 · 앱 기본 3.37/3.7 · 폼 세트 30.1/33 ·
  오버레이 세트 34.8/38 · 한국 키트 30.2/33.5 · styles.css 9.9/12 · tokens 1.27/1.5 kB.
  **조합 한도는 여유가 약 10% 뿐** — 큰 기능(Combobox 다중 선택 등)을 넣기 전에 어느 조합에 들어가는지 보고 필요하면 한도를 사용자와 정한다.
- semver 적용 중: 기존 이름·타입·CSS 변수 변경 = major. 이름을 바꿀 땐 새 이름 + 옛 이름 deprecated(minor) 먼저 (CLAUDE.md "작업 규칙").
  기본 화면을 바꾸는 개선은 **선택 토큰 + 2.0 기본값**(`MIGRATION-2.0.md`) — 입력 칸·체크 컨트롤 테두리가 이 방식.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
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

## 다음 플랜 (2026-10-21 정리 — 위에서부터 추천 순서)

### 사람이 할 일

- [ ] **NVDA 스크린리더 점검** (Windows) — 체크리스트 13개 항목. **NumberInput "2석" 이 두 번 들리는지 꼭 확인**(VoiceOver 때문에 추가한 알림).
  끝나면 프로덕션 권장 선언 기준 6/6.
- [ ] (가능하면) iOS VoiceOver·센스리더 점검 — 같은 체크리스트, 3·4번째 열.
- [ ] (선택) 실제 기기 확인: 가상 키보드가 Modal·Drawer 입력을 가리는지(iOS Safari·Android Chrome).
- [ ] 수요 확인: Combobox 다중 선택·비동기 검색, Tag 입력, 한국 공휴일 도움 함수 — 실제로 필요한 서비스가 있으면 알려 주기.

### Claude 가 할 일

1. **NVDA 점검 반영** — 발견한 문제 수정(테스트·변이 확인), `kwcag.ts`·`componentA11y.ts`·체크리스트 기록.
   기준 6/6 이면 README(루트·npm)·Storybook Introduction·POSITIONING 의 표현을 "프로덕션 권장" 으로 바꾸고 changeset(patch).
2. **접근성 개선 후보** (VoiceOver 점검 중 메모, 요건은 이미 충족)
   - BusinessNumberInput: 10자리를 채워 오류가 생기는 순간 알림(지금은 다시 들어가야 설명으로 들림) — Combobox 처럼 항상 있는 영역 + 늦춰서.
   - 같은 패턴(입력 중 자동 검증 오류)이 있는 곳 점검: PhoneNumberInput·VerificationCodeInput 만료 알림은 이미 있음.
3. **Combobox 다중 선택·비동기 검색** (구 P14-5, 수요 확인 후) — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림(`role=status`), 긴 목록 가상화는 따로.
   폼 세트 조합(30.1/33 kB)에 영향 → 별도 컴포넌트(`MultiCombobox` 등)로 나눌지 먼저 판단.
4. **Tag 입력** (구 P14-6) — 쉼표·Enter 로 추가, 3번과 칩 공유.
5. **의존성 정비 2차** — 막힌 것이 풀리면: TypeScript 7(typescript-eslint 가 `<6.1`), ESLint 10(jsx-a11y 가 9 까지).
   jsdom 30 은 Node ≥22.22.2 필요(로컬 Node 를 올리면). CI 러너 Ubuntu 26 전환은 Playwright `-resolute` 이미지(1.64.1 부터 있음)로 모든 workflow 함께 검토.
6. **2.0 준비** — 후보가 쌓이면 `MIGRATION-2.0.md` 에 추가(지금: 입력 칸·체크 컨트롤 테두리 기본값 1개, deprecated 이름 없음). 출시 시점은 사용자와 결정.

### 보류 (수요가 생기면)

- [ ] 한국 공휴일 도움 함수(`koreanHolidays(year)` 등) — 음력·대체·임시공휴일 때문에 해마다 갱신 필요. 지금은 `isHoliday` 로 받는다.
- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9.9 kB 라 우선순위 낮음.
- [ ] Figma 변수 ↔ tokens 동기화, Code Connect (구 P11, Figma MCP 연결돼 있음).
- [ ] DateRangePicker 를 한 달력에서 끌어 고르는 방식.
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

### 프로덕션 권장 선언 기준

- [x] Chromium·WebKit·Firefox 에서 스토리 테스트·E2E 통과 (P12-1)
- [x] 모바일(터치·좁은 화면) 주요 시나리오 E2E (P12-2)
- [x] React 18·19 둘 다 CI (P12-3)
- [ ] 주요 컴포넌트 스크린리더 수동 점검 기록 — VoiceOver(macOS) ✅ 2026-10-21 · **NVDA 남음** · 가능하면 iOS VoiceOver·센스리더 (P13-1 · P16-5)
- [x] 실제 화면 파일럿에서 발견한 문제 해결 (P14-1 — 버그 2개 수정, 빈칸 6개 모두 해결: [`PILOT-FINDINGS.md`](PILOT-FINDINGS.md))
- [x] 지원 범위·배포 주기·보안 문의 경로 문서화 (P12-5, 2026-10-21 정책 확정·비공개 취약점 신고 켜짐)

---

## 현재 상태 (2026-10-21)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 1.3.0 | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex(overlay < modal < dropdown < toast < tooltip), light/dark 의미 색상 |
| `@bestow-ui/icons` | 0.1.3 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 1.5.0 | 아래 컴포넌트 + 테마(ThemeProvider·createTheme·createIntentColors·strongInputBorders·vars·usePortalProps, 선택 토큰 border.input·inputHover·control) + 다국어(LocaleProvider·en) + 서식·날짜 함수·focusField |

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃·표시 | Stack, Divider, Card, Typography, VisuallyHidden, Avatar, Badge, DescriptionList, Table(+ TableEmpty·TableSkeleton·useTableSelection) |
| 동작 | Button(loading), IconButton, Link |
| 폼 | Input, TextField, Textarea, Select, Combobox(clearable), NumberInput, FileUpload, SegmentedControl, Checkbox, RadioGroup(네이티브), Switch, Slider |
| 피드백 | Alert, ErrorSummary, Progress, Toast, Spinner, Skeleton |
| 오버레이 | Modal, Drawer, Popover, Tooltip, DropdownMenu(체크·라디오·하위 메뉴) |
| 탐색 | Tabs(가로·세로), Accordion, Pagination, Breadcrumb, SkipLink, Stepper |
| 한국 서비스 키트 | AgreementGroup, VerificationCodeInput, PhoneNumberInput, BusinessNumberInput, AmountInput, AddressInput, Calendar, DatePicker, DateRangePicker(+ dateRangePresets) |

빌드: ESM 은 `dist/client.js`("use client" — 컴포넌트·hook) + `dist/shared.js`(서버 컴포넌트에서도 쓰는 함수·값·표시용 컴포넌트 9개), CJS 는 한 파일. tsup 9.
운영: CI(생성물·lint·format·build·size·typecheck·test·스토리 렌더링+axe 라이트·다크·Storybook·playground 빌드·E2E), browsers job(WebKit·Firefox 스토리·E2E),
react18 job, PR 번들 크기 코멘트(size.yml), 시각 회귀(visual.yml, Chromium, Playwright 1.64.1 이미지), changesets + npm Trusted Publishing(OIDC), CI 러너 ubuntu-24.04 고정.
테스트: vitest 5(단위 410·스토리 500, 라이트·다크 axe), E2E 67(키보드·모바일 Pixel 7·iPhone 15·고대비·확대/리플로·파일럿 /orders·react-hook-form /signup·portal 테마·axe, hydration 대기).
문서: Storybook(Introduction, Foundations, Accessibility — KWCAG 2.2·컴포넌트별 키보드·스크린리더, Guides — 언제 무엇을 쓰나·화면 패턴, Korean Kit),
README·npm README(한국어), CONTRIBUTING.md, SUPPORT.md, SECURITY.md, docs/POSITIONING.md·MIGRATION-1.0.md·MIGRATION-2.0.md(초안)·SCREEN-READER-CHECKLIST.md·PILOT-FINDINGS.md.
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
| P13 | 고대비(forced-colors) 대응·E2E, 320px 리플로·글자 간격·글꼴 2배 E2E, 글자 크기 rem, 스크린리더 체크리스트 |
| P14 | 파일럿 `/orders`(버그 2개 수정), ErrorSummary·focusField·VisuallyHidden·DescriptionList, react-hook-form `/signup`, TableEmpty·TableSkeleton·useTableSelection, DateRangePicker |
| P15 | Storybook Guides(언제 무엇을 쓰나·화면 패턴), 문서 한국어 전환 |
| P16 | WebKit CI 불안정 수정(hydration 대기), 의존성 1차(vitest 5·tsup 9·Playwright 1.64.1), 입력 칸·체크 컨트롤 테두리 선택 토큰 + `strongInputBorders`, MIGRATION-2.0 초안, 지원 정책 확정, **VoiceOver 점검**(알림 4건 수정) — react 1.4.0·1.5.0 |

---

## 알려진 동작 (고칠 계획 없음 — 문서에 적어 둠)

- Select·DropdownMenu 의 목록 열기는 pointerdown(Radix 기본). KWCAG 문서 6.5.2 에 적어 둠.
- 공휴일은 라이브러리에 내장하지 않는다 — Calendar·DatePicker·DateRangePicker 에 `isHoliday` 로 넘긴다(보류: 도움 함수).
- Toast 알림 영역 단축키는 F8(Radix 기본) — 맥 키보드는 fn + F8.
- 해결된 것: Slider·Progress 트랙 대비, RadioGroup 화살표 선택 누락(2026-10-19), 입력 칸·체크 컨트롤 테두리 대비(선택 토큰, 2.0 기본값 — P16-3).

---

## 진행 기록

> 2026-10-14 ~ 10-21 의 기록 전체는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md) 맨 아래 "진행 기록 보관".

| 날짜 | 내용 |
|---|---|
| 2026-10-21 | react 1.5.0 배포 확인(npm·Release·설치본에 border.control·알림 지연 코드). 로드맵 정리: 10/20~21 작업을 HISTORY P16 으로, 진행 기록 99줄을 HISTORY 로 보관, 다음 플랜을 NVDA 점검 → 개선 후보 → 수요 기반 기능 → 의존성 2차 → 2.0 준비 순으로 |
