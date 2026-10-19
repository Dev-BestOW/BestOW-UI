# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 완료된 단계(P1~P10)의 설계 메모는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md),
> 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md).
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 단계가 끝나면 상세 메모는 ROADMAP-HISTORY.md 로 옮기고 여기에는 한 줄 요약만 남긴다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-19 기준)

**마지막 상태**
- npm: **react 1.2.0**(2026-10-19 — DropdownMenu 체크·라디오·하위 메뉴, Tabs 세로, 서버 컴포넌트 7개, NumberInput, RadioGroup 네이티브, 트랙 테두리)
  · tokens 1.0.0 · icons 0.1.2. **버전 PR #21 열림 → react 1.3.0** (Stepper minor, styles.css 33 → 9 kB patch) — 머지 여부를 사용자에게 확인.
- 로컬 = origin/main (`4e06b44`) + **커밋 안 한 변경: FileUpload**(changeset `file-upload`, minor) — PR #21 머지 전에 push 하면 1.3.0 에 합쳐진다.
- 컴포넌트 46개(한국 서비스 키트 8개 포함, 폴더 45 — Input 폴더에 Input·TextField) + 테마·다국어(LocaleProvider).
  **P1~P10 완료**(컴포넌트별 CSS 는 P16 보류). 다음은 프로덕션 준비 P12~P15.
- 번들: react 전체 JS **67.3/80 kB**, 대표 조합(앱 기본 3.4·폼 30.1·오버레이 34.7·한국 키트 30.3 kB, +10% 한도), styles.css **9.4/12 kB**, Button 하나 1.51/2 kB.
- semver 적용 중: 기존 이름·타입·CSS 변수 변경 = major. 이름을 바꿀 땐 새 이름 + 옛 이름 deprecated(minor) 먼저 (CLAUDE.md "작업 규칙").
- 보고할 때 시각 회귀는 "허용치 안 통과" 와 "픽셀 동일" 을 구분한다(RadioGroup 사례).
- **다음 작업:** (사람) `docs/SCREEN-READER-CHECKLIST.md` 로 VO macOS·NVDA 점검 — 남은 선언 기준은 이것 하나. (Claude) DescriptionList(PILOT-FINDINGS #3) → P14-3 테이블 보강. PR #21(1.3.0)이 커졌으니 배포 시점 확인.
  **push 하면 Tokens 스토리 시각 회귀가 실패한다(zIndex 표 값·순서 변경, 의도)** → Visual regression 수동 실행 update. 남은 선언 기준은 스크린리더 수동 점검과 파일럿 두 개.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
4. `pnpm install && pnpm build` 후 아래 단계 중 사용자가 고른 작업부터 진행.

**작업 습관 (지난 세션에서 굳어진 것)**
- 컴포넌트: CLAUDE.md 규칙 + 스토리(열린 상태가 있으면 `play` 로 연 스토리) + 테스트 + `src/client.ts` export(순수 함수는 `shared.ts`)
  + changeset + playground 사용 예 + E2E(키보드 등 실제 브라우저에서만 확인되는 동작) + 접근성 문서(`componentA11y.ts`·필요하면 `kwcag.ts`).
- 핵심 테스트는 구현을 일부러 망가뜨려 실패하는지 확인한다 (**복원은 scratchpad 백업 파일 복사로만 — `git checkout` 금지**).
- 새 Radix 패키지는 올라온 지 24시간 넘은 버전만(pnpm minimumReleaseAge). package.json 을 바꾸기 전에 origin 과 같은지 확인.
- 색을 고를 때는 대비를 계산한다: 글자 4.5:1, 막대·테두리 등 그래픽 3:1. solid 색은 다크에서 트랙 대비가 낮아 막대에는 `text` 색을 쓴다(Progress·Slider).
- 반복되는 브라우저 확인은 `apps/playground/e2e`(포트 3107)에, 일회성 확인만 scratchpad 의 `playwright-core` + 시스템 Chrome 으로.
  사용자 dev 서버(3000)는 건드리지 않는다. 새 E2E 는 `--repeat-each 5` 로 불안정하지 않은지 본다.

## 현재 상태 (2026-10-19)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 1.0.0 | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex, light/dark 의미 색상(primary·neutral·danger·success·warning) |
| `@bestow-ui/icons` | 0.1.2 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 1.1.0 (1.2.0 PR #20 대기, NumberInput 은 그다음) | 아래 46개 + 테마(ThemeProvider·createTheme·createIntentColors·vars·usePortalProps) + 다국어(LocaleProvider·en) + 서식·날짜 함수 |

| 분류 | 컴포넌트 |
|---|---|
| 레이아웃·표시 | Stack, Divider, Card, Typography, Avatar, Badge, Table |
| 동작 | Button(loading), IconButton, Link |
| 폼 | Input, TextField, Textarea, Select, Combobox(clearable), NumberInput, FileUpload, SegmentedControl, Checkbox, RadioGroup, Switch, Slider |
| 피드백 | Alert, Progress, Toast, Spinner, Skeleton |
| 오버레이 | Modal, Drawer, Popover, Tooltip, DropdownMenu(체크·라디오·하위 메뉴) |
| 탐색 | Tabs, Accordion, Pagination, Breadcrumb, SkipLink, Stepper |
| 한국 서비스 키트 | AgreementGroup, VerificationCodeInput, PhoneNumberInput, BusinessNumberInput, AmountInput, AddressInput, Calendar, DatePicker |

빌드: ESM 은 `dist/client.js`("use client" — 컴포넌트·hook) + `dist/shared.js`(지시어 없음 — 서버 컴포넌트에서도 부르는 함수·값), CJS 는 한 파일.
운영: CI(생성물·lint·format·build·size·typecheck·test·스토리 렌더링+axe 라이트·다크·Storybook·playground 빌드·**playground E2E**), PR 번들 크기 코멘트(size.yml),
시각 회귀(visual.yml — 새 스토리 자동, 열린 상태 스토리 포함), changesets + npm Trusted Publishing(OIDC, 버전 PR 은 GitHub App 토큰), CI 러너 ubuntu-24.04 고정.
문서: Storybook(Introduction, Foundations — Design Tokens·Theming·Theme Builder·Icons, Accessibility — KWCAG 2.2 대응·컴포넌트별 키보드·스크린리더, Korean Kit),
README(GitHub)·npm README(영/한), CONTRIBUTING.md, docs/POSITIONING.md, docs/MIGRATION-1.0.md.
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
| P8 | **1.0.0 출시**(2026-10-16): API 감사 → 0.12.0 에서 deprecated → 1.0 에서 제거, `vars` 87개 고정 테스트, 마이그레이션 가이드, 컴포넌트별 접근성 문서, 출시 전 설치 점검으로 버그 5건 수정(서버 컴포넌트 client/shared 분리 등) |
| P10 | playground E2E(Playwright, CI), 열린 상태 스토리를 시각 회귀에 포함(play 완료 대기) |
| P7 | 서버 컴포넌트 엔트리(함수·표시용 컴포넌트 7개), styles.css 디버그 주석 제거(33 → 9 kB), size-limit PR 코멘트 (컴포넌트별 CSS 는 보류) |
| P9 | DropdownMenu 체크·라디오·하위 메뉴, Tabs 세로, Combobox 선택 지우기, SkipLink, SegmentedControl, NumberInput, Stepper, FileUpload |

---

## 다음 단계 — 프로덕션 준비 (2026-10-19 재정리)

**목표:** "공개 서비스에 프로덕션으로 권장" 할 수 있는 수준. 지금은 *사내 도구·작은 새 서비스(데스크톱 위주)에는 사용 가능, 모바일 비중이 큰 공개 서비스·접근성 인증이 필요한 서비스·여러 팀 표준으로는 아직 이름* (2026-10-19 평가).
**원칙:** 기능 추가보다 **검증을 먼저**(P12·P13) 하고, 새 기능은 **파일럿에서 나온 수요로** 고른다(P14). 기존 사용법을 깨는 변경은 2.0 후보로 모은다.

**추천 순서(위에서부터):**
1. P12-1 WebKit·Firefox CI → 2. P12-2 모바일·터치 E2E → 3. P12-4 번들 한도 결정 → 4. P12-3 React 18 CI → 5. P13-2·3 고대비·확대 자동 점검
→ 6. P13-1 스크린리더 수동 점검(사람) → 7. P14-1 파일럿 화면 → 8. P14-2 폼 라이브러리 연동 → 이후 P14 의 기능은 파일럿 결과로 순서 결정. P12-5·P15 는 틈틈이.

### 프로덕션 권장 선언 기준 (모두 충족하면 README·Introduction 에 "프로덕션 권장" 으로 바꾼다)

- [x] Chromium·WebKit·Firefox 에서 스토리 테스트·E2E 통과 (P12-1)
- [x] 모바일(터치·좁은 화면) 주요 시나리오 E2E (P12-2)
- [x] React 18·19 둘 다 CI (P12-3)
- [ ] 주요 컴포넌트 스크린리더 수동 점검 기록 — VoiceOver(macOS·iOS) + NVDA, 가능하면 센스리더 (P13-1)
- [x] 실제 화면 파일럿 1개 이상에서 발견한 문제 해결 (P14-1) — 버그 2개 수정, 빈칸은 P14-2 이후 순서로
- [x] 지원 범위·배포 주기·보안 문의 경로 문서화 (P12-5) — 저장소 설정의 Private vulnerability reporting 켜기는 사용자가 확인

### P12. 신뢰성 기반 — 검증 범위 넓히기 (최우선)

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

### P13. 접근성 실사용 검증

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
- [ ] **P13-4. 입력 테두리 대비 (2.0 후보, 결정 필요)** — border.default(gray300)가 흰 배경과 1.3:1. 모든 입력 화면이 바뀌므로 2.0 에 모으거나,
  `fg.subtle` 수준으로 올리는 옵션 토큰을 minor 로 먼저 제공. 사용자와 결정.

### P14. 파일럿과 빈칸 채우기 (기능)

- [x] **P14-1. 파일럿 화면** (2026-10-19) — playground `/orders`(주문 관리: 검색·필터·정렬·선택·일괄 취소·페이지·상세 Drawer·등록 폼) + `orders.spec.ts`(6개).
  **버그 2개 발견·수정**: Modal 안 Select 목록이 배경막에 가림(z-index dropdown 1000 → 1320), 메뉴에서 연 Drawer 닫을 때 포커스 사라짐(useReturnFocus).
  빈칸 6개는 `docs/PILOT-FINDINGS.md` — 다음 순서: 오류 요약(P14-2 와 함께) → VisuallyHidden → DescriptionList. 원래 메모: 실제 제품 화면 하나(예: 관리자 목록 + 상세 + 등록 폼)를 이 시스템만으로 만든다. 가능하면 사용자의 실제 제품,
  아니면 playground 에 "실전 예제" 페이지로. 빠진 컴포넌트·불편한 API·성능 문제를 이슈로 모아 아래 순서를 정한다.
- [x] **P14-2. 폼 라이브러리 연동** (2026-10-19) — `ErrorSummary`(포커스·focusKey·링크로 칸 이동) + `focusField` + `VisuallyHidden` 추가, AgreementGroup `id`.
  react-hook-form 통합 테스트 3개(변이 2종) + playground `/signup`(실제 브라우저 E2E), 파일럿 폼을 ErrorSummary 로 교체. 방침: group 컴포넌트는 ref 가 포커스 불가 →
  `shouldFocusError: false` + 오류 요약으로 포커스(GOV.UK). 원래 메모: react-hook-form 으로 TextField(register)·Select·DatePicker·NumberInput·FileUpload·AgreementGroup(Controller)
  예시 + 테스트(ref·name·onBlur·에러 표시·포커스 이동). 에러 요약(제출 시 첫 오류로 포커스) 패턴 문서.
- [ ] **P14-3. 데이터 테이블 보강** — Table 에 정렬 머리글(aria-sort)·행 선택(Checkbox)·빈 상태·로딩(Skeleton)·Pagination 연결 예시. 가상화는 수요 시.
- [ ] **P14-4. DateRangePicker** — Calendar 기반 기간 선택(시작·끝, 키보드, `today` 고정).
- [ ] **P14-5. Combobox 다중 선택·비동기 검색** — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림, 긴 목록 가상화.
- [ ] **P14-6. Tag 입력** — 쉼표·Enter 로 태그 추가(P14-5 와 칩 공유).

### P15. 문서·개발자 경험

- [ ] 사용 가이드: 언제 무엇을 쓰나(Select vs Combobox vs SegmentedControl vs RadioGroup, Modal vs Drawer, Tabs vs SegmentedControl).
- [ ] 패턴 페이지: 폼 검증·에러 요약, 단계별 흐름(Stepper + 버튼 + 제목 포커스), 파일 업로드 + 진행률.
- [ ] 지원 범위 표·업그레이드 가이드를 Storybook Introduction 에 연결 (P12-5 와 함께).

### P16. 보류 (수요가 생기면)

- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9 kB 라 우선순위 낮음.
- [ ] Figma 변수 ↔ tokens 동기화, Code Connect (구 P11, Figma MCP 연결돼 있음).
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

---

## 알려진 동작 (고칠 계획 없음 — 문서에 적어 둠)

- Select·DropdownMenu 의 목록 열기는 pointerdown(Radix 기본). KWCAG 문서 6.5.2 에 적어 둠.
- 해결된 것: Slider·Progress 트랙 대비, RadioGroup 화살표 선택 누락(2026-10-19, 진행 기록 참고). 입력 테두리 대비는 P13-4 로 옮김.

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
