# 1.x → 2.0 마이그레이션 가이드 (초안)

> **초안이에요.** 2.0 출시 일정은 아직 없어요. 1.x 동안 "기존 화면·타입을 깨야 해서 major 로 미룬 것" 을 여기에 모아요.
> 항목을 추가할 때는 ① 1.x 에서 먼저 할 수 있는 것(새 이름·옵션, deprecated 경고)을 minor 로 내고 ② 2.0 에서 바뀌는 점과
> ③ 2.0 으로 올린 뒤 예전처럼 쓰는 방법을 함께 적어요 (CLAUDE.md "작업 규칙" 의 deprecated 절차).

**권장 순서(예정):** 최신 1.x 로 올린다 → 콘솔의 `[BestOW UI] … deprecated …` 경고와 TypeScript `@deprecated` 취소선을 보며 아래 표대로
바꾼다 → 화면이 바뀌는 항목은 1.x 의 옵션으로 미리 켜서 확인한다 → 2.0 으로 올린다.

## 바뀌는 이름 (deprecated → 제거)

| 대상 | 1.x (deprecated) | 2.0 | 이유 |
| --- | --- | --- | --- |
| — | 1.x 에서 deprecated 인 이름은 없어요 | | |

2.0 에서 새로 deprecated 가 되는 이름(3.0 에서 제거):

| 대상 | 2.x (deprecated) | 대신 | 이유 |
| --- | --- | --- | --- |
| 테마 | `strongInputBorders` | 넣지 않아도 돼요 | 2.0 기본 테두리와 같은 값 |

## 바뀌는 기본값 (화면이 달라짐)

### 1. 입력 칸·체크 컨트롤 테두리가 진해져요 (S12, 반영됨)

| | 1.x 기본 | 2.0 기본 |
| --- | --- | --- |
| 라이트 테두리 / hover | gray300(흰 배경 1.3:1) / gray500 | gray600(5.18:1) / gray700 |
| 다크 테두리 / hover | gray700(2.18:1) / gray500 | gray500(8.57:1) / gray300 |
| 라이트 체크 컨트롤 (`border.control`) | gray500(흰 배경 2.07:1) | gray600(5.18:1) |
| 다크 체크 컨트롤 | gray500(8.57:1) | 그대로 |

- **이유:** 기본 테두리가 배경과 3:1 미만이라 칸의 경계가 잘 보이지 않아요(WCAG 1.4.11 비텍스트 대비).
- **대상:** Input 을 쓰는 모든 칸(TextField·Select·Combobox·DatePicker·DateRangePicker·NumberInput·전화번호·사업자번호·금액·주소 입력), Textarea, 인증번호 칸.
  체크 컨트롤은 Checkbox·RadioGroup 테두리, 꺼진 Switch 트랙, Stepper 의 예정 단계(원·연결선)예요.
  카드·표·구분선 등 다른 테두리(`border.default`)와 `border.strong` 자체는 그대로예요.
- **1.x 에서 미리 켜기:** `createTheme(strongInputBorders)` (브랜드 테마와 함께면 `createTheme(brand, strongInputBorders)`).
- **`border.default`·`border.strong` 을 덮어쓴 경우:** 1.x 에서는 입력 칸이 이 두 토큰을 따랐지만, 2.0 부터는 `border.input`·`inputHover`·`control`
  (CSS `--bestow-color-border-input`·`--bestow-color-border-input-hover`·`--bestow-color-border-control`)이 따로 정해져 있어요.
  입력 칸 색도 바꾸려면 이 세 토큰을 함께 지정해요.
- **`strongInputBorders`:** 2.0 기본값과 같아져 넣지 않아도 돼요. 2.x 동안 남기고(`@deprecated`) 3.0 에서 지워요 — 지금 지워도 화면은 같아요.
- **tokens:** `lightColors`·`darkColors` 의 `border` 에 `input`·`inputHover`·`control` 이 생겨요. `SemanticColors` 에서는 선택(`?`) 키라
  직접 만든 색 객체는 타입 오류 없이 그대로 써요(이 경우 입력 칸 색은 ThemeProvider 기본값을 따라요).
- **2.0 에서 예전처럼 쓰기**(대비가 3:1 미만이 되니 권하지 않아요). Storybook **Foundations › Theming › 입력 칸 테두리 (1.x 와 비교)** 에서 비교할 수 있어요.

  ```tsx
  const classicInputBorders = createTheme({
    light: { color: { border: { input: '#dee2e6', inputHover: '#adb5bd', control: '#adb5bd' } } }, // gray300 / gray500 / gray500
    dark: { color: { border: { input: '#495057', inputHover: '#adb5bd', control: '#adb5bd' } } }, // gray700 / gray500 / gray500
  });
  ```

### 2. 비활성 투명도가 0.5 로 통일돼요 (S15, 반영됨)

| | 1.x | 2.0 |
| --- | --- | --- |
| Input 을 쓰는 모든 칸, Textarea, 인증번호 칸 | 0.6 | 0.5 |
| Pagination 버튼, Calendar 의 고를 수 없는 날 | 0.4 | 0.5 |
| 그 밖의 컴포넌트(Button·Checkbox·Radio·Switch·Select·Tabs·Accordion·Slider·DropdownMenu·SegmentedControl) | 0.5 | 그대로 |

- **이유:** 같은 화면의 비활성 컨트롤이 컴포넌트마다 다르게 흐려 보였어요.
- **새 토큰:** `opacity.disabled`(tokens, `'0.5'`) → CSS 변수 `--bestow-opacity-disabled`, react `vars.opacity.disabled`.
  모든 비활성 모양이 이 변수 하나를 써서, 한 번에 바꿀 수 있어요: `:root { --bestow-opacity-disabled: 0.6; }` 또는
  `createTheme({ common: { opacity: { disabled: '0.6' } } })`.
- FileUpload 는 그대로예요 — 영역 전체를 흐리면 안내 글자가 읽기 어려워져 테두리와 버튼으로만 비활성을 보여요.
- **2.0 에서 예전처럼 쓰기:** 컴포넌트별 값은 하나의 변수로 모였으므로 되돌리려면 그 컴포넌트에 `className` 으로 `opacity` 를 직접 지정해요.

## 검토 중 (결정 전)

| 후보 | 지금 | 생각해 둔 방향 |
| --- | --- | --- |
| Alert 기본 `color` | `primary`(브랜드 색) — 1.x 에 `info` 가 생기기 전 "일반 안내" 로 쓰던 값 | 2.0 기본값을 `info` 로. 브랜드색이 주황·빨강이면 기본 Alert 가 경고처럼 보인다. 1.x 에서 미리: `color="info"` |
