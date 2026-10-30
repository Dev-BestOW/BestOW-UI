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
| `fieldset disabled` 동작 | 입력이 실제로 막힘 (모양 문제는 S11) |

## 작업 순서

| 단계 | 항목 | 버전 |
|---|---|---|
| 1 | [x] S1 + S17 Combobox IME 와 브라우저 E2E (2026-10-30) | react patch |
| 2 | [ ] S2 + S16 form.reset 과 폼 공통 계약 테스트 | react patch |
| 3 | [ ] S3~S5 korean-utils 서식·검증 | korean-utils·react patch |
| 4 | [ ] S6~S7 Stepper 간격, SkipLink 그림자 | react patch |
| 5 | [ ] S8 `asChild` (번들 한도 결정 필요) | react minor |
| 6 | [ ] S9~S11 Stepper 진행 중, 마스킹 기준, fieldset 모양 | react·korean-utils minor |
| 7 | [ ] S18~S19 커버리지 측정, 누락 테스트 | 배포 없음 |
| 8 | [ ] S12~S15 2.0 | react·tokens major |

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
- **미확인:** BusinessNumberInput 은 같은 훅이라 같을 것으로 본다. Combobox·NumberInput·ResidentNumberInput·VerificationCodeInput·AgreementGroup·CheckboxGroup·FileUpload·Select 는 S16 으로 확인한다.
- **방향:** `Switch` 의 방식을 참고해 가장 가까운 form 의 `reset` 이벤트를 구독하고 비제어 모드에서 `defaultValue` 로 되돌린다. 제어 모드는 값 소유자가 맡는다.
  DatePicker 는 훅에 `isControlled: false` 를 넘기므로 따로 처리하고 `touched` 도 지운다.
- **완료 기준:** S16 계약 테스트 통과, 변이 확인.

### S3. `0507` 번호 서식 오류

- **위치:** `packages/korean-utils/src/koreanFormat.ts:18`
- **재현:** `formatPhoneNumber('050712345678')` → `050-7123-4567`. 기대값 `0507-123-4567`.
- **완료 기준:** 12자리 `050x` 안심번호 테스트 추가. `maskPhoneNumber` 결과도 확인한다(같은 함수를 쓴다).

### S4. `+82` 번호 깨짐

- **위치:** 같은 함수, PhoneNumberInput 의 sanitize.
- **재현:** `formatPhoneNumber('+821012345678')` → `821-0123-4567`.
- **방향:** 숫자만 남기기 **전에** `+82` 를 `0` 으로 바꾼다. 숫자만 남긴 뒤에는 구분할 수 없다. 붙여 넣기·자동 완성 경로도 함께 확인한다.
- **완료 기준:** 하이픈·공백이 섞인 `+82 10-1234-5678` 포함 테스트, 입력창 붙여 넣기 테스트.

### S5. `0000000000` 사업자번호 통과

- **위치:** `packages/korean-utils/src/koreanFormat.ts:50`
- **재현:** `isValidBusinessNumber('0000000000')` → `true`.
- **완료 기준:** 모두 0 은 `false`. 기존 유효 번호 테스트는 그대로 통과.

### S6. 세로 Stepper 간격 불규칙

- **위치:** `packages/react/src/components/Stepper/Stepper.css.ts:71`. [`PILOT-FINDINGS.md`](PILOT-FINDINGS.md) 파일럿 2 버그.
- **증상:** 설명 없는 단계 52px, 있는 단계 68px.
- **완료 기준:** 스토리 `play` 로 실제 브라우저에서 원 사이 간격을 잰다. **시각 회귀 기준 이미지 갱신 필요.**

### S7. 숨긴 SkipLink 그림자 노출

- **위치:** `packages/react/src/components/SkipLink/SkipLink.css.ts`. 파일럿 2 버그.
- **방향:** 기본 스타일의 `boxShadow` 를 `:focus` 선택자로 옮긴다.
- **완료 기준:** 포커스 전 그림자 없음, 포커스 뒤 그림자 있음을 테스트로 확인.

## 2. 기능 공백 (minor)

### S8. `Button`·`IconButton` 의 `asChild`

- 서버 컴포넌트에서 Next `Link` 를 감싸는 버튼 모양 링크. `Link` 의 `asChild` 구현을 따른다.
- 링크일 때 `disabled`·`loading` 동작을 정해 문서에 적는다.
- **시작 전 결정:** "앱 기본" 이 4.09/4.1 kB, "Button 하나" 가 1.51/2 kB 다. Slot 을 넣으면 앱 기본 한도를 넘을 가능성이 커서, 측정값을 보고 **사용자와 한도를 정한다.**

### S9. Stepper 진행 중 상태

- 단계에 `loading` 또는 `status`(`complete`·`current`·`loading`·`error`) 추가. 스토리 "비동기 진행", 스크린리더 알림 방식도 함께 정한다.

### S10. 마스킹 함수의 인식 실패 처리

- 형식을 인식하지 못하면 원본을 돌려준다(`maskCardNumber('1234')` → `1234`, `maskName('김')` → `김`). 개인정보 함수는 실패할 때 가리는 쪽이 안전하다.
- 입력별로 기대 결과를 정한다. `15881234` 같은 대표번호는 개인정보가 아니므로 그대로 둘 수 있다. korean-utils 는 0.x 라 minor 로 바꿀 수 있다.

### S11. `fieldset disabled` 모양

- 입력은 막히지만 `data-disabled` 기준 스타일이 적용되지 않아 활성처럼 보인다. `:disabled` 선택자 추가 또는 상위 fieldset 감지 중 번들 영향이 작은 쪽을 고른다.

## 3. 2.0 에 묶을 변경 (major)

항목마다 [`MIGRATION-2.0.md`](MIGRATION-2.0.md) 를 갱신한다. **시각 회귀 기준 이미지 전체 갱신 필요.**

| 항목 | 내용 | 비고 |
|---|---|---|
| S12 입력 칸 테두리 | 기본 대비 1.3:1 → 3:1 이상 | MIGRATION-2.0 에 구현 절차 있음 |
| S13 CSS `@layer` | `styles.css` 를 `@layer bestow` 로 감싸기 | 사용자 리셋 CSS 가 컴포넌트 스타일을 이길 수 있어 major. "Tailwind 와 함께 쓰기" 문서 포함 |
| S14 `as` 다형성 타입 | `as="time"` 의 `dateTime` 등 | Stack·Card·Grid·Typography·Container·VisuallyHidden. 시작 전에 타입 호환성 확인 |
| S15 비활성 투명도 | 0.4·0.5·0.6 통일 | 토큰 추가 여부 함께 결정 |

## 4. 재발 방지

- **S16 폼 공통 계약 테스트:** 값을 받는 모든 폼 컴포넌트를 표로 두고 `form.reset`, `name` 제출, `fieldset disabled` 를 한 파일에서 검사한다. `ssr.test.tsx` 처럼 새 컴포넌트가 빠지지 않게 한다.
- **S17 실제 브라우저 IME E2E:** ✅ `keyboard.spec.ts` 에 추가(Chromium 만, CDP `Input.imeSetComposition`). Safari·Firefox 는 단위 테스트로 조건만 확인한다.
- **S18 커버리지 측정:** `@vitest/coverage-v8` 추가. 처음에는 CI 실패 기준 없이 보고만 한다.
- **S19 누락 테스트:** `VisuallyHidden` 테스트 파일 없음. `Input` 은 전용 테스트가 없어 TextField 테스트로 충분한지 확인한다.

## 5. 사람이 확인할 것

- [ ] `ResidentNumberInput` VoiceOver·NVDA 점검 (ROADMAP "사람이 할 일").
- [ ] iOS Safari·Android Chrome 에서 가상 키보드가 Modal·Drawer 입력을 가리는지.
- [ ] 8단계 전에 2.0 범위와 출시 시점 확정.

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
