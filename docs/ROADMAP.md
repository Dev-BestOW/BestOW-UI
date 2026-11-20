# BestOW UI 로드맵

> 다음 작업 세션(사람 또는 Claude)이 **지금 상태와 남은 일**을 바로 알 수 있게 쓴다. 짧게 유지한다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md).
> 끝난 단계(P1~P16·코드 안정화·사용자 유치 플랜 23~30 상세)와 옛 진행 기록은 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md), 끝난 설계·파일럿 기록은 [`archive/`](archive/).
>
> **갱신 규칙:** 작업을 끝내면 "남은 일" 을 고치고 맨 아래 "진행 기록" 에 한 줄 추가한다. 끝난 항목의 상세 메모는 ROADMAP-HISTORY 로 옮기고 여기에는 남기지 않는다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-11-18 기준)

**지금 상태**
- npm: react 2.2.0 · tokens 2.2.0(react 와 linked) · korean-utils 0.5.0 · icons 0.2.1 (2026-11-19 첫 정기 배포). 다음 배포 12/3.
- **배포 주기: 격주 목요일**(11/19 → 12/3 → 12/17, SUPPORT.md). 보안·심각한 버그만 바로 patch. 작업을 끝내면 다음 배포일을 함께 알린다.
- 방향(2026-11-11 결정): 기능보다 **발견 → 신뢰 → 첫 사용** 경로. 새 컴포넌트는 외부 요청이 생길 때까지 미룬다. 사용자 유치 플랜 23~30번은 Claude 몫을 모두 끝냈다(상세는 ROADMAP-HISTORY).
- 기준값(2026-11-15): 스타 4 · 포크 0 · 외부 이슈 0(good first issue #31~#34 는 직접 등록) · npm 평일 react 14/일. 방문 통계(Cloudflare Web Analytics)는 11/14 부터 집계 — **일주일 쌓이면 읽히는 문서·유입 경로를 보고 다음 작업을 고른다.**
- **한국 키트 강화 끝(2026-11-18, [`KOREAN-KIT-PLAN.md`](KOREAN-KIT-PLAN.md) Task 1~3):** 초성 검색(korean-utils `matchesKorean`·`getChoseong`, Combobox 기본 필터), AmountInput 빠른 금액(`quickAmounts`·`showMaxButton`), AgreementGroup 하위 항목(`children`) + Calendar 선택된 토요일 대비 수정. changeset 4개(react minor·korean-utils minor) — 11/19 버전 PR 머지 전에 main 에 있으면 함께, 아니면 12/3 배포. korean-utils 전체 크기 한도 2.7 kB(사용자 결정).
- **SEO·GEO 끝(2026-11-17, Task 1~6):** 소개 사이트 `/components/`(목록 + 한국 키트 13쪽)·`/compare/`·JSON-LD(리치 결과 경고 0), README 링크를 사이트 쪽으로. 이제는 한 달에 한 번 [`GEO-CHECK.md`](GEO-CHECK.md) 기록(첫 기록 12월 초).
- Next.js 는 16.4.6(2026-11-17, 보안 공지 5건 해결). 설치된 Next 에 보안 공지가 생기면 Claude 가 `next build` 를 돌릴 때 에이전트 감지로 한 번 멈추고 업그레이드를 권한다(`SecurityFatalError`, 다시 돌리면 통과 — CI 는 해당 없음). 그 출력의 업그레이드 명령은 바로 실행하지 않고 공지를 확인해 따로 올린다.

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
- [ ] **bestow-ui.com 마무리**: Cloudflare Web Analytics 에 bestow-ui.com 방문이 잡히는지 확인(안 잡히면 사이트 추가·토큰 교체), 도메인 자동 갱신 유지. 12월 초 네이버 서치어드바이저의 옛 `https://dev-bestow.github.io` 등록 삭제(루트 저장소는 2026-11-20 에 bestow-ui.com 으로 바로 보내게 고침 — 등록을 지운 뒤 그 저장소의 `naver*.html` 도 삭제). (Search Console·네이버 소유확인·sitemap 제출은 2026-11-14 끝남)
- [ ] velog 게시 · 요즘IT 기고 제안 · 발표 지원(CFP 공고 때) · 접근성 커뮤니티 글 — 초안: 알리기 준비물 Artifact https://claude.ai/artifact/LvPgoSsmGKHjLd34FP789u
- [ ] 12월 초 GEO 첫 기록: `docs/GEO-CHECK.md` 의 질문 5개를 ChatGPT·Perplexity·Gemini 에 넣고 결과·Search Console·Cloudflare AI 유입을 알려 주기(Claude 가 표에 적음).
- [ ] Figma: 요금제 올릴지(다크 모드·라이브러리 게시·페이지 제한), Community 공개 여부 — `docs/FIGMA.md`.
- [ ] 스크린리더·기기: ResidentNumberInput NVDA, (가능하면) iOS VoiceOver·센스리더, (선택) Android Chrome 가상 키보드 — `SCREEN-READER-CHECKLIST.md`.
- [ ] 이 라이브러리로 만든 실제 서비스가 생기면 알려 주기 — README "사용 사례".

### Claude 가 확인할 것 (push·배포 뒤)
- [ ] 방문 통계 일주일 뒤 읽히는 문서·유입 경로 정리 → 다음 작업 제안, 29번 ✅.

### Claude 가 할 일
- **스프린트 11/19 ~ 12/3 (다음 배포일까지, 2026-11-19 사용자 결정)** — 2.2.0 새 기능을 발견 경로에 싣는다. 작업마다 커밋 확인 후 다음.
  - 1주차: [x] ① AI 도구 문서에 2.2.0 반영(`docs/ai/bestow-ui.md`·`llms.txt`·`context7.json` — MultiCombobox·초성 검색·빠른 금액)
    [x] ② 첫 화면 데모·korean-utils README 에 초성 검색(npm `초성` 11위) [ ] ③ 11/21 방문 통계 읽기(29번 ✅, 사용자가 숫자 전달)
  - 2주차: [ ] ④ 사이트 `/changelog/`(패키지 CHANGELOG 를 빌드 때 읽어 한국어 변경 기록 쪽) [ ] ⑤ 28번 Figma 정리 2건(MCP 한도 풀리면)
    [ ] ⑥ 통계로 고르는 작업 하나 [ ] ⑦ 12/1~2 GEO 첫 기록(`GEO-CHECK.md`, 사용자가 AI 답변 전달)
  - 하지 않음: 새 컴포넌트(외부 요청 없음)·3.0 준비·의존성 2차(대기 중).
- (선택) IndexNow — 배포 뒤 바뀐 쪽 알림. (선택) 문서 쪽별 OG 이미지 — 29쪽이 같은 og.png 라 네이버가 대표 이미지로 안 쓸 수 있음(네이버 웹마스터 가이드 점검 4건은 2026-11-20 끝).
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
| 2026-11-13 | 사용자 할 일 완료(Search Console·네이버 sitemap 제출 등), main CI 녹색, 스타 4·포크 0·외부 이슈 0, 버전 PR #30 열림. 24번 홍보 글은 블로그 저장소에서 관리 |
| 2026-11-13 | 25번: `examples/shadcn-starter` + Guides MDX(shadcn 변수 → overrides, 대비 모자란 변수는 잇지 않음) + README·llms.txt 링크. 검증 전부 통과(lint·format·build·size·typecheck·test 615·stories 666·build 3종·E2E 87+24) |
| 2026-11-14 | 26번 Next.js 템플릿 `examples/next-starter`(3단계 가입·로그인·내 정보, react-hook-form + zod, 스키마를 서버 액션과 공유, 단계마다 폼) + README·Patterns·llms.txt 연결. 브라우저 흐름 16개·axe 라이트·다크 0 |
| 2026-11-14 | 27번 AI 코딩 도구 규칙 파일: `docs/ai/bestow-ui.md` + 빌드 때 Pages `/ai/`(md·Cursor mdc)로, 규칙 속 이름을 export 와 대조(변이 확인), README·npm README·llms.txt 안내 |
| 2026-11-14 | 28번 Figma 1단계: 새 파일 BestOW UI Library 에 tokens → 변수 133·글자 스타일 9·그림자 6·Foundations 견본, 생성 스크립트 `scripts/generate-figma-tokens.mjs`·`docs/FIGMA.md`. Starter 요금제라 다크 모드·Code Connect 불가 |
| 2026-11-14 | 28번 Figma 2단계: 컴포넌트 세트 Button·TextField·Checkbox·Badge·VerificationCodeInput + 한국 입력 3(TextField 인스턴스), 컴포넌트 글자 스타일 4(생성 스크립트에도). Starter 페이지 3개·MCP 호출 한도로 정리 2건 남음 |
| 2026-11-14 | 기준값: 스타 4 · 포크 0 · 이슈 열림 0/닫힘 0 · Discussions ?(GITHUB_TOKEN 없음) · npm 평일 중앙값(최근 28일, 배포일·다음날 제외) react 12/일(12일) · korean-utils 5/일(14일) · tokens 5/일(15일) · icons 4/일(17일) — 같은 기간 react 합계 2,001(대부분 배포·CI) |
| 2026-11-14 | 29번 측정: `scripts/stats.mjs`(기준값 한 줄), Cloudflare Web Analytics(사용자 결정) — 배포 빌드에만 토큰으로 beacon, site E2E 로 테스트 빌드에 없는지 확인, SECURITY.md 공개. 토큰 등록은 사용자 |
| 2026-11-14 | 30번: 배포 주기 격주 목요일(SUPPORT.md·CLAUDE.md), 알리기 준비물 Artifact(velog·요즘IT·발표 제안서·커뮤니티) |
| 2026-11-14 | 16번: CONTRIBUTING "처음 기여하기" + README 링크, good first issue 초안 4개(커버리지로 찾은 실제 빈 곳 — presets 분기 2·en 2·Tag 14, vite-starter 영어 전환) |
| 2026-11-14 | 14번: Guides "TanStack Table 과 함께 쓰기" — 예시 스토리(정렬·검색·페이지·선택·결과 없음, play 테스트·변이 확인)와 문서(연결 표·접근성·서버 모드). 새 스토리 1개 시각 회귀 기준 이미지 생성 필요(main push 때 자동) |
| 2026-11-14 | 문서 정리: STABILIZATION 삭제(요약은 HISTORY), 파일럿·설계 기록 docs/archive, ROADMAP 503 → 약 120줄(옛 계획 절 403줄·11-10 까지 진행 기록 52줄은 HISTORY 에 그대로 보관). 미완료 항목 모두 "남은 일" 로, 깨진 링크 0 |
| 2026-11-14 | 도메인 bestow-ui.com(사용자 결정, 후보는 RDAP 로 조회): 옛 주소 68곳 교체(README·package.json homepage·문서·llms.txt·OG·canonical), 소개 사이트 basePath 기본 ''·E2E 를 루트 구조로, `robots.txt`(sitemap 위치) 추가. 4개 패키지 patch changeset. 연결 순서는 "사람이 할 일" |
| 2026-11-14 | bestow-ui.com 연결 확인: DNS(A·AAAA·www CNAME·인증 TXT), HTTPS, 16쪽 200(사이트·Storybook·playground·robots·sitemap·llms·ai·확인 파일), canonical·OG·sitemap 새 주소, 옛 `?path=`·`iframe.html?id=` 가 Chrome 에서 새 도메인 Storybook 으로, http·www → https 루트 |
| 2026-11-14 | 네이버 소유 확인 파일(사이트 루트, prettier 제외, E2E). SEO·GEO 조사(Storybook 문서는 같은 제목·canonical 에 JS 렌더라 검색에 안 잡힘) → 계획서 `SEO-GEO-PLAN.md`(한국 키트 13쪽 정적 문서·JSON-LD·비교 쪽·GEO 점검) |
| 2026-11-14 | 사용자: bestow-ui.com 을 Google Search Console·네이버 서치어드바이저에 등록하고 sitemap 제출 |
| 2026-11-15 | 기준값: 스타 4 · 포크 0 · 이슈 열림 4/닫힘 0(good first issue #31~#34 등록됨) · npm 평일 중앙값 react 14/일 · korean-utils 6/일 · tokens 5/일 · icons 6/일 |
| 2026-11-15 | SEO·GEO Task 1·2: 소개 사이트 `/components/<slug>/` 한국 키트 13쪽(정적 HTML) — 글은 `kit.ts`, props·키보드·스크린리더·선택 기준은 빌드 때 소스(`source.ts` — react 소스·componentA11y·choosing, 못 찾으면 빌드 실패)에서. 데모 13(날짜는 오늘 고정, 주소는 가짜 공급자), site 단위 테스트(변이 확인)·E2E 18(5회 반복), 코드 예시 tsc 확인, Storybook 링크 index.json 대조. `publicTypes` 를 `scripts/lib/public-types.mjs` 로 |
| 2026-11-15 | CI Cross-browser (firefox) 실패: site E2E 주민번호 붙여넣기 — `new ClipboardEvent('paste', { clipboardData })` 가 Firefox 에서 빈 값. 이벤트에 `clipboardData` 를 defineProperty 로 붙이고 앞칸에 직접 보내게(Chromium·WebKit 5회 반복, 붙여넣기 처리 끈 변이로 실패 확인). Firefox 통과는 push 뒤 CI 로 |
| 2026-11-15 | 확인: main CI 전부 녹색(Firefox 붙여넣기 E2E 수정 통과), 배포된 `/components/` 쪽 200·canonical 새 주소. |
| 2026-11-17 | 기준값: 스타 4 · 포크 0 · 이슈 열림 4/닫힘 0 · npm 평일 중앙값 react 13/일 · korean-utils 6/일 · tokens 5/일 · icons 5/일. main CI 녹색, 버전 PR #30 열림, `/ai/bestow-ui.md`·`.mdc` 200 확인 |
| 2026-11-17 | SEO·GEO Task 3: 소개 사이트 `/components/` 목록 쪽(13쪽 링크·쪽 메타), 머리글 `컴포넌트`, 컴포넌트 쪽 이동 경로 가운데 항목 링크, 첫 화면·함수 목록·함수 쪽의 컴포넌트 링크를 사이트 쪽으로(함수 쪽엔 Storybook 링크도), sitemap 14개, llms.txt 한 줄. guides `component.slug` + 단위 테스트(변이 확인), E2E 87+45 |
| 2026-11-17 | Next.js 16.4.2 → 16.4.6(GHSA-pc58-hwjq-p385 등 moderate 5건, 16.4.5 에서 고침): site·playground·next-starter 범위 `^16.4.6`(하한을 올려 옛 버전으로 내려가지 않게), lockfile 은 next·@next/* 만. next-starter build, 검증 전부 통과(test 615·stories 670·E2E 87+45). 앱 전용이라 changeset 없음 |
| 2026-11-17 | SEO·GEO Task 4 JSON-LD: `app/structured-data.tsx` — 첫 화면 SoftwareSourceCode, 함수 쪽 10·컴포넌트 쪽 13 에 TechArticle + BreadcrumbList(화면 Breadcrumb 과 같은 `Crumb[]` 에서), `<` → \u003c 직렬화. 단위 테스트 5(변이 확인), E2E 3개 spec 에 단언(`fixtures.jsonLd`), 검증 전부 통과. 리치 결과 테스트는 배포 뒤 |
| 2026-11-17 | Search Console "리디렉션이 포함된 페이지" 1건 = `http://bestow-ui.com/`(HTTPS 넘겨주기, 의도한 것). sitemap 32개·사이트 안 링크 24개 모두 200 |
| 2026-11-17 | SEO·GEO Task 5 비교 쪽 `/compare/`: BestOW·Vapor·HANUI·shadcn/ui·MUI 표(칸마다 공식 문서 근거, 확인한 날짜, "찾지 못함" 뜻, 다른 선택지 안내), 데이터 `app/compare/data.ts`, 머리글 `비교`·sitemap·llms.txt·JSON-LD. 다시 확인해 MUI 접근성(WCAG 2.2 A·AA 보고서 초안)·대비(contrastThreshold) 칸을 README 표에서도 고침. E2E 6(axe 라이트·다크·320·390px), 검증 전부 통과(E2E 87+51) |
| 2026-11-17 | 리치 결과 테스트: 첫 번째는 배포 끝나기 1분 전에 크롤링돼 "없음". 컴포넌트 쪽 재테스트 Breadcrumbs·Articles 유효 2·오류 0, Articles 권장 속성 경고 → `image`(og.png)·`author`(Dev-BestOW 조직)·`datePublished`·`dateModified`(데이터 파일의 날짜 상수, +09:00) 추가. 단위 22·E2E 87+51 |
| 2026-11-17 | 리치 결과 재테스트: 경고 0(사용자 확인). SEO·GEO Task 6: `docs/GEO-CHECK.md`(질문 5개·Search Console·Cloudflare AI 유입 기록 표), CLAUDE.md 에 `/components/`·`/compare/`·JSON-LD·날짜 상수 규칙, 루트·react·korean-utils README 의 한국 키트 링크를 사이트 쪽으로(react·korean-utils patch changeset). SEO-GEO-PLAN 끝 |
| 2026-11-17 | Context7 등록(사용자): /dev-bestow/bestow-ui finalized, 조각 928 — 한국어인데 언어 불일치 없이 색인. 직접 추가해 이미 "Owned by your teamspace"(Claim 불필요). 출처에 ROADMAP·CLAUDE.md 등 내부 문서가 섞여 루트 `context7.json`(기본 제외 + 내부 문서 9개, 규칙 12개 — 스키마 한도 확인, 이름 23개 export 대조) |
| 2026-11-17 | Context7 저장소 설정 적용(사용자 Switch·Refresh): 조각 928 → 434, 출처 16개 파일 모두 사용자 문서(README 들·Storybook MDX·MIGRATION·CONTRIBUTING·llms.txt), 내부 문서 0, 규칙 12개 모두 "LIBRARY RULES" 로 나감, 영어 설명 반영. 확인: `curl -s "https://context7.com/api/v1/dev-bestow/bestow-ui?type=txt&tokens=50000" \| grep '^Source:'` |
| 2026-11-17 | Context7 인증(사용자 신청, 자동 심사) 통과: `verified: true`·trustScore 7.5(스타 4 라 자동 인증은 안 됐고 양식으로 신청). 설정은 이제 `context7.json` 으로만 바뀜(관리 화면은 읽기 전용, 버전 감지만 화면에서) |
| 2026-11-17 | 네이버 URL 검사 경고(제목 40자·설명 80자 초과) — 29쪽 중 26쪽이 넘음. 화면 h1·머리말은 두고 메타만: `seo.ts` `pageTitle`(사이트 이름은 40자 안에 들 때만), kit.ts `metaDescription`(summary 를 줄인 것, 대조함), 첫 화면·목록·비교 설명 줄임, h1 이 40자 넘던 카드번호·기간 선택 제목 줄임. landing E2E 가 sitemap 의 모든 쪽 + 404 를 검사(변이 확인) |
| 2026-11-17 | 사용자: 네이버 URL 검사 재확인(길이 경고 해결), 새 쪽 수집·색인 요청(네이버 웹 페이지 수집·Search Console URL 검사 — `/components/`·`/compare/`·전화·사업자번호 쪽). 다음 측정은 12월 초 GEO-CHECK 첫 기록 |
| 2026-11-18 | 한국 키트 강화 계획 `KOREAN-KIT-PLAN.md`(초성 검색·AmountInput 빠른 금액·AgreementGroup 하위 항목, 12/3 목표) |
| 2026-11-18 | 🐛 Calendar 선택된 토요일 글자 대비: 토요일 규칙의 `:not([data-holiday])` 가 우선순위를 높여 선택 색(흰 글자)을 덮음 → 같은 우선순위로 낮추고 순서로 정함(토요일 → 일요일·공휴일 → 선택). 스토리 "선택된 토요일" 추가(고치기 전 axe 라이트·다크 실패 확인), patch changeset |
| 2026-11-18 | 한국 키트 강화(`KOREAN-KIT-PLAN.md` Task 1~3, 작업마다 커밋): ① korean-utils `matchesKorean`·`getChoseong`(초성·입력 중인 마지막 글자 `국미`→국민·`한`→하나) + Combobox·MultiCombobox 기본 필터 + 사이트 `/korean-utils/hangul-search/`, korean-utils 전체 한도 2.2→2.7 kB(사용자 결정)·"초성 검색 하나" 감시 항목 ② AmountInput `quickAmounts`·`showMaxButton`(누른 뒤 합계를 status 로 0.8초 뒤), 메시지 키 `quickAmounts`·`maxAmount` ③ AgreementGroup `children`(값에는 하위 value 만, items 에 없는 value 는 걸러 냄)·`AgreementSubItem`. 각각 TDD·변이 확인·E2E 5회 반복, 새 스토리 3개 |
| 2026-11-18 | 인프라 점검(읽기만): 사이트·주요 경로 200, 옛 주소·http·www 301, 인증서 Let's Encrypt ~2027-02-12, 도메인 Cloudflare 만료 2027-11-14·이전 잠금, 최근 Actions 100회 실패 0(main CI 취소 16/30 은 연속 push·기준 이미지 봇 커밋 때문, 마지막 커밋은 끝까지 검사), 방문 통계 스크립트 3곳 1개씩, sitemap 34. 메일 위조 방지 없음 → 사용자가 Cloudflare DNS 에 null MX `0 .`·SPF `v=spf1 -all`·DMARC `p=reject` 추가(1.1.1.1·8.8.8.8·원본 NS 확인). 남은 설정은 "사람이 할 일" |
| 2026-11-18 | 인프라 점검 2(gh 로그인으로): Secret scanning·Push protection·Private vulnerability reporting·Dependabot alerts 켜짐(열린 경고 0·비밀 경고 0), Dependabot security updates 꺼짐, Pages HTTPS 강제·도메인 verified, main ruleset(삭제·force push 금지), Actions 기본 권한 read·PR 승인 허용, deploy key·webhook 0, 협업자 본인뿐. 저장소는 조직이 아니라 개인 계정 소유 |
| 2026-11-18 | 인프라: `/.well-known/security.txt`(RFC 9116, 연락처 = GitHub 비공개 신고, Expires 2027-11-17 — site E2E 가 30일 전부터 실패) + Pages 배포 `include-hidden-files`(조립 스크립트가 security.txt 누락·다른 숨김 파일을 막음 — `.DS_Store` 넣어 변이 확인). 사이트 감시 `uptime.yml`(6시간마다, `scripts/uptime-check.mjs` — 쪽 9·넘겨주기 3·인증서 14일·security.txt 30일, 재시도 3회, 실패 시 GitHub 메일). 운영 사이트에 돌려 배포 전 security.txt 404 를 잡는 것 확인 |
| 2026-11-18 | 배포 확인: `/.well-known/security.txt` 200, Uptime 수동 실행 14개 모두 ✅. DNSSEC 완료 — `.com` DS(키 태그 2371, 알고리즘 13) 등록, 1.1.1.1 응답에 `ad` 플래그 |
| 2026-11-18 | 인프라: Dependabot security updates 켬(gh) + `.github/dependabot.yml`(npm·github-actions, 버전 올리기 PR 은 `open-pull-requests-limit: 0` 으로 끔, 커밋 접두어 ⬆️). size.yml PR 댓글은 Dependabot PR 에서 건너뜀(읽기 전용 토큰이라 실패했을 것). 패키지 dependencies 를 바꾼 보안 PR 은 changeset 을 더해 머지 |
| 2026-11-18 | 인프라: CAA `0 issue "letsencrypt.org"`(Cloudflare). Universal SSL 이 켜져 있으면 Cloudflare 가 자기 CA 4곳(comodoca·digicert·pki.goog·ssl.com)을 숨은 CAA 로 더해 꺼 둠(모든 레코드가 DNS only 라 쓰지 않음) → 네임서버·1.1.1.1·8.8.8.8 모두 letsencrypt.org 하나, 사이트 200·www 301 그대로. 인프라 보안 점검 항목 모두 끝 |
| 2026-11-19 | 기준값: 스타 4 · 포크 0 · 이슈 열림 4/닫힘 0 · npm 평일 중앙값 react 10/일 · korean-utils 5/일 · tokens 3/일 · icons 3/일. main CI 녹색, 버전 PR #30(react 2.2.0·korean-utils 0.5.0, 한국 키트 강화 포함) CI 녹색·머지 가능. 확인 끝: `/components/` 200·sitemap 14개, TanStack Table·AgreementGroup 하위 항목 기준 이미지 자동 생성됨 |
| 2026-11-19 | 첫 정기 배포(PR #30 머지): react 2.2.0·tokens 2.2.0·korean-utils 0.5.0·icons 0.2.1, provenance 있음, Release·Pages 배포 녹색. 새 폴더 설치로 `MultiCombobox`·`matchesKorean` export 확인. next-starter `create-next-app --example` 설치·build 통과(react 2.2.0·next 16.4.6). npm 검색 순위(korean-utils): 전화번호 1·주민등록번호 1·사업자등록번호 4·초성 11, kwcag 는 react 4 |
| 2026-11-19 | StackBlitz 예제 점검: headless Chrome 으로 링크를 열면 shadcn·vite 둘 다 "Cloning repo from GitHub" 에서 3분 넘게 멈춤(자동화 브라우저 문제로 보임 — 사용자 브라우저 확인 남김). 대신 두 예제를 새 폴더에서 npm 배포본으로 설치(react 2.2.0)·build·preview → 한국 키트 입력 렌더링, 휴대폰 번호 `010-1234-5678` 서식, 콘솔 오류는 파비콘 404 뿐 |
| 2026-11-19 | 사용자: shadcn-starter·vite-starter StackBlitz 링크 둘 다 브라우저에서 정상 확인(25번 끝). 자동화 Chrome 으로는 StackBlitz 확인이 안 되니 다음부터 사용자에게 부탁 |
| 2026-11-19 | 스프린트(11/19~12/3) 계획을 "Claude 가 할 일" 에. ① AI 도구 문서에 2.2.0: `docs/ai/bestow-ui.md`(여러 개 고르기에 MultiCombobox), `llms.txt`(초성 검색 Combobox·MultiCombobox·`matchesKorean`, AmountInput 빠른 금액, AgreementGroup 하위 동의, 초성 검색 쪽 링크), `context7.json` 규칙 12 → 14(최장 214자). 빌드 이름 대조 통과, 검증 전부 통과(test 160+4+640+22·stories 678·E2E 89+53). 첫 실행의 korean-utils 실패는 두 패키지가 같은 vitest 캐시를 동시에 지우던 `ENOTEMPTY`(다시 돌리니 통과). Context7 은 push 뒤 Refresh 해야 반영 |
| 2026-11-20 | ② 초성 검색 알리기: 소개 사이트 첫 화면 데모에 `정산 은행` Combobox(`KOREAN_BANKS`, 도움말 "ㄱㅁ 을 입력해 보세요") + landing E2E(ㄱㅁ → KB국민은행 고르기, 5회 반복·포함 검색 필터로 바꾼 변이에서 실패 확인). korean-utils npm 설명에 초성 검색·README 문서 목록에 초성 검색 쪽 링크(patch changeset), 루트 README 패키지 표에 초성 검색 |
| 2026-11-20 | 네이버 서치어드바이저 웹마스터 가이드 54쪽 전체 검토 → bestow-ui.com 34쪽 점검: 정상(robots text/plain·http·www 301·404 상태·사이트맵 절대 주소·canonical·viewport·alt), 고칠 것 4(파비콘 상대 경로·playground 중복 제목·이동 경로 "홈"·Storybook 제목 55자)는 "Claude 가 할 일" 에. CLAUDE.md 작업 규칙에 사이트 검색 노출 기준 |
| 2026-11-20 | 네이버 가이드 점검 4건(naver-seo 스킬 기준): ① 소개 사이트 파비콘 절대 주소(app/icon.svg → public, layout `icons` 에 `siteOrigin`), Storybook 파비콘은 `assemble-pages.sh` 가 `./favicon.svg` 를 절대 주소로 바꿈(못 바꾸면 배포 실패) ② playground 5쪽을 사이트맵에서 빼고 `noindex, follow`(사이트맵 34 → 29) ③ JSON-LD·화면 이동 경로 첫 이름 "홈" → "BestOW UI" ④ Storybook 제목 55 → 29자("BestOW UI 컴포넌트 문서 - Storybook"). 조립한 배포 폴더로 태그 확인, 검증 전부 통과(test 160+4+640+22·stories 678·E2E 89+53). playground 파비콘은 noindex 라 그대로 |
| 2026-11-20 | 조직 루트 저장소 `dev-bestow.github.io`: index.html 의 canonical·meta refresh 를 옛 `/BestOW-UI/` 에서 `https://bestow-ui.com/` 으로(두 번 넘어가던 것을 한 번에), robots.txt 의 다른 호스트로 넘어가는 Sitemap 줄 삭제. 네이버 사이트 목록 4개 정리 계획: 옛 http 블로그·dev-bestow.github.io 등록은 12월 초 삭제 |
