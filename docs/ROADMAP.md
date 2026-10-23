# BestOW UI 로드맵

> 이 문서는 다음 작업 세션(사람 또는 Claude)이 **무엇을, 어떤 순서로, 어디까지 하면 되는지** 바로 알 수 있게 쓴다.
> 작업 규칙·구조·함정은 [`CLAUDE.md`](../CLAUDE.md), 완료된 단계(P1~P16)의 설계 메모·진행 기록 전체는 [`ROADMAP-HISTORY.md`](ROADMAP-HISTORY.md),
> 누구를 위해 무엇을 차별화하는지는 [`POSITIONING.md`](POSITIONING.md), 2.0 에 모으는 변경은 [`MIGRATION-2.0.md`](MIGRATION-2.0.md).
>
> **갱신 규칙:** 작업을 시작/완료하면 체크박스를 바꾸고 맨 아래 "진행 기록"에 한 줄 추가한다.
> 단계가 끝나면 상세 메모는 ROADMAP-HISTORY.md 로 옮기고 여기에는 한 줄 요약만 남긴다.

## 🔁 다음 세션 시작하기 (인수인계 — 2026-10-23 기준)

**마지막 상태**
- npm: **react 1.6.1**(2026-10-23 — 사업자번호·날짜 입력 순간 오류 알림, README 프로덕션 권장·스크린리더 점검 문구) · **korean-utils 0.1.0** ·
  tokens 1.3.0 · icons 0.1.3. 열린 버전 PR 없음, 배포 대기 changeset 없음.
- origin/main = `38c756c`(버전 PR #25 머지). CI·browsers(WebKit·Firefox)·React 18·시각 회귀·Release·Pages 모두 녹색(2026-10-23 확인).
- GitHub 저장소 설정 완료(2026-10-21): 한국어 About·Website, Topics 18개, **Discussions 켜짐**(기본 카테고리 6개). 이슈·PR 템플릿 있음.
- Pages: Storybook + playground + `llms.txt`·`llms-full.txt`. StackBlitz 예제 `examples/vite-starter`(npm 의 react ^1.6.0 — 통신사 NativeSelect 포함, 2026-10-21 설치·빌드·화면 확인).
- 컴포넌트 약 51개(폴더 50) + 테마·다국어·서식 함수, 아이콘 57종. **P1~P16 완료**, 이번 플랜 1(노출)·2(번들)·3(korean-utils)·5(런칭 준비물) 완료.
- 프로덕션 권장 선언 기준 **6/6 달성**(2026-10-23 NVDA + Chrome 13개 항목 모두 ✅, VoiceOver 재확인 ✅) — README·npm·Introduction·SUPPORT·POSITIONING 에 반영, 1.6.1 로 배포.
- **런칭: 게시만 남음.** 블로그(https://jiwon-seok.com, 저장소 ~/Documents/Project/astro-blog) 기술 글 2편 **공개됨** —
  `oklch-contrast-theme`(10-21)·`kwcag-automated-testing`(10-23, NVDA 결과 포함). 블로그 표 스타일도 2026-10-23 손봄.
  GeekNews Show 본문은 비공개 Artifact https://claude.ai/artifact/EdgazWzz98aH3maLsXFwRT ("복사" 버튼, NVDA 결과 반영됨).
  런칭 뒤에는 이슈·Discussions 반응으로 다음 기능(Combobox 다중 선택·Tag 입력)을 정한다.
- **9번 OS 다크 모드(`theme="system"`) 완료**, **10번 반응형 기반 완료**(2026-10-23, changeset `responsive-layout` react·tokens minor — 배포 대기). 11번 info 색·12번 FormField·CheckboxGroup 완료(changeset `info-color`·`form-field-checkbox-group`). 다음은 13번 한국 키트 확장.
  **"앱 기본" 번들 여유가 50 B 뿐**(4.05/4.1 kB — Stack 구간별 값 +300 B) → 다음에 ThemeProvider·Button·Typography·Stack 을 키우면 한도를 사용자와 다시 정한다.
- **2026-10-23 객관 점검** 결과를 "다음 플랜 › 객관 점검에서 나온 보완"(9~16번)에 넣음 — 런칭 게시 다음으로 9(OS 다크 모드)·10(반응형)·11(info 색 등 토큰)을 minor 하나로.
- 번들(2026-10-23 측정, minify + brotli): react 전체 JS **68.98/80 kB** · Button 하나 1.51/2 · 앱 기본 **4.05/4.1**(10-23 system 모드·반응형 Stack 뒤) · styles.css 10.66/12 · 폼 세트(Select) 29.64/33 ·
  **폼 세트(NativeSelect) 3.87/4.3** · 오버레이 세트 34.76/38 · 한국 키트 30.36/33.5 · styles.css 10.08/12 · tokens 1.27/1.5 ·
  korean-utils 전체 838 B/1 kB·함수 하나 179/300 B. 큰 덩어리는 모두 Radix(점검 결과는 아래 "Claude 가 할 일" 2번).
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

## 다음 플랜 (2026-10-21 재정리 — 알리기·도입 장벽 낮추기 우선, 위에서부터 추천 순서)

> 방향: 품질은 충분하다. 부족한 것은 **알리기**와 **도입 장벽**이다(스타 1, npm 월 다운로드 react 665 는 1주 24개 버전 배포·CI 설치로 부풀려진 값 —
> 실사용자는 거의 없다고 보고 시작). 공개 런칭(GeekNews 등)은 **NVDA 점검으로 "프로덕션 권장 6/6" 을 채운 뒤 한 번에** 한다.
> 첫 런칭은 한 번뿐이라 그 문구와 번들 숫자를 쓸 수 있을 때 한다.

### 사람이 할 일

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
- [ ] **런칭 게시** — 준비 끝(2026-10-23: react 1.6.1 배포, 블로그 기술 글 2편 공개, Artifact 의 GeekNews 본문 NVDA 반영). 순서: GeekNews Show(1순위) → velog·요즘IT 등에 기술 글 → 접근성 커뮤니티·공공/SI/에이전시 쪽 → FEConf·JSConf Korea 발표 지원.
- [ ] (가능하면) iOS VoiceOver·센스리더 점검 — 같은 체크리스트, 3·4번째 열.
- [ ] (선택) 실제 기기 확인: 가상 키보드가 Modal·Drawer 입력을 가리는지(iOS Safari·Android Chrome).
- [ ] 이 라이브러리로 만든 **실제 서비스**(개인 프로젝트라도)가 생기면 알려 주기 — README "사용 사례" 에 넣는다(2026-10-21 기준 없음. playground 는 데모라 사례로 약함).
- [ ] 수요 확인: Combobox 다중 선택·비동기 검색, Tag 입력 — 런칭 반응(이슈·Discussions)으로 판단.

### Claude 가 할 일

1. ✅ **노출 정비** (2026-10-21 완료 — 남은 것: 사용자의 GitHub 설정, push 뒤 README 이미지·배지 확인)
   - 히어로 이미지 `docs/images/hero.png` 는 playground `/signup` 운영 빌드(3001)를 Playwright 로 라이트 기본·다크+브랜드(#7c3aed)로 찍어
     나란히 합친 것(2x, 약 210 kB). 화면이 크게 바뀌면 같은 방법으로 다시 찍는다(값 입력: 이메일·전화·플랜 "프로"·연간·필수 약관 2개).
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
6. **Combobox 다중 선택·비동기 검색** (구 P14-5, 런칭 반응으로 수요 확인 후) — 선택 칩(Backspace 로 지우기), 검색 중 상태 알림(`role=status`), 긴 목록 가상화는 따로.
   폼 세트 조합에 영향 → 별도 컴포넌트(`MultiCombobox` 등)로 나눌지 먼저 판단. **Tag 입력**(구 P14-6)은 쉼표·Enter 로 추가, 칩 공유.
7. **의존성 정비 2차** — 막힌 것이 풀리면: TypeScript 7(typescript-eslint 가 `<6.1`), ESLint 10(jsx-a11y 가 9 까지).
   jsdom 30 은 Node ≥22.22.2 필요(로컬 Node 를 올리면). CI 러너 Ubuntu 26 전환은 Playwright `-resolute` 이미지(1.64.1 부터 있음)로 모든 workflow 함께 검토.
8. **2.0 준비** — 후보가 쌓이면 `MIGRATION-2.0.md` 에 추가(지금: 입력 칸·체크 컨트롤 테두리 기본값 1개, deprecated 이름 없음). 출시 시점은 사용자와 결정.

### 객관 점검에서 나온 보완 (2026-10-23 — 위에서부터 추천 순서)

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
13. **한국 키트 확장** — korean-utils 에 마스킹 함수(이름 `홍*동`, 전화 `010-****-1234`) 먼저(작고 수요 확실),
    그다음 주민·외국인등록번호 입력(뒷자리 마스킹), 카드번호, 계좌번호 + 은행 선택.
14. **컴포넌트 공백** — Tag/Chip(표시·필터용, 6번 Tag 입력과 칩 부품 공유), 범용 `EmptyState`(지금은 TableEmpty 만),
    TimePicker(예약·배송 시간), 앱 뼈대 패턴(헤더·사이드바·모바일 하단 탭바 — Guides 화면 패턴 예시로 먼저).
    데이터 표는 직접 키우지 말고 **TanStack Table 과 함께 쓰는 패턴 가이드**(정렬·필터·페이지·선택).
15. **Figma 라이브러리** (아래 보류에서 올림) — 팀 도입은 디자이너가 함께 결정하는 경우가 많아 코드만 있는 DS 는 불리하다.
    먼저 tokens → Figma 변수 동기화(Figma MCP 연결됨), 그다음 주요 컴포넌트·Code Connect.
16. **운영** — 런칭 뒤 배포는 SUPPORT.md 의 주기대로 묶는다(1주 24개 버전은 "불안정" 인상). 외부 기여자용 짧은 입구(CONTRIBUTING 첫 화면에
    "처음 기여하기" — CLAUDE.md·ROADMAP 은 너무 길다). 큰 기능 전 번들 조합 한도(여유 약 10%) 확인은 6번과 같음.

### 보류 (수요가 생기면)

- [ ] **shadcn/ui 레지스트리로 제공** (2026-10-21 외부 추천, 보류) — `POSITIONING.md` "하지 않을 것"(Tailwind 전용 복사형)과 충돌하고,
  컴포넌트가 vanilla-extract `.css.ts`·`vars` 에 기대어 복사해 가는 쪽이 빌드 플러그인을 따로 설정해야 한다(도입 장벽이 오히려 커짐).
  하려면 포지셔닝 변경을 사용자가 먼저 결정. korean-utils 반응을 본 뒤 headless 부분부터 검토.
- [ ] 한국 공휴일 도움 함수(`koreanHolidays(year)` 등) — 음력·대체·임시공휴일 때문에 해마다 갱신 필요. 지금은 `isHoliday` 로 받는다. korean-utils 에도 넣지 않음.
- [ ] 컴포넌트별 CSS 선택 import (구 P7-B) — 실제 CSS 가 전체 9.9 kB 라 우선순위 낮음.
- [ ] ~~Figma 변수 ↔ tokens 동기화, Code Connect (구 P11)~~ → 2026-10-23 "Claude 가 할 일" 15번으로 올림.
- [ ] DateRangePicker 를 한 달력에서 끌어 고르는 방식.
- [ ] 아이콘 추가: Lucide 에서 가져오면 `svg/` 에 넣고 `generate`. 자체 아이콘은 같은 규격(24×24, stroke 2, round).

### 프로덕션 권장 선언 기준

- [x] Chromium·WebKit·Firefox 에서 스토리 테스트·E2E 통과 (P12-1)
- [x] 모바일(터치·좁은 화면) 주요 시나리오 E2E (P12-2)
- [x] React 18·19 둘 다 CI (P12-3)
- [x] 주요 컴포넌트 스크린리더 수동 점검 기록 — VoiceOver(macOS) ✅ 2026-10-21 · NVDA(Chrome) ✅ 2026-10-23 · 가능하면 iOS VoiceOver·센스리더 (P13-1 · P16-5)
- [x] 실제 화면 파일럿에서 발견한 문제 해결 (P14-1 — 버그 2개 수정, 빈칸 6개 모두 해결: [`PILOT-FINDINGS.md`](PILOT-FINDINGS.md))
- [x] 지원 범위·배포 주기·보안 문의 경로 문서화 (P12-5, 2026-10-21 정책 확정·비공개 취약점 신고 켜짐)

---

## 현재 상태 (2026-10-23)

| 패키지 | 배포 버전 | 내용 |
|---|---|---|
| `@bestow-ui/tokens` | 1.3.0 | palette(gray·blue·red·green·amber), space, radius, font, shadow/darkShadow, duration, zIndex(overlay < modal < dropdown < toast < tooltip), light/dark 의미 색상 |
| `@bestow-ui/icons` | 0.1.3 | 아이콘 57종 (Lucide 기반), SVG → 컴포넌트 생성 스크립트 |
| `@bestow-ui/react` | 1.6.1 | 아래 컴포넌트 + 테마(ThemeProvider·createTheme·createIntentColors·strongInputBorders·vars·usePortalProps, 선택 토큰 border.input·inputHover·control) + 다국어(LocaleProvider·en) + 서식·날짜 함수·focusField |

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
테스트: vitest 5(단위 445 — react 402·korean-utils 39·icons 4, 스토리 516, 라이트·다크 axe), E2E 68(키보드·모바일 Pixel 7·iPhone 15·고대비·확대/리플로·파일럿 /orders·react-hook-form /signup·portal 테마·axe, hydration 대기).
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
