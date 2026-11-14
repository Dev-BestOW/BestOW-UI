# BestOW UI 로드맵

> 다음 작업 세션(사람 또는 Claude)이 **지금 상태와 남은 일**을 바로 알 수 있게 쓴다. 짧게 유지한다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md).
> 끝난 단계(P1~P16·코드 안정화·사용자 유치 플랜 23~30 상세)와 옛 진행 기록은 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md), 끝난 설계·파일럿 기록은 [`archive/`](archive/).
>
> **갱신 규칙:** 작업을 끝내면 "남은 일" 을 고치고 맨 아래 "진행 기록" 에 한 줄 추가한다. 끝난 항목의 상세 메모는 ROADMAP-HISTORY 로 옮기고 여기에는 남기지 않는다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-11-14 기준)

**지금 상태**
- npm: react 2.1.0 · tokens 2.0.0 · korean-utils 0.4.0 · icons 0.2.0. 열린 버전 PR #30(MultiCombobox, korean-utils 문서 메타) — **11/19(목) 정기 배포일에 머지**.
- **배포 주기: 격주 목요일**(11/19 → 12/3 → 12/17, SUPPORT.md). 보안·심각한 버그만 바로 patch. 작업을 끝내면 다음 배포일을 함께 알린다.
- 방향(2026-11-11 결정): 기능보다 **발견 → 신뢰 → 첫 사용** 경로. 새 컴포넌트는 외부 요청이 생길 때까지 미룬다. 사용자 유치 플랜 23~30번은 Claude 몫을 모두 끝냈다(상세는 ROADMAP-HISTORY).
- 기준값(2026-11-14): 스타 4 · 포크 0 · 외부 이슈 0 · npm 평일 react 12/일. 방문 통계(Cloudflare Web Analytics)는 11/14 부터 집계 — **일주일 쌓이면 읽히는 문서·유입 경로를 보고 다음 작업을 고른다.**
- 블로그(astro-blog): 글 3편이 content-queue 에서 예약 발행 대기. 예약 워크플로가 9/13 부터 꺼져 있었다(60일 무활동) — 사용자가 켜면 월~수 09:00 발행.

**세션 시작 체크리스트**
1. `git status` / `git fetch` 로 로컬이 origin/main 과 같은지 확인. 뒤처져 있으면 사용자에게 `git pull` 을 요청한다
   (저장소에 `pull.rebase=true`, `rebase.autoStash=true` 설정됨. Claude 는 커밋·push 하지 않음 — 이 세션 셸은 GitHub 인증이 없어 push 불가).
2. 열린 버전 PR 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/pulls?state=open` — 있으면 머지 여부를 사용자에게 알린다.
3. 배포 버전 확인: `curl -s https://registry.npmjs.org/@bestow-ui%2freact | python3 -c "import json,sys;print(json.load(sys.stdin)['dist-tags'])"`
3-1. 기준값: `node scripts/stats.mjs` → 출력 한 줄을 "진행 기록" 에 붙인다(29번).
4. main CI 확인: `curl -s https://api.github.com/repos/Dev-BestOW/BestOW-UI/commits/<sha>/check-runs` — 실패면 annotations 로 원인부터.
5. `pnpm install && pnpm build` 후 아래 "남은 일" 중 사용자가 고른 작업부터 진행.

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

## 남은 일

### 사람이 할 일
- [ ] **bestow-ui.com 마무리**: Cloudflare Web Analytics 에 bestow-ui.com 방문이 잡히는지 확인(안 잡히면 사이트 추가·토큰 교체), (선택) 조직 루트 저장소 `dev-bestow.github.io` 이동 대상·robots.txt 를 새 주소로. 도메인 자동 갱신 유지. (Search Console·네이버 소유확인·sitemap 제출은 2026-11-14 끝남)
- [ ] 블로그 예약 발행 워크플로 켜기 — 일요일 09:00 이후 ~ 월요일 09:00 전에 Actions › Daily post › Enable workflow(Run 은 누르지 않기).
- [ ] 11/19 버전 PR #30 머지(첫 정기 배포).
- [ ] good first issue 4개 등록(초안: 알리기 준비물 Artifact https://claude.ai/artifact/LvPgoSsmGKHjLd34FP789u) — 블로그 글이 나가기 전에.
- [ ] velog 게시 · 요즘IT 기고 제안 · 발표 지원(CFP 공고 때) · 접근성 커뮤니티 글 — 같은 Artifact.
- [ ] Context7 등록(AI 도구가 문서를 찾는 경로).
- [ ] Figma: 요금제 올릴지(다크 모드·라이브러리 게시·페이지 제한), Community 공개 여부 — `docs/FIGMA.md`.
- [ ] 스크린리더·기기: ResidentNumberInput NVDA, (가능하면) iOS VoiceOver·센스리더, (선택) Android Chrome 가상 키보드 — `SCREEN-READER-CHECKLIST.md`.
- [ ] 이 라이브러리로 만든 실제 서비스가 생기면 알려 주기 — README "사용 사례".

### Claude 가 확인할 것 (push·배포 뒤)
- [ ] 배포된 `/ai/bestow-ui.md`·`/ai/bestow-ui.mdc` 열림(27번).
- [ ] `npx create-next-app --example …/examples/next-starter` 실제 설치(26번), shadcn-starter StackBlitz 링크(25번).
- [ ] 11/19 배포 뒤 npm 검색 `사업자등록번호`·`전화번호` 순위 다시 조회(24번).
- [ ] TanStack Table 가이드 스토리의 시각 회귀 기준 이미지가 main push 때 자동 생성됐는지.
- [ ] 방문 통계 일주일 뒤 읽히는 문서·유입 경로 정리 → 다음 작업 제안, 29번 ✅.

### Claude 가 할 일
- **다음 작업: SEO·GEO 계획 [`SEO-GEO-PLAN.md`](SEO-GEO-PLAN.md)** — 사용자가 계획서 검토 뒤 시작. Task 1(컴포넌트 문서 틀 + PhoneNumberInput 한 쪽, 사용자 확인)부터 순서대로, 작업마다 커밋 확인 후 다음.
- **28번 Figma 정리 2건**(MCP 호출 한도가 풀리면): Checkbox `icon` 프레임 12개 흰 배경 지우기, Korean Kit 페이지 변수 연결 감사 — `docs/FIGMA.md`.
- 28번 다음 컴포넌트(요청 시): Select·RadioGroup·Switch·AgreementGroup·Alert·Modal, 아이콘 컴포넌트(Button 아이콘 자리).
- **외부 요청이 생기면:** Tag 입력(MultiCombobox 와 칩 공유), Combobox 비동기 검색.
- **막혀 있거나 시점을 기다림:** 의존성 2차(TypeScript 7 — typescript-eslint 지원 대기, ESLint 10 — jsx-a11y 지원 대기, jsdom 30 — Node ≥22.22.2, CI Ubuntu 26 — Playwright `-resolute` 이미지와 모든 workflow 함께).
  3.0 준비 — 후보가 쌓이면 `MIGRATION-3.0.md`(지금 후보: `strongInputBorders` 제거). 출시 시점은 사용자와 결정.
- 번들 조합 한도는 여유가 약 10% — 큰 기능 전에 어느 조합에 들어가는지 보고 필요하면 한도를 사용자와 정한다.

### 보류 (수요가 생기면)

- [ ] **shadcn/ui 레지스트리로 제공** (2026-10-21 외부 추천, 보류) — `POSITIONING.md` "하지 않을 것"(Tailwind 전용 복사형)과 충돌하고,
  컴포넌트가 vanilla-extract `.css.ts`·`vars` 에 기대어 복사해 가는 쪽이 빌드 플러그인을 따로 설정해야 한다(도입 장벽이 오히려 커짐).
  하려면 포지셔닝 변경을 사용자가 먼저 결정. korean-utils 반응을 본 뒤 headless 부분부터 검토.
- [ ] 한국 공휴일 도움 함수(`koreanHolidays(year)` 등) — 음력·대체·임시공휴일 때문에 해마다 갱신 필요. 지금은 `isHoliday` 로 받는다. korean-utils 에도 넣지 않음.
- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9.9 kB 라 우선순위 낮음.
- [ ] DateRangePicker 를 한 달력에서 끌어 고르는 방식.
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

## 알려진 동작 (고칠 계획 없음 — 문서에 적어 둠)

- Select·DropdownMenu 의 목록 열기는 pointerdown(Radix 기본). KWCAG 문서 6.5.2 에 적어 둠.
- 공휴일은 라이브러리에 내장하지 않는다 — Calendar·DatePicker·DateRangePicker 에 `isHoliday` 로 넘긴다(보류: 도움 함수).
- Toast 알림 영역 단축키는 F8(Radix 기본) — 맥 키보드는 fn + F8.
- 해결된 것: Slider·Progress 트랙 대비, RadioGroup 화살표 선택 누락(2026-10-19), 입력 칸·체크 컨트롤 테두리 대비(선택 토큰, 2.0 기본값 — P16-3).

---

## 진행 기록

> 2026-11-10 까지의 기록은 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md) 맨 아래 "진행 기록 보관".

| 날짜 | 내용 |
|---|---|
| 2026-11-11 | 사용자 유치 점검(런칭 6일 뒤): 스타 4·포크 0·외부 이슈 0·Discussions 0, npm react 평소 하루 15~30, 웹 검색 결과 없음, npm 검색 `kwcag` 3위뿐, Pages 루트 제목 `storybook - Storybook`·OG·sitemap 없음. "사용자 유치 플랜" 23~30번 추가(홈페이지 메타·랜딩 → korean-utils 입구 → shadcn 과 함께 쓰기 → 템플릿 → AI 도구 → Figma → 측정 → 노출), 새 컴포넌트는 외부 요청 때까지 미룸. 열린 버전 PR #30 |
| 2026-11-11 | 23번 A 홈페이지 메타: Storybook 제목(`title` 프리셋)·manager-head.html(description·canonical·OG·트위터 카드)·og.png(1200×630, `scripts/generate-og.mjs`)·sitemap.xml, playground OG 메타데이터. robots.txt 는 프로젝트 Pages 에서 읽히지 않아 제외. 빌드 결과물 index.html 로 태그 확인. 공개 API 변화 없음(changeset 없음), 시각 회귀 영향 없음 |
| 2026-11-11 | 24번 korean-utils 함수 문서: 소개 사이트 `/korean-utils/` 목록 + 10쪽(직접 입력·코드·알아 둘 점·React 컴포넌트 링크, 계좌 쪽 은행 코드 표), 쪽별 메타, `app/sitemap.ts`, E2E(코드 예시 결과 주석 계산 비교 포함). korean-utils description·keywords·homepage·README(patch) |
| 2026-11-11 | CI WebKit site E2E "다크 모드 토글" 간헐 실패 수정: 토글 직후 색 전환(120ms) 중에 axe 가 돌아 중간색 대비 위반(전환 중 실행 시 WebKit 1·Chromium 19개 → 기다리면 0 으로 재현). site·playground `axeViolations` 가 끝나는 애니메이션을 기다린다 |
| 2026-11-11 | Dependabot 보안 경고 2건(moderate): glob 13(GHSA-3g3m-2fjr-6pw4, Storybook docgen 플러그인)·minimatch 10(GHSA-g3hv-75wg-m249, typescript-eslint) — 상위 최신판도 옛 버전이라 `pnpm-workspace.yaml` 끝 overrides 로 glob 14·minimatch 11. 개발 도구만이라 changeset 없음. ci.yml react18 job 은 그 블록에 줄만 덧붙이게 |
| 2026-11-11 | 23번 B 소개 사이트: `apps/site`(Next.js 정적 export, Pages 루트) — 한국 키트 데모·대표색 바꾸기·소개·시작 방법, Storybook 을 /storybook/ 으로 옮기고 옛 `?path=`·iframe.html 주소 넘겨주기, assemble-pages.sh, CI build-site·site E2E 14(변이 2), 문서 링크 /storybook/ 으로. 공개 API 변화 없음(changeset 없음), 스토리·기준 이미지 영향 없음 |
| 2026-11-11 | 23번 배포 확인 + main CI site E2E 수정: 대표색 SegmentedControl 을 데모에서만 줄바꿈 허용(CI Linux 글꼴로 320px 에서 335px), fixture 가 hydration 과 /storybook/ 도착 중 먼저 오는 것을 기다림(WebKit 은 넘겨주기 전에 goto 가 끝남), Firefox bounce tracker·넘겨주기 중 끊긴 스크립트 경고 무시. 스타 4·포크 0·외부 이슈 0, 버전 PR #30 열림 |
| 2026-11-13 | 사용자 할 일 완료(Search Console·네이버 sitemap 제출 등), main CI 녹색, 스타 4·포크 0·외부 이슈 0, 버전 PR #30 열림. 24번 글 초안 1편: astro-blog `business-number-checksum.md`(draft) — 몫 항의 역할·검출률(한 자리 100%·이웃 바꿈 89%) 계산으로 확인, 블로그 check 0 errors·build 통과 |
| 2026-11-13 | 24번 글 초안 2편: astro-blog `sms-otp-autofill-react.md`(draft) — VerificationCodeInput 구조 기반(입력창 하나·one-time-code·WebOTP·자동 제출·만료 알림), Storybook 링크 index.json 으로 확인, 블로그 check 0 errors·build 통과 |
| 2026-11-13 | 24번 글 초안 3편: astro-blog `agreement-checkbox-a11y.md`(draft) — AgreementGroup 구조 기반, KWCAG 번호(5.4.1·6.4.3)는 kwcag.ts 로 확인, "스크린리더로 찾았다" 는 기록과 다른 서술은 고침. 블로그 check 0 errors·build 통과 |
| 2026-11-13 | 24번 글 3편 astro-blog content-queue 예약(001~003). 25번: `examples/shadcn-starter` + Guides MDX(shadcn 변수 → overrides, 대비 모자란 변수는 잇지 않음) + README·llms.txt 링크. 검증 전부 통과(lint·format·build·size·typecheck·test 615·stories 666·build 3종·E2E 87+24) |
| 2026-11-14 | 26번 Next.js 템플릿 `examples/next-starter`(3단계 가입·로그인·내 정보, react-hook-form + zod, 스키마를 서버 액션과 공유, 단계마다 폼) + README·Patterns·llms.txt 연결. 브라우저 흐름 16개·axe 라이트·다크 0 |
| 2026-11-14 | 27번 AI 코딩 도구 규칙 파일: `docs/ai/bestow-ui.md` + 빌드 때 Pages `/ai/`(md·Cursor mdc)로, 규칙 속 이름을 export 와 대조(변이 확인), README·npm README·llms.txt 안내 |
| 2026-11-14 | 28번 Figma 1단계: 새 파일 BestOW UI Library 에 tokens → 변수 133·글자 스타일 9·그림자 6·Foundations 견본, 생성 스크립트 `scripts/generate-figma-tokens.mjs`·`docs/FIGMA.md`. Starter 요금제라 다크 모드·Code Connect 불가 |
| 2026-11-14 | 28번 Figma 2단계: 컴포넌트 세트 Button·TextField·Checkbox·Badge·VerificationCodeInput + 한국 입력 3(TextField 인스턴스), 컴포넌트 글자 스타일 4(생성 스크립트에도). Starter 페이지 3개·MCP 호출 한도로 정리 2건 남음 |
| 2026-11-14 | 기준값: 스타 4 · 포크 0 · 이슈 열림 0/닫힘 0 · Discussions ?(GITHUB_TOKEN 없음) · npm 평일 중앙값(최근 28일, 배포일·다음날 제외) react 12/일(12일) · korean-utils 5/일(14일) · tokens 5/일(15일) · icons 4/일(17일) — 같은 기간 react 합계 2,001(대부분 배포·CI) |
| 2026-11-14 | 29번 측정: `scripts/stats.mjs`(기준값 한 줄), Cloudflare Web Analytics(사용자 결정) — 배포 빌드에만 토큰으로 beacon, site E2E 로 테스트 빌드에 없는지 확인, SECURITY.md 공개. 토큰 등록은 사용자 |
| 2026-11-14 | 30번: 배포 주기 격주 목요일(SUPPORT.md·CLAUDE.md), 알리기 준비물 Artifact(velog·요즘IT·발표 제안서·커뮤니티), 블로그 예약 발행 워크플로 9/13 이후 멈춤 발견 |
| 2026-11-14 | 16번: CONTRIBUTING "처음 기여하기" + README 링크, good first issue 초안 4개(커버리지로 찾은 실제 빈 곳 — presets 분기 2·en 2·Tag 14, vite-starter 영어 전환) |
| 2026-11-14 | 14번: Guides "TanStack Table 과 함께 쓰기" — 예시 스토리(정렬·검색·페이지·선택·결과 없음, play 테스트·변이 확인)와 문서(연결 표·접근성·서버 모드). 새 스토리 1개 시각 회귀 기준 이미지 생성 필요(main push 때 자동) |
| 2026-11-14 | 문서 정리: STABILIZATION 삭제(요약은 HISTORY), 파일럿·설계 기록 docs/archive, ROADMAP 503 → 약 120줄(옛 계획 절 403줄·11-10 까지 진행 기록 52줄은 HISTORY 에 그대로 보관). 미완료 항목 모두 "남은 일" 로, 깨진 링크 0 |
| 2026-11-14 | 도메인 bestow-ui.com(사용자 결정, 후보는 RDAP 로 조회): 옛 주소 68곳 교체(README·package.json homepage·문서·llms.txt·OG·canonical), 소개 사이트 basePath 기본 ''·E2E 를 루트 구조로, `robots.txt`(sitemap 위치) 추가. 4개 패키지 patch changeset. 연결 순서는 "사람이 할 일" |
| 2026-11-14 | bestow-ui.com 연결 확인: DNS(A·AAAA·www CNAME·인증 TXT), HTTPS, 16쪽 200(사이트·Storybook·playground·robots·sitemap·llms·ai·확인 파일), canonical·OG·sitemap 새 주소, 옛 `?path=`·`iframe.html?id=` 가 Chrome 에서 새 도메인 Storybook 으로, http·www → https 루트 |
| 2026-11-14 | 네이버 소유 확인 파일(사이트 루트, prettier 제외, E2E). SEO·GEO 조사(Storybook 문서는 같은 제목·canonical 에 JS 렌더라 검색에 안 잡힘) → 계획서 `SEO-GEO-PLAN.md`(한국 키트 13쪽 정적 문서·JSON-LD·비교 쪽·GEO 점검) |
| 2026-11-14 | 사용자: bestow-ui.com 을 Google Search Console·네이버 서치어드바이저에 등록하고 sitemap 제출 |
