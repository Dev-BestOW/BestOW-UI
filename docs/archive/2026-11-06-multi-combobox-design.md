# MultiCombobox (로드맵 6번 A — Combobox 다중 선택) 설계

2026-11-06. 6번을 A 다중 선택 → C Tag 입력 → B 비동기 검색으로 나눈 것 중 A. 사용자 결정: 칩은 입력창 안, 별도 컴포넌트 + 공용 내부 hook(①),
나머지는 Claude 추천대로(사용자 지시 "묻지 말고 추천대로").

## 목표

여러 값을 검색해서 고르는 칸. 고른 값은 입력창 안에 칩(Tag)으로, 빈 입력창에서 Backspace 로 마지막 칩을 지운다.
성공 기준은 다른 폼 컴포넌트와 같다 — 키보드·스크린리더로 쓸 수 있고, 폼 계약(reset·fieldset disabled·name 제출)·SSR·라이트/다크 axe 통과.

## 구조

- `Combobox/useComboboxList.ts`(내부) — 목록 상태(열림·검색어·활성 항목), 거르기, 이동(비활성 건너뜀), 활성 항목 스크롤,
  "결과가 없어요" 0.8초 지연 알림, 한글 조합 키 판별. `Combobox` 와 `MultiCombobox` 가 함께 쓴다.
- `Combobox/ComboboxListbox.tsx`(내부) — Popover Content + listbox 그리기(항목 스타일은 Select.css).
- `Combobox/MultiCombobox.tsx` — 공개. `Combobox/index.ts` 에서 export(client).
- 기존 `Combobox` 동작은 그대로(기존 테스트가 회귀를 잡는다).

## API

Combobox 와 같은 prop: `options`(ComboboxOption[])·`filter`·`emptyMessage`·`placeholder`·`label`·`helperText`·`error`·`size`·`fullWidth`·
`disabled`·`required`·`id`·`aria-label`·`toggleLabel`·`clearable`·`clearLabel`·`className`.

다른 것:
- `value?: string[]`·`defaultValue?: string[]`·`onValueChange?(values: string[])`. 칩은 고른 순서. `options` 에 없는 값도 칩으로 보인다(이름 = 값) — 비동기 검색(B) 대비.
- `name` — 값마다 hidden input 하나(`regions=seoul&regions=busan`).
- `maxSelected?: number` — 다 고르면 고르지 않은 항목은 aria-disabled(이동에서 건너뜀), 칸 아래에 "최대 n개까지 고를 수 있어요"(aria-describedby).
- `removeLabel?: (label) => string` — 칩 삭제 버튼 이름(기본 Tag 와 같은 `m.removeTag` → "서울 삭제").
- 새 문구(선택 키): `selectedOptions`("고른 항목" — 칩 목록 이름), `maxSelected(n)`. `en` 에도.

## 동작

- 항목을 고르면(Enter·클릭) 토글. 목록은 열린 채, 검색어만 비운다. listbox 에 `aria-multiselectable`.
- 빈 입력창(커서 맨 앞)에서 Backspace — 마지막 칩 삭제, 포커스는 입력창에.
- 칩 삭제 버튼은 Tab 순서에 있다(칩 → 입력창). 버튼에서 Enter·Space·Delete·Backspace 로 지우고, 포커스는 같은 자리 다음 칩 → 앞 칩 → 입력창.
- 지우면 "서울 삭제됨" 을 처음부터 있는 status 영역에 0.5초 뒤 넣는다(TagGroup 과 같은 이유 — 포커스 이동과 같은 순간이면 VoiceOver 가 버림).
- Esc·Tab·포커스 이탈 — 닫고 검색어를 비운다. 단일 Combobox 의 "글자를 다 지우고 닫으면 선택 해제" 는 없다(입력 글자는 검색어일 뿐).
- clearable "모두 지우기" — 마우스용(tabIndex -1, 키보드는 Backspace·칩 버튼), `onValueChange([])`.
- 칸 크기: 높이 고정 대신 minHeight(칩이 여러 줄로). 칩 크기 — 칸 sm·md 는 Tag sm·md, lg 는 Tag md.

## 테스트

- 단위: 토글·Backspace·칩 삭제 포커스·알림·maxSelected·clearable·제어/비제어·한글 조합 중 Enter 무시.
- form-contract(reset·disabled·제출, 비제어 reset 알림·제어 모드 무알림)·ssr.test.
- 스토리: Playground·기본값·최대 개수·오류·비활성·Open(play 로 연 상태 — axe). E2E: playground 에서 키보드로 고르고 Backspace 로 지우기.
- 문서: componentA11y·README 표·Guides 선택 기준·changeset(react minor).
