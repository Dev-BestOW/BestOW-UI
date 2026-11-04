# 코드 안정화 계획

> 2026-10-30 코드 점검 결과와 작업 순서를 정리한 문서다. **공개 런칭은 이 문서의 "런칭 전 완료 조건"을 채운 뒤에 한다.**
> 다음 세션은 [`ROADMAP.md`](ROADMAP.md) 인수인계를 읽고 아래 "작업 순서"에서 체크되지 않은 첫 항목부터 진행한다.
>
> **갱신 규칙:** 항목을 끝내면 체크하고 ROADMAP "진행 기록"에 한 줄 추가한다. 작업 중 새 버그를 찾으면 여기에 번호를 이어 붙인다.

## 결정 (2026-10-30)

- **홍보보다 코드 안정화를 먼저 한다.** 런칭 게시는 보류한다.
- **호환성을 깨는 변경은 런칭 전에 2.0 으로 한 번에 낸다.** 외부 사용자가 거의 없는 지금이 비용이 가장 낮다.
- 기능 추가(`EmptyState`·Tag·TimePicker·Figma 등)는 이 계획이 끝난 뒤 판단한다.

## 점검 범위와 한계

- 대상: 패키지 구조, CI, 의존성, 컴포넌트 파일·규칙, 폼 입력, 한국어 처리, korean-utils 경계값.
- **전체 컴포넌트 감사는 아니다.** 폼 입력과 한국어 처리 위주로 봤고 Combobox·DatePicker·Button 외의 컴포넌트는 코드를 끝까지 읽지 않았다.
- S2 는 jsdom 재현이다. S1 은 실제 Chrome 에서 재현하고 고쳤다.
- 테스트 커버리지는 측정 도구가 없어 재지 못했다.

## 문제없음으로 확인한 것 (지금 손대지 않음)

| 항목 | 결과 |
|---|---|
| 패키지 구조 | publint 오류 없음. attw 는 `styles.css` 진입점만 실패로 표시 — CSS 라 타입이 없는 것이 정상 |
| 운영 의존성 보안 | `pnpm audit --prod` 취약점 0건 |
| 의존성 버전 | 확인한 범위는 소폭 갱신뿐 |
| CI | `68d4fe8` 의 main 체크 모두 성공 |
| 코드 규칙 | 컴포넌트 스타일에 하드코딩 색 없음, `any`·`@ts-ignore`·`@ts-expect-error` 없음 |
| SSR 테스트·접근성 문서 | 모든 컴포넌트 폴더가 `ssr.test.tsx`·`componentA11y.ts` 에 포함 |
| `fieldset disabled` 동작 | 네이티브 입력은 막힘. Slider·FileUpload 끌어다 놓기는 S11 에서 고침 |

## 작업 순서

| 단계 | 항목 | 버전 |
|---|---|---|
| 1 | [x] S1 + S17 Combobox IME 와 브라우저 E2E (2026-10-30) | react patch |
| 2 | [x] S2 + S16 form.reset 과 폼 공통 계약 테스트 (2026-10-31) | react patch |
| 3 | [x] S3~S5 korean-utils 서식·검증 (2026-10-31) | korean-utils minor·react patch |
| 4 | [x] S6~S7 Stepper 간격, SkipLink 그림자 (2026-10-31) | react patch |
| 5 | [x] S8 `asChild` (2026-10-31) | react minor |
| 6 | [x] S9~S11 Stepper 진행 중, 마스킹 기준, fieldset 모양 (2026-10-31) | react·korean-utils minor |
| 7 | [x] S18~S19 커버리지 측정, 누락 테스트 (2026-10-31) | react patch(주소 재시도 수정) |
| 8 | [x] S12~S15 2.0 (2026-11-04 — 코드 완료, 배포 대기) | react major·tokens minor |

## 1. 버그 (patch)

### S1. Combobox — 한글 조합 중 Enter 처리 없음

- **위치:** `packages/react/src/components/Combobox/Combobox.tsx:199`. 저장소 전체에 `isComposing`·composition 처리가 없다.
- **재현:** 조합 시작 → `국` 입력 → `keyDown { key: 'Enter', isComposing: true, keyCode: 229 }` → `onValueChange('a')` 호출.
- **실제 Chrome 결과:** CDP 로 macOS Chrome 입력 순서(조합 중 keydown 229 → 조합 확정 → 일반 Enter)를 만들면 입력창이 **`국민은행국`** 으로 깨지고 목록이 다시 열렸다. 점검 때 예상한 폼 제출이 아니라 글자 깨짐이 실제 증상이었다.
- **수정:** `handleKeyDown` 맨 앞에서 조합 중 키를 무시한다. Tab 도 건너뛰지만 입력창의 blur 처리가 목록을 닫는다.
- **방향:** `handleKeyDown` 맨 앞에서 `event.nativeEvent.isComposing || event.keyCode === 229` 면 건너뛴다. 화살표·Escape 도 같은 경로로 막히므로 조합 중 동작을 함께 정한다.
- **완료 기준:** 단위 테스트 + 실제 브라우저 E2E(S17), 변이 확인, 조합 뒤 Enter 한 번으로 고르고 폼은 제출되지 않음.

### S2. 서식 입력이 `form.reset()` 에 반응하지 않음

- **위치:** `packages/react/src/utils/useFormattedInput.ts:47` — 값을 내부 상태로만 든다. `form` reset 처리는 `Switch` 에만 있다.
- **재현:** PhoneNumberInput·AmountInput·DatePicker 에 입력 → reset 버튼 → 화면과 `FormData` 가 그대로. 같은 폼의 TextField 만 비워진다.
- **실제 범위:** 계약 테스트로 보니 점검 때 확인한 3개가 아니라 14개 컴포넌트가 초기화되지 않았다. RadioGroup·CheckboxGroup 은 화면만 돌아오고 내부 상태가 남았다.
- **수정:** 공용 훅 `utils/useFormReset.ts`. 비제어 모드는 `defaultValue` 로 돌아가며 `onValueChange` 로 알리고, 제어 모드는 값을 건드리지 않는다.
  react-hook-form 의 `reset()` 도 `form.reset()` 을 불러 제어 모드에서 옛 값을 알리면 새 값을 덮어쓰기 때문이다. Switch 의 같은 위험도 함께 고쳤다.
  DatePicker·NumberInput 은 입력 중 글자를 안에서 들어 `manualReset` 으로 직접 처리한다.
- **완료 기준:** S16 계약 테스트 통과, 변이 확인.

### S3. `050` 번호 서식 오류와 12자리 잘림

- **위치:** `packages/korean-utils/src/koreanFormat.ts`
- **증상:** `formatPhoneNumber('050712345678')` → `050-7123-4567`. 최대 11자리로 잘라 **마지막 숫자가 사라졌고**, 입력창에 12자리를 넣을 수도 없었다.
- **기준:** 050 번호는 11자리 또는 12자리다(libphonenumber `50\d{8,9}`, KT `0502-XXXX-YYYY`). 12자리 `0507-1234-5678`, 11자리 `0507-123-4567`. 점검 때 적은 기대값 `0507-123-4567`(12자리 입력)은 틀렸다.
- **수정:** 최대 자릿수 12, 4-3-4·4-4-4 서식. `maskPhoneNumber` 도 따라 바뀐다.

### S4. `+82` 번호 깨짐

- **위치:** 같은 함수, PhoneNumberInput 의 sanitize.
- **재현:** `formatPhoneNumber('+821012345678')` → `821-0123-4567`.
- **수정:** 새 공개 함수 `phoneNumberDigits` 가 숫자만 남기기 전에 `+82` 를 `0` 으로 바꾼다. `formatPhoneNumber`·PhoneNumberInput 이 같은 함수를 쓴다. `+` 없는 `8210…` 은 국가 번호로 보지 않는다.

### S5. `0000000000` 사업자번호 통과

- **위치:** `packages/korean-utils/src/koreanFormat.ts:50`
- **재현:** `isValidBusinessNumber('0000000000')` → `true`.
- **완료 기준:** 모두 0 은 `false`. 기존 유효 번호 테스트는 그대로 통과.

### S6. 세로 Stepper 간격 불규칙

- **위치:** `packages/react/src/components/Stepper/Stepper.css.ts:71`. [`PILOT-FINDINGS.md`](PILOT-FINDINGS.md) 파일럿 2 버그.
- **증상:** 설명 없는 단계 52px, 있는 단계 68px.
- **수정:** 세로이고 설명이 하나라도 있을 때만 글자 영역에 이름 + 설명 한 줄 높이를 잡는다. 설명이 없는 세로 Stepper 는 지금 간격 그대로다. 설명이 두 줄 이상이면 그 단계는 더 길어진다.
- **확인:** `Vertical` 스토리 `play` 가 실제 브라우저에서 원 사이 간격을 잰다. **시각 회귀 기준 이미지 갱신 필요**(`Vertical`).

### S7. 숨긴 SkipLink 그림자 노출

- **위치:** `packages/react/src/components/SkipLink/SkipLink.css.ts`. 파일럿 2 버그.
- **수정:** `boxShadow` 를 포커스 상태로만 옮겼다. 스토리 `play` 가 포커스 전후의 계산값을 확인한다.

## 2. 기능 공백 (minor)

### S8. `Button`·`IconButton` 의 `asChild`

- 서버 컴포넌트에서 Next `Link` 를 감싸는 버튼 모양 링크. `Link` 의 `asChild` 구현을 따른다.
- 링크일 때 `disabled`·`loading` 동작을 정해 문서에 적는다.
- **결정(2026-10-31, 사용자):** Radix Slot 은 Button 2.69 kB·앱 기본 5.27 kB 라 쓰지 않고 `cloneElement` 로 직접 구현했다. 앱 기본 한도 4.1 → 4.4 kB.
- **동작:** `disabled` 는 `aria-disabled`·`data-disabled`·`tabIndex=-1`·클릭 차단, `loading` 은 포커스를 유지하고 클릭을 막는다. 휠 클릭은 막지 못한다.

### S9. Stepper 진행 중 상태

- **수정:** `Stepper` 에 `loading` 추가(현재 단계 원에 스피너, 이름에 "(진행 중)"). `aria-busy` 는 내용을 건너뛰게 할 수 있어 쓰지 않았다. 자동으로 넘어가는 단계의 실시간 알림은 사용하는 쪽의 `role="status"` 로 둔다. `error` 상태는 수요를 보고 판단한다.

### S10. 마스킹 함수의 인식 실패 처리

- 형식을 인식하지 못하면 원본을 돌려준다(`maskCardNumber('1234')` → `1234`, `maskName('김')` → `김`). 개인정보 함수는 실패할 때 가리는 쪽이 안전하다.
- **수정:** 한 글자 이름은 `*`, 남길 자리가 전체를 덮으면 모두 가림, 13자리 미만 카드번호와 형식을 모르는 전화번호도 모두 가림. 대표번호는 그대로 둔다.

### S11. `fieldset disabled` 모양

- **수정:** CSS `fieldset:disabled` 선택자로 비활성 모양을 맞췄다.
- **새로 찾은 버그:** Slider 는 `fieldset disabled` 안에서도 키보드로 값이 바뀌고, FileUpload 는 끌어다 놓기가 막히지 않았다. `utils/useFieldsetDisabled.ts` 로 고쳤다. 점검 문서의 "입력은 실제로 막힘" 은 이 둘에는 틀린 내용이었다.

## 3. 2.0 에 묶을 변경 (major)

항목마다 [`MIGRATION-2.0.md`](MIGRATION-2.0.md) 를 갱신한다. **시각 회귀 기준 이미지 전체 갱신 필요.**

| 항목 | 내용 | 비고 |
|---|---|---|
| S12 입력 칸 테두리 | 기본 대비 1.3:1 → 3:1 이상 | ✅ 2026-11-04. `border.input`·`inputHover`·`control` 을 tokens 기본값으로(`SemanticColors` 에서는 선택 키라 tokens 는 minor), `strongInputBorders` deprecated, 스토리 `InputBorders`(1.x 와 비교) |
| S13 CSS `@layer` | `styles.css` 를 `@layer bestow` 로 감싸기 | ✅ 2026-11-04. `styles/cssLayer.ts`(앞에 `@layer base, bestow;` — Tailwind v4 preflight 는 순서와 관계없이 BestOW 보다 약함), tsup·Storybook 같은 함수, 가이드 `Guides/Tailwind 와 함께 쓰기`, 스토리 `CssLayer`·E2E `css-layer.spec.ts` |
| S14 `as` 다형성 타입 | `as="time"` 의 `dateTime` 등 | ✅ 2026-11-04. `utils/polymorphic.ts` — `as` 가 있을 때만 정확한 타입, 맞지 않으면 1.x 타입으로 물러나 **호환성 깨짐 없음(react minor)**. props 인터페이스·docgen 결과 그대로 |
| S15 비활성 투명도 | 0.4·0.5·0.6 통일 | ✅ 2026-11-04. 0.5 + 토큰 `opacity.disabled`(`--bestow-opacity-disabled`), 15개 컴포넌트, `test/disabled-opacity.test.ts` 가 숫자 직접 적기를 막음. FileUpload 는 그대로 |

## 4. 재발 방지

- **S16 폼 공통 계약 테스트:** ✅ `src/test/form-contract.test.tsx`. 22개 컴포넌트의 `form.reset`·`fieldset disabled` 를 검사하고, `name` prop 이 있는 컴포넌트가 표에서 빠지면 실패한다. Select 는 Radix 가 처리해 수정 없이 통과했다. `fieldset disabled` 는 모두 통과했다.
- **S17 실제 브라우저 IME E2E:** ✅ `keyboard.spec.ts` 에 추가(Chromium 만, CDP `Input.imeSetComposition`). Safari·Firefox 는 단위 테스트로 조건만 확인한다.
- **S18 커버리지 측정:** ✅ `pnpm test:coverage`, CI 의 Test 단계에서 실패 기준 없이 보고만 한다. 처음 값(단위 테스트만, 스토리 제외): react 줄 96.5%·분기 90.9%, korean-utils 줄 100%·분기 98.9%.
- **S19 누락 테스트:** ✅ `VisuallyHidden`·`Input` 전용 테스트, 커버리지가 낮던 `addressProviders`(13%)·`en`·`useTableSelection` 테스트 추가. 이때 카카오 스크립트를 받았지만 서비스가 없을 때 다시 시도하지 못하던 버그를 찾아 고쳤다.

## 5. 사람이 확인할 것

- [ ] `ResidentNumberInput` VoiceOver·NVDA 점검 (ROADMAP "사람이 할 일").
- [ ] iOS Safari·Android Chrome 에서 가상 키보드가 Modal·Drawer 입력을 가리는지.
- [x] 8단계 전에 2.0 범위와 출시 시점 확정 (2026-11-04: S12~S15 네 가지 모두, 런칭 전 출시. Alert 기본 color 는 제외).

## 런칭 전 완료 조건

- [ ] 1~7단계 완료, main CI 녹색.
- [ ] 2.0 배포 또는 범위 재결정.
- [ ] 위 "사람이 확인할 것" 완료.
- [ ] 2.0 까지 나온 뒤 README 비교표·메인 문구 갱신 (Vapor UI·HANUI 포함, 경쟁 정보는 공식 문서로 재확인).

## 작업 시 주의

- 각 수정은 구현을 일부러 망가뜨려 테스트가 실패하는지 확인한다(복원은 scratchpad 백업 복사로만).
- 커서·IME 처럼 jsdom 이 실제와 다른 동작은 스토리 `play` 나 E2E 로 확인한다.
- 공개 동작을 바꾸면 `.changeset/*.md` 를 추가한다. korean-utils 를 고치면 react 도 함께 patch 한다.
- 접근성 동작이 바뀌면 `componentA11y.ts`·`kwcag.ts` 를 고친다.
