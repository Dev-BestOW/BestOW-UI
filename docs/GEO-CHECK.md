# GEO 점검 (AI 답변·검색에 얼마나 나오는지)

> 검색 엔진과 AI 답변(ChatGPT·Perplexity·Gemini)이 BestOW UI 를 찾아 보여 주는지 **한 달에 한 번** 같은 방법으로 재서 아래 표에 한 줄씩 남긴다.
> 무엇을 했는지는 [`SEO-GEO-PLAN.md`](SEO-GEO-PLAN.md). 숫자가 늘지 않으면 무엇을 바꿀지 ROADMAP 에서 정한다.

## 재는 방법

### 1. AI 답변 — 같은 질문 5개

각 서비스에서 **로그인하지 않은 새 창**(또는 기록·개인화를 끈 상태)으로 아래 질문을 그대로 넣는다. 답이 날마다 달라지므로 한 번씩만 묻고 그대로 적는다.

| # | 질문 |
|---|---|
| Q1 | React 에서 전화번호 하이픈 자동 입력 컴포넌트 추천해 줘 |
| Q2 | 사업자등록번호 검증 React |
| Q3 | 한국 서비스용 React 디자인 시스템 |
| Q4 | KWCAG 접근성 지킨 React 컴포넌트 라이브러리 |
| Q5 | 약관 전체 동의 체크박스 React 접근성 |

질문마다 서비스별로 하나를 적는다.

- **인용** — 답의 출처 링크에 bestow-ui.com·GitHub·npm 쪽이 있다(어느 쪽인지도 적는다: `/components/…`, `/korean-utils/…`, `/compare/` 등)
- **언급** — 이름(BestOW UI, `@bestow-ui/*`)은 나오지만 링크는 없다
- **없음** — 나오지 않는다

답이 틀린 설명(없는 prop, 옛 API)을 하면 따로 적는다 — llms.txt·README·문서 쪽을 고칠 단서다.

### 2. 검색 — Search Console

Search Console › 실적(지난 28일): 노출·클릭 합계, 노출이 많은 검색어 상위 3개, `/components/`·`/korean-utils/`·`/compare/` 쪽의 노출.
Search Console › 페이지: 색인된 쪽 수(sitemap 주소 가운데 몇 개).

### 3. AI 유입 — Cloudflare Web Analytics

Cloudflare Web Analytics › bestow-ui.com › Referrers(지난 30일): `chatgpt.com`·`perplexity.ai`·`gemini.google.com`·`copilot.microsoft.com` 방문 수.
AI 앱은 referrer 를 보내지 않을 때가 많아 실제보다 적게 잡힌다 — 늘어나는 흐름만 본다.

## 기록

표 칸: 질문마다 `ChatGPT / Perplexity / Gemini` 순으로 `인`(인용)·`언`(언급)·`-`(없음). 예: `인 / 언 / -`.

| 날짜 | Q1 | Q2 | Q3 | Q4 | Q5 | Search Console(노출·클릭·색인) | AI 유입(Cloudflare) | 메모 |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | 첫 기록은 문서 쪽 배포 2~4주 뒤(2026-12 초) |
