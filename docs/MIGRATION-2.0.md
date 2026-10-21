# 1.x → 2.0 마이그레이션 가이드 (초안)

> **초안이에요.** 2.0 출시 일정은 아직 없어요. 1.x 동안 "기존 화면·타입을 깨야 해서 major 로 미룬 것" 을 여기에 모아요.
> 항목을 추가할 때는 ① 1.x 에서 먼저 할 수 있는 것(새 이름·옵션, deprecated 경고)을 minor 로 내고 ② 2.0 에서 바뀌는 점과
> ③ 2.0 으로 올린 뒤 예전처럼 쓰는 방법을 함께 적어요 (CLAUDE.md "작업 규칙" 의 deprecated 절차).

**권장 순서(예정):** 최신 1.x 로 올린다 → 콘솔의 `[BestOW UI] … deprecated …` 경고와 TypeScript `@deprecated` 취소선을 보며 아래 표대로
바꾼다 → 화면이 바뀌는 항목은 1.x 의 옵션으로 미리 켜서 확인한다 → 2.0 으로 올린다.

## 바뀌는 이름 (deprecated → 제거)

| 대상 | 1.x (deprecated) | 2.0 | 이유 |
| --- | --- | --- | --- |
| — | 지금 deprecated 인 이름은 없어요 | | |

## 바뀌는 기본값 (화면이 달라짐)

### 1. 입력 칸·체크 컨트롤 테두리가 진해져요 (ROADMAP P13-4)

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
  Storybook **Foundations › Theming › 진한 입력 테두리** 에서 비교할 수 있어요.
- **2.0 에서 예전처럼 쓰기:**

  ```tsx
  const classicInputBorders = createTheme({
    light: { color: { border: { input: '#dee2e6', inputHover: '#adb5bd', control: '#adb5bd' } } }, // gray300 / gray500 / gray500
    dark: { color: { border: { input: '#495057', inputHover: '#adb5bd', control: '#adb5bd' } } }, // gray700 / gray500 / gray500
  });
  ```

- **2.0 에서 할 일(구현):** `color.border.input`·`inputHover`·`control` 을 선택 토큰(기본값 없음)에서 일반 토큰으로 바꾸고 tokens 의
  `lightColors`·`darkColors` 에 값을 넣는다(`SemanticColors.border` 의 선택 키 → 필수 키, 타입 변경이라 tokens 도 major).
  `strongInputBorders` 는 기본값과 같아지므로 2.x 동안 남기고 deprecated 로 표시한다. `presets.test.ts` 의 "기본 테두리는 3:1 미만" 테스트를 뒤집는다.
  시각 회귀 기준 이미지 전체 갱신.

## 검토 중 (결정 전)

| 후보 | 지금 | 생각해 둔 방향 |
| --- | --- | --- |
| — | 지금 검토 중인 항목은 없어요 (체크 컨트롤 테두리는 2026-10-21 결정 → 위 1번) | |
