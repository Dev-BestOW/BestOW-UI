# Figma 라이브러리

코드(`@bestow-ui/tokens`)가 원본이고, Figma 는 그 값을 따라간다. 디자이너가 같은 이름의 토큰으로 화면을 그리고, Dev Mode 에서 바로 CSS 변수를 보게 하는 것이 목적이다.

- 파일: **BestOW UI Library** (`tHxrcOkPvOAPxVQhJj8hvS`, 메인테이너 팀 — 아직 공개 전. Community 공개·라이브러리 게시는 사용자가 정한다)
- 만든 날: 2026-11-14 (react 2.1.0 · tokens 2.0.0 기준)

## 들어 있는 것

| 종류 | 이름 | 내용 |
| --- | --- | --- |
| 변수 컬렉션 | `Primitives` | 팔레트 53색(gray·blue·red·green·amber + white·black). 게시하지 않고(hidden) 의미 색의 alias 대상으로만 쓴다 |
| 변수 컬렉션 | `Color` | 의미 색 51개(`bg/default`·`primary/solid-hover` …). 값이 같은 팔레트 색을 가리킨다(반투명 `bg/overlay` 만 값 그대로) |
| 변수 컬렉션 | `Space` · `Radius` · `Typography` | 간격 11 · 모서리 6 · 글자 크기 8 + 굵기 4 |
| 글자 스타일 | `Display` `Heading/H1~H4` `Body/Large·Default·Small` `Caption` | `<Typography variant>` 와 같은 크기·굵기·줄 간격. 글자 크기는 `Typography` 변수에 연결 |
| 효과 스타일 | `Shadow/Light/sm·md·lg` · `Shadow/Dark/sm·md·lg` | `--bestow-shadow-*` 라이트·다크 값 |
| 페이지 | `Foundations` | 의미 색·글자 스타일 견본(변수에 연결돼 있어 값이 바뀌면 함께 바뀐다) |
| 글자 스타일 | `Label/Field` `Label/Button` `Label/Button Large` `Label/Badge` | 컴포넌트 글자(필드 라벨·버튼·배지) |
| 컴포넌트 (`Components` 페이지) | `Button` 36 · `TextField` 12 · `Checkbox` 18 · `Badge` 18 | 아래 표 |
| 컴포넌트 (`Korean Kit` 페이지) | `VerificationCodeInput` 3 · `PhoneNumberInput` · `BusinessNumberInput` · `AccountNumberInput` | 아래 표 |

### 컴포넌트

속성 이름·값은 코드 props 와 같다(`variant=solid, color=primary, size=md`). 색·간격·모서리·글자 크기는 모두 변수·스타일에 연결했고, 세트마다 설명과 Storybook 링크가 있다.

| 컴포넌트 | variant 축 | 인스턴스 속성 | 코드와 다른 점 |
| --- | --- | --- | --- |
| Button | variant(solid·soft·outline·ghost) × color(primary·neutral·danger) × size(sm·md·lg) | label | 상태 축은 뺐다(108개가 되어서) — 비활성은 인스턴스 투명도 50%, hover 색은 설명에 |
| TextField | size × state(default·focus·error·disabled) | label · placeholder · helperText · required · show helperText | 오류 문구는 helperText 에 직접 넣는다 |
| Checkbox | checked(false·true·indeterminate) × size(sm·md) × state(default·error·disabled) | label | — |
| Badge | variant(solid·soft·outline) × color 6 | label | size 는 md 만(sm·lg 는 코드에만) |
| VerificationCodeInput | state(empty·filled·error) | — | 재전송은 Button 인스턴스 |
| PhoneNumber·BusinessNumber·AccountNumberInput | — (TextField 인스턴스를 드러내 state·size 를 바꾼다) | — | 서식·검증 동작은 코드에만 |

- 변수 이름은 CSS 변수 경로와 같다: `Color` 의 `primary/solid-hover` ↔ `--bestow-color-primary-solid-hover`. 모든 변수에 Dev Mode 코드 표시(WEB `var(--bestow-…)`)가 있다.
- 용도(scopes)를 정해 두었다 — 배경 색은 채우기에만, `border/*` 는 선에만, `*/text` 는 글자에만 고를 수 있다. 팔레트는 고를 수 없다(의미 색을 쓰게).

## 알아 둘 제약

- **다크 모드가 아직 없다** — Figma Starter 요금제는 컬렉션 하나에 모드를 하나만 허용한다(`addMode: Limited to 1 modes only`). 그래서 `Color` 는 라이트 값만 있다.
  Professional 이상으로 올리면 아래 "다시 맞추기" 를 그대로 돌려 `Dark` 모드를 더한다(다크 값은 생성 JSON 에 이미 있다).
- **글꼴** — 코드 글꼴 Pretendard 는 Figma 클라우드 글꼴에 없어 글자 스타일은 **Noto Sans KR**(코드 글꼴 목록에도 있음)이다. Noto Sans KR 에는 600(SemiBold)이 없어
  `Heading/H3·H4` 는 Bold 로 두었다. Pretendard 를 설치한 디자이너는 글꼴만 바꿔 쓰면 된다(크기·줄 간격은 같다).
- **Code Connect 는 쓰지 않는다** — Figma Organization·Enterprise 요금제 기능이다. 대신 변수의 코드 표시로 Dev Mode 에서 CSS 변수가 보인다.
- **페이지는 3개까지**(Starter) — 그래서 컴포넌트를 한 페이지(`Components`)에 모았다.
- **MCP 호출 한도**(Starter) — 2026-11-14 컴포넌트 작업 중 한도에 걸렸다. 남은 일: Checkbox 의 `icon` 프레임 12개에 SVG 를 불러올 때 생긴 흰 배경(fills)을 지운다
  (Figma 에서 Checkbox 세트 안 `icon` 프레임을 모두 골라 채우기 삭제, 또는 한도가 풀린 뒤 `icon.fills = []`), Korean Kit 페이지의 변수 연결 감사.

## 다시 맞추기 (토큰을 바꿨을 때)

1. `pnpm build` → `node scripts/generate-figma-tokens.mjs figma-tokens.json`
   (CSS 변수 이름이 `contract.test.ts` 의 공개 이름 목록에 없으면 실패한다)
2. Figma MCP 의 `use_figma` 로 이 JSON 을 적용한다 — 컬렉션·변수·스타일을 **이름으로 찾아 값만 바꾸고**, 없으면 만든다(그래서 여러 번 돌려도 안전하다).
   2026-11-14 첫 적용 스크립트의 흐름: 컬렉션 찾기/만들기 → 모드 이름 맞추기·없는 모드 추가 → 변수 찾기/만들기 → 모드별 값(`@이름` 은 Primitives alias) → scopes·codeSyntax.
3. 글자 스타일은 `Typography.css.ts` 의 variant 와 생성 스크립트의 `textStyles` 표를 함께 고친다.

## 다음 단계 (ROADMAP 28번)

- 위 "MCP 호출 한도" 의 남은 일 두 가지.
- 다음 후보 컴포넌트: Select·NativeSelect·RadioGroup·Switch·AgreementGroup·Alert·Modal. 아이콘(@bestow-ui/icons)을 컴포넌트로 만들면 Button 에 아이콘 자리(INSTANCE_SWAP).
- 요금제를 올리면: `Color` Dark 모드, 팀 라이브러리 게시, 페이지를 컴포넌트별로 나누기.
