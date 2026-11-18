# 한국 키트 강화 계획 (초성 검색 · 빠른 금액 · 약관 하위 항목)

> **실행하는 쪽(사람·에이전트)에게:** 작업(Task)을 순서대로 하나씩 진행한다. 단계는 체크박스(`- [ ]`)로 표시한다.
> 작업 하나가 끝날 때마다 검증 → 사용자에게 커밋 요청 → **커밋된 것을 확인한 뒤** 다음 작업으로 넘어간다(Claude 는 커밋·push 하지 않는다).
> 작업 규칙·함정은 [`CLAUDE.md`](../CLAUDE.md). 이 문서는 내부 문서라 `context7.json` 의 제외 목록에 넣었다.

**목표:** 새 컴포넌트를 만들지 않고, 이미 있는 한국 키트 셋을 한국 서비스 화면에서 자주 쓰는 동작으로 강화한다.
- Combobox 의 초성 검색(`ㄱㅁ` → 국민은행)과 한글 조합 중 검색 끊김 해소
- AmountInput 의 빠른 금액 버튼(+1만·+5만·+10만·전액)
- AgreementGroup 의 하위 항목(마케팅 수신 → 문자·이메일·푸시)

**구조:**
- 초성 검색은 `@bestow-ui/korean-utils` 의 순수 함수 두 개로 만든다. react 는 이 함수를 Combobox·MultiCombobox 의 기본 필터로 쓰고, 같은 이름으로 다시 export 한다.
- 빠른 금액은 AmountInput 의 prop 두 개로 넣는다.
- 하위 항목은 `AgreementItem.children` 한 단계로만 받는다.
- 셋 다 기존 prop·동작을 그대로 두는 확장이라 react minor, korean-utils minor(0.x)다.

**기술:** TypeScript, React, vanilla-extract, Vitest + Testing Library, Storybook play, Playwright E2E.

**근거:** 2026-11-18 조사.
- Combobox 기본 필터는 `label.toLowerCase().includes(query)` 하나다(`useComboboxList.ts:5`). 그래서 초성으로 찾을 수 없다.
- 한글을 입력하는 도중(`국미`)에는 `국민은행` 이 목록에서 사라진다.
- AmountInput 에는 금액 버튼이 없다.
- AgreementGroup 의 `items` 는 한 단계뿐이다.
- 한국 키트 크기 조합은 30.98 / 33.5 kB 다(여유 약 2.5 kB).

**배포:** 12/3(목) 정기 배포일을 목표로 한다.

## 하지 않을 것

- 조사 붙이기·금액 한글 글자 표기 같은 korean-utils 함수 추가는 하지 않는다. 컴포넌트와 연결되지 않으면 `es-hangul` 과 다를 게 없다.
- 하위 항목을 두 단계 이상으로 만들지 않는다. 하위 항목에는 `content`(약관 펼치기)·`required` 를 따로 두지 않는다. 필수 여부는 부모를 따른다.
- 빠른 금액 버튼의 글자를 바꾸는 prop 은 만들지 않는다. 글자는 `+${formatKoreanAmount(n, '')}` 로 고정한다. "전액" 만 문구 키로 바꿀 수 있게 한다.
- 초성 검색을 끄는 옵션은 만들지 않는다. 이미 있는 `filter` prop 으로 바꿀 수 있다.

## 전체 제약

- 스타일 값은 `vars` 로만 쓴다. 비활성 투명도는 `vars.opacity.disabled` 를 쓴다.
- 새 문구는 `useMessages()` 를 거쳐 `prop ?? m.키 ?? '한국어 기본값'` 으로 쓴다. 새 키는 `BestowMessages` 에 **선택(`?`)** 으로 넣고 `en` 에도 넣는다.
- korean-utils 는 의존성이 없어야 한다. 공개 이름 목록 `src/index.test.ts` 와 react `shared.ts` 의 다시 export 를 함께 고친다.
- `shared.test.ts` 는 react 쪽 이름이 korean-utils 와 같은 함수인지 확인한다.
- 접근 가능한 이름은 화면 글자를 포함해야 한다. 예를 들어 "+1만" 버튼의 이름은 "+1만" 으로 시작한다.
- 크기 조합 "한국 키트" 33.5 kB 를 넘지 않는다. 넘으면 원인부터 찾고, 한도는 사용자와 정한다.
- 공개 API 를 더했으니 changeset 을 만든다. `docs/ai/bestow-ui.md` 에 새 이름을 적는다(dist export 와 대조됨).
  context7 rules 는 255자를 넘지 않을 때만 고친다.
- 새 스토리는 시각 회귀 기준 이미지가 **새로** 생긴다(main push 때 자동). 기존 스토리 화면은 바뀌지 않아야 한다.

## 리뷰 초점 (각 항목의 테스트는 맡은 Task 에 넣었다)

1. **제어 모드 AmountInput 에서 빠른 금액 누르기**: 값을 직접 바꾸지 않고 `onValueChange(현재 + n)` 만 부른다. 부모가 무시하면 화면도 그대로다(Task 2).
2. **값이 비었을 때(null) 빠른 금액**: 0 에 더한다. `max` 를 넘으면 `max` 로 맞춘다(Task 2).
3. **`form.reset()` · `fieldset disabled`**: 하위 항목이 있는 AgreementGroup 이 reset 때 처음 값으로 돌아가는지 확인한다. 빠른 금액 버튼은 비활성 fieldset 에서 눌리지 않아야 한다(Task 2·3, `form-contract.test.tsx`).
4. **하위 항목 value 와 부모 value 가 섞인 옛 값**: 하위 항목이 있는 부모의 value 가 `value` 배열에 들어와도 무시한다. 출력에는 넣지 않는다(Task 3).
5. **영문 대소문자·공백·라틴 섞인 이름**: `KB국민은행` 을 `kb`·`ㄱㅁ`·`국민` 으로 찾을 수 있다. 빈 검색어나 공백만 있는 검색어는 모두 맞는다(Task 1).

---

### Task 1: 초성 검색 — korean-utils 함수 + Combobox 기본 필터

**Files:**
- Create: `packages/korean-utils/src/hangul.ts`, `packages/korean-utils/src/hangul.test.ts`
- Modify: `packages/korean-utils/src/index.ts`, `packages/korean-utils/src/index.test.ts`, `packages/korean-utils/README.md`(함수 목록)
- Modify: `packages/react/src/shared.ts`(다시 export), `packages/react/src/shared.test.ts`(같은 함수 확인 목록이 있으면)
- Modify: `packages/react/src/components/Combobox/useComboboxList.ts:5-6`(`defaultComboboxFilter`), `Combobox.tsx`·`MultiCombobox.tsx` 의 `filter` JSDoc
- Test: `packages/react/src/components/Combobox/Combobox.test.tsx`, `Combobox.stories.tsx`(스토리 `ChoseongSearch`)
- Docs: `apps/site/app/korean-utils/guides.ts`(새 쪽 `hangul-search`, `guideDates.modified` 를 작업한 날로), `docs/ai/bestow-ui.md`, `apps/storybook/stories/accessibility/componentA11y.ts`(Combobox 항목에 초성·조합 중 검색 한 줄)

**Interfaces:**
- Produces: `getChoseong(text: string): string`, `matchesKorean(target: string, query: string): boolean`. 둘 다 korean-utils 와 react 에서 export 한다.
- Produces: `defaultComboboxFilter(option, query) = matchesKorean(option.label, query)`

- [ ] **Step 1: 실패하는 테스트 작성** — `hangul.test.ts`

```ts
it('getChoseong', () => {
  expect(getChoseong('국민은행')).toBe('ㄱㅁㅇㅎ');
  expect(getChoseong('KB국민 1')).toBe('KBㄱㅁ 1'); // 한글 음절이 아니면 그대로
  expect(getChoseong('까치')).toBe('ㄲㅊ');
});
it.each([
  ['KB국민은행', 'ㄱㅁ', true],
  ['KB국민은행', 'kb', true],
  ['KB국민은행', '국민', true],
  ['KB국민은행', '  ', true],      // 공백만 = 모두 맞음
  ['KB국민은행', '국ㅁ', true],    // 음절 + 초성 섞기
  ['KB국민은행', '국미', true],    // 조합 중: 마지막 음절은 받침 없이 초·중성만 맞으면 됨
  ['하나은행', '한', true],        // 조합 중: 마지막 음절의 받침이 다음 글자의 초성
  ['하나은행', '한ㅇ', false],     // 마지막이 아니면 받침 규칙을 쓰지 않음
  ['까치', 'ㄱ', false],           // 쌍자음은 따로
  ['신한은행', 'ㅅㅎ', true],
  ['신한은행', 'ㅎㅅ', false],
  ['우리은행', '국민', false],
])('matchesKorean(%s, %s) = %s', (target, query, expected) => {
  expect(matchesKorean(target, query)).toBe(expected);
});
```

- [ ] **Step 2: 실패 확인** — `pnpm --filter @bestow-ui/korean-utils test hangul` → import 오류로 FAIL

- [ ] **Step 3: `hangul.ts` 구현**
  - 음절 범위는 `U+AC00–U+D7A3` 이다. 초성 = `⌊(c−0xAC00)/588⌋`, 중성 = `⌊(c−0xAC00)%588/28⌋`, 받침 = `(c−0xAC00)%28` 이다.
  - 초성 호환 자모는 `'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'` 이다.
  - 받침 → 호환 자모 표는 `['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']` 이다.
  - `matchesKorean` 은 query 를 `trim()` 한 뒤 둘 다 `toLowerCase()` 하고, target 의 각 시작 위치에서 query 글자를 차례로 비교한다. 한 글자가 맞는 조건은 다음 중 하나다.
    1. 두 글자가 같다.
    2. query 글자가 초성 호환 자모(ㄱ–ㅎ)이고, target 글자의 초성과 같다.
    3. **query 의 마지막 글자이고**, 받침 없는 음절이며, target 음절과 초성·중성이 같다.
    4. **query 의 마지막 글자이고**, 받침이 있는 음절이며, target 음절은 초성·중성이 같고 받침이 없다. 그리고 target 의 다음 글자 초성이 그 받침과 같다(이때 target 을 한 글자 더 읽는다).

- [ ] **Step 4: 통과 확인** — `pnpm --filter @bestow-ui/korean-utils test` PASS. `index.ts` export 와 `index.test.ts` 이름 목록에 `getChoseong`·`matchesKorean` 을 더한 뒤 다시 PASS.

- [ ] **Step 5: Combobox 테스트 추가(실패)** — `Combobox.test.tsx`
  - `'초성으로 찾는다'`: 은행 목록에 `ㄱㅁ` 을 입력하면 option `KB국민은행` 이 보이고 `신한은행` 은 없다.
  - `'조합 중인 글자로도 목록이 남는다'`: `국미` 를 입력해도 `KB국민은행` 이 보이고 "결과가 없어요" 가 없다.
  - `'filter prop 이 기본 필터를 대신한다'`: 기존 테스트가 있으면 그대로 둔다.
  - MultiCombobox 에도 초성 테스트를 하나 둔다.

- [ ] **Step 6: `defaultComboboxFilter` 를 `matchesKorean` 으로 바꾸고 통과 확인** — `pnpm --filter @bestow-ui/react test Combobox` PASS
  - 변이 확인: 규칙 3 을 지우면 `국미` 테스트가 실패해야 한다. 복원은 scratchpad 백업 파일 복사로만 한다.

- [ ] **Step 7: react 다시 export** — `shared.ts` 의 korean-utils export 묶음에 두 이름을 더한다.
  - `pnpm --filter @bestow-ui/react test shared` PASS 를 확인한다.

- [ ] **Step 8: 스토리·문서**
  - `Combobox.stories.tsx` 에 `ChoseongSearch` 를 만든다. play 에서 `ㄱㅁ` 을 입력하고 목록 option 을 `toBeInTheDocument()` 로 확인한다.
  - `guides.ts` 에 `hangul-search` 쪽을 더한다.
    - 코드 예시는 `matchesKorean('KB국민은행', 'ㄱㅁ'); // true` 형식이다. E2E 가 이 줄을 계산해 비교한다.
    - Combobox 는 키트 쪽이 아니라 `component` 를 비운다. Storybook 링크는 본문에 둔다.
  - `docs/ai/bestow-ui.md` 에 두 함수와 "Combobox 는 초성 검색이 기본" 한 줄을 더한다.
  - korean-utils README 함수 목록, componentA11y Combobox 줄도 고친다.

- [ ] **Step 9: changeset** — `.changeset/korean-choseong-search.md`

```md
---
"@bestow-ui/korean-utils": minor
"@bestow-ui/react": minor
---

초성 검색 함수 `getChoseong`·`matchesKorean` 추가. Combobox·MultiCombobox 의 기본 필터가 초성(`ㄱㅁ` → 국민은행)과 입력 중인 한글(`국미` → 국민)도 찾는다.
```

- [ ] **Step 10: 검증 → 사용자에게 커밋 요청 → 커밋 확인**
  - CLAUDE.md "검증" 전체를 돌린다(site E2E 에 새 guides 쪽이 들어간다).
  - 추천 메시지: `✨ 초성 검색(getChoseong·matchesKorean)과 Combobox 초성·조합 중 검색`

---

### Task 2: AmountInput 빠른 금액 버튼

**Files:**
- Modify: `packages/react/src/components/AmountInput/AmountInput.tsx`, `AmountInput.css.ts`
- Modify: `packages/react/src/i18n/LocaleProvider.tsx`(`BestowMessages` 에 `quickAmounts?`·`maxAmount?`), `packages/react/src/i18n/en.ts`
- Test: `AmountInput.test.tsx`, `AmountInput.stories.tsx`(`QuickAmounts`), `packages/react/src/test/form-contract.test.tsx`(빠른 금액 있는 경우 disabled)
- Docs: `apps/site/app/components/kit.ts`(amount-input 쪽 코드·notes, `kitDates.modified` 를 작업한 날로), `componentA11y.ts`(AmountInput 줄), `docs/ai/bestow-ui.md`
- Playground: `apps/playground/app/interactive/page.tsx` 의 AmountInput 에 `quickAmounts` 를 넣는다. E2E `keyboard.spec.ts` 에 "Tab 으로 +1만 → Enter → 값 10,000" 을 더한다.

**Interfaces:**
- Consumes: 기존 `formatKoreanAmount`, `useDelayedAnnouncement`, `Button`
- Produces: `AmountInputProps.quickAmounts?: number[]`(누를 때마다 더할 금액), `AmountInputProps.showMaxButton?: boolean`(`max` 가 있을 때만 "전액" 버튼을 그림)
- Produces: `BestowMessages.quickAmounts?: string`(묶음 이름, 기본 '빠른 금액', en 'Quick amounts'), `BestowMessages.maxAmount?: string`(기본 '전액', en 'Max')

- [ ] **Step 1: 실패하는 테스트 작성** — `AmountInput.test.tsx`
  - `'빠른 금액 버튼이 금액을 더한다'`: `quickAmounts={[10000, 50000]}` 에서 "+1만" 을 두 번, "+5만" 을 한 번 누르면 `onValueChange` 가 차례로 `10000`·`20000`·`70000` 으로 불리고, 입력값은 `'70,000'` 이다.
  - `'max 를 넘으면 max 로 맞춘다'`: `max={30000}`·`defaultValue={25000}` 에서 "+1만" → `30000` 이다.
  - `'전액은 max 로 바꾼다'`: `max={500000} showMaxButton` 에서 "전액" → `500000` 이다. `max` 가 없으면 "전액" 버튼이 없다.
  - `'제어 모드는 부모 값만 바꾼다'`: `value={1000}` 이고 onValueChange 가 아무것도 하지 않을 때 "+1만" → 호출 인자 `11000`, 입력값은 그대로 `'1,000'` 이다.
  - `'빈 값에서 더한다'`: `value={null}` 에서 "+1만" → `10000` 이다.
  - `'버튼 묶음과 이름'`: `getByRole('group', { name: '빠른 금액' })` 안에 `button` "+1만" 이 있고 `type="button"` 이다.
  - `'disabled 면 버튼도 비활성'`
  - `'누른 뒤 합계를 status 로 알린다'`: fake timer 로 800ms 를 진행하면 `role="status"` 에 `'7만원'` 이 들어 있다.
  - `'quickAmounts 가 없으면 예전과 같은 DOM'`: 그룹이 없고 루트가 TextField 의 div 다(스냅숏 대신 `container.firstChild` 의 class 비교).

- [ ] **Step 2: 실패 확인** — `pnpm --filter @bestow-ui/react test AmountInput` FAIL

- [ ] **Step 3: 구현**
  - `quickAmounts` 가 있거나 `showMaxButton && max !== undefined` 일 때만 `<div className={styles.root}>` 로 감싼다. 안에는 TextField, `role="group" aria-label={그룹 이름}` 버튼 줄, `role="status"` 시각 숨김 영역이 들어간다. 없으면 지금 JSX 를 그대로 반환한다.
  - `fullWidth` 는 감싼 div 에도 적용한다.
  - 버튼은 `<Button size="sm" variant="outline" color="neutral" type="button">`, 글자는 `+${formatKoreanAmount(n, '')}` 다.
  - 누르면 `sanitize(String(현재 raw 숫자 + n))` 결과로 값을 바꾼다. 비제어 모드는 내부 값을 고치고, 두 모드 모두 `onValueChange` 를 부른다.
    - `useFormattedInput` 에 값을 직접 넣는 방법이 없으면, 그 hook 에 `setRaw(next: string)` 을 더한다(내부용, 커서 처리 없음).
  - 알림 문구는 누를 때 `formatKoreanAmount(next, unit)` 으로 상태에 넣고, 키보드로 입력하면 `''` 로 비운다. `useDelayedAnnouncement` 로 늦춰 status 에 넣는다.
  - 스타일: 버튼 줄은 `display:flex; flex-wrap:wrap; gap: vars.space[2]; margin-top: vars.space[2]`. 320px 에서 줄바꿈된다.

- [ ] **Step 4: 통과 확인** — `pnpm --filter @bestow-ui/react test AmountInput form-contract ssr` PASS
  - 변이 확인: `max` 맞추기(sanitize 거치기)를 빼면 max 테스트가 실패해야 한다.

- [ ] **Step 5: 스토리·문서·playground**
  - `QuickAmounts` 스토리: `quickAmounts={[10000, 50000, 100000]} max={1000000} showMaxButton`.
  - kit.ts 의 amount-input 쪽 code 에 `quickAmounts` 예시를 넣고, notes 에 "누른 뒤 합계를 스크린리더에 알려요" 를 넣는다.
  - componentA11y 를 고친다.
  - playground interactive 와 keyboard E2E(`--repeat-each 5`)를 더한다.

- [ ] **Step 6: changeset** — `.changeset/amount-quick-buttons.md`(`"@bestow-ui/react": minor`)
  - 내용: "AmountInput `quickAmounts`·`showMaxButton` — +1만·전액 같은 빠른 금액 버튼"

- [ ] **Step 7: 검증 → `pnpm size` 로 한국 키트 조합 확인(33.5 kB 이하) → 사용자에게 커밋 요청 → 커밋 확인**
  - 추천 메시지: `✨ AmountInput 빠른 금액 버튼(quickAmounts·showMaxButton)`

---

### Task 3: AgreementGroup 하위 항목

**Files:**
- Modify: `packages/react/src/components/AgreementGroup/agreements.ts`(타입·`hasAllRequiredAgreements`), `AgreementGroup.tsx`, `AgreementGroup.css.ts`
- Test: `AgreementGroup.test.tsx`, `agreements` 함수 테스트(있는 파일에), `AgreementGroup.stories.tsx`(`NestedItems`), `form-contract.test.tsx`(하위 항목 있는 경우 reset)
- Docs: `kit.ts` agreement-group 쪽(code 의 마케팅 항목을 하위 항목 예로, notes 한 줄, `kitDates.modified`), `componentA11y.ts`, `docs/ai/bestow-ui.md`
- Playground: `apps/playground/app/signup/page.tsx` 의 마케팅 항목을 하위 항목으로 바꾸고, 그 화면 E2E 가 있으면 "마케팅을 누르면 세 채널이 켜진다" 를 더한다.

**Interfaces:**
- Produces: `AgreementSubItem { value: string; label: ReactNode }`(export), `AgreementItem.children?: AgreementSubItem[]`
- 규칙:
  - 하위 항목이 있는 부모의 `value` 는 키·id 로만 쓴다. `value` 배열·`onValueChange`·hidden input 에는 **하위 항목 value 만** 나간다.
  - 부모 체크는 하위 항목이 모두 동의면 checked, 일부면 indeterminate 다.
  - "전체 동의" 는 모든 말단(하위 항목이 없는 항목과 하위 항목)을 기준으로 한다.
  - `hasAllRequiredAgreements` 에서 필수 부모는 하위 항목이 모두 동의해야 충족된다.

- [ ] **Step 1: 실패하는 테스트 작성**
  - 공통 데이터: `items = [terms(required), { value: 'marketing', label: '마케팅 정보 수신 동의', children: [{value:'sms',label:'문자'},{value:'email',label:'이메일'},{value:'push',label:'앱 푸시'}] }]`
  - `'부모를 누르면 하위 항목이 모두 켜진다'`: "선택 마케팅 정보 수신 동의" 체크 → `onValueChange(['sms','email','push'])`(순서 무관 `arrayContaining` + 길이 3).
  - `'하위 항목 일부만 켜면 부모는 부분 선택'`: "문자" 만 켜면 부모 체크박스 `indeterminate === true`, 전체 동의도 indeterminate 다.
  - `'전체 동의는 말단 value 만 낸다'`: 전체 동의 → `['terms','sms','email','push']`(marketing 없음).
  - `'옛 값에 부모 value 가 있어도 무시'`: `defaultValue={['marketing']}` → 부모 unchecked, `name="agree"` hidden input 은 0개다.
  - `'하위 항목 목록의 이름'`: `getByRole('list', { name: '선택 마케팅 정보 수신 동의' })` 안에 checkbox 3개가 있다. 하위 항목 이름에는 "필수/선택" 이 붙지 않는다.
  - `hasAllRequiredAgreements`:
    - 필수 부모 + 하위 2개 중 하나만 동의 → false, 둘 다 → true.
    - 하위 항목 없는 기존 동작은 그대로다(기존 테스트 유지).

- [ ] **Step 2: 실패 확인** — `pnpm --filter @bestow-ui/react test AgreementGroup` FAIL

- [ ] **Step 3: 구현**
  - `agreements.ts` 에 `leafValues(items): string[]` 내부 함수를 둔다. 하위 항목이 있으면 그 value 들, 없으면 자기 value 다.
  - `AgreementGroup.tsx`:
    - `allValues` 를 `leafValues` 로 바꾼다.
    - `agreed` 는 말단 value 로 걸러 쓴다. 옛 값의 부모 value 는 무시하고, 출력할 때도 걸러낸다.
    - 부모 Checkbox 의 onChange 는 하위 value 를 모두 더하거나 뺀다.
    - 부모 `li` 안에 `<ul aria-labelledby={labelId} className={styles.subList}>` 를 두고, 하위 항목마다 `Checkbox size="sm"` 을 태그 없이 그린다.
    - error 일 때 필수 부모의 동의하지 않은 하위 항목은 `invalid` 다.
    - `AgreementSubItem` 타입은 `AgreementItem` 과 같은 줄(`packages/react/src/shared.ts:56`)에서 export 한다.
  - 스타일: `subList` 는 `paddingInlineStart` 를 Checkbox 컨트롤 너비 + 간격만큼(`vars.space.*`), 간격 `vars.space[2]`.

- [ ] **Step 4: 통과 확인** — `pnpm --filter @bestow-ui/react test AgreementGroup agreements form-contract ssr react-hook-form` PASS
  - 변이 확인: 출력에서 부모 value 거르기를 빼면 "전체 동의는 말단 value 만" 이 실패해야 한다.

- [ ] **Step 5: 스토리·문서·playground**
  - `NestedItems` 스토리를 더한다.
  - kit.ts code 예시의 marketing 을 하위 항목으로 바꾸고, notes 에 "하위 항목이 있는 부모의 value 는 값에 들어가지 않아요" 를 넣는다.
  - componentA11y(하위 목록 이름·부분 선택)를 고친다.
  - playground signup 과 E2E 를 고친다.

- [ ] **Step 6: changeset** — `.changeset/agreement-sub-items.md`(`"@bestow-ui/react": minor`)
  - 내용: "AgreementGroup 하위 항목(`children`) — 마케팅 수신 동의를 문자·이메일·푸시로 나눠 받기"

- [ ] **Step 7: 검증 → `pnpm size` → 사용자에게 커밋 요청 → 커밋 확인**
  - 추천 메시지: `✨ AgreementGroup 하위 항목(마케팅 수신 채널별 동의)`

---

### Task 4: 마무리 기록

- [ ] ROADMAP 을 고친다.
  - 인수인계 "지금 상태" 에 12/3 배포 예정 내용을 적는다.
  - "진행 기록" 에 한 줄을 더한다.
  - 이 문서 맨 위에 "끝" 표시를 한다.
- [ ] 시각 회귀를 확인한다.
  - 새 스토리 3개(`ChoseongSearch`·`QuickAmounts`·`NestedItems`)의 라이트·다크 기준 이미지가 main push 때 자동 생성되는지 본다.
  - 기존 스토리는 바뀌지 않아야 한다. 바뀌면 원인부터 찾는다.
- [ ] 사용자에게 커밋 요청: `📝 ROADMAP 에 한국 키트 강화(초성 검색·빠른 금액·약관 하위 항목) 기록`
