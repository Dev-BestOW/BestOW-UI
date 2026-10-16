# 0.x → 1.0 마이그레이션 가이드

1.0 에서는 0.x 동안 생긴 이름 불일치를 정리했어요. **0.12.0** 에서 새 이름을 먼저 추가하고 옛 이름은 그대로 동작하면서
**개발 모드 콘솔에 한 번 경고**(`[BestOW UI] … deprecated …`)를 띄웠고, **1.0.0** 에서 옛 이름을 제거했어요.

**권장 순서:** 0.12.0 으로 올린다 → 콘솔 경고와 TypeScript 의 `@deprecated` 취소선을 보며 아래 표대로 바꾼다 → 1.0 으로 올린다.
(바로 1.0 으로 올려도 돼요 — 옛 이름은 모두 TypeScript 오류로 드러나요.)

`@bestow-ui/tokens` 도 1.0.0 이 돼요(코드 변경 없음, 이름 안정화). `@bestow-ui/icons` 는 0.x 를 유지해요.

## 바뀌는 이름

| 대상 | 0.x (0.12.0 에서 deprecated) | 1.0 | 이유 |
| --- | --- | --- | --- |
| `toast()` 옵션 | `variant: 'default' \| 'success' \| 'warning' \| 'danger'` | `color: 'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | 의미 색은 모든 컴포넌트에서 `color`, 중립은 `'neutral'` |
| `DropdownMenuItem` | `color="default"` | `color="neutral"` (기본값이라 생략해도 됨) | 중립 색 이름 통일 |
| `Spinner` | `color="current"` | `color="inherit"` (기본값이라 생략해도 됨) | 부모 글자색 이름 통일 (Link·Typography 의 `inherit`) |
| `usePortalClassName()` | `usePortalClassName()` | `usePortalProps()` 의 `className`·`style` | 테마 오버라이드까지 portal 에 적용 |

```tsx
// 0.x
toast({ title: '저장했어요', variant: 'success' });
toast({ title: '알림', variant: 'default' });
<DropdownMenuItem color="default">복제</DropdownMenuItem>
<Spinner color="current" />

// 1.0
toast({ title: '저장했어요', color: 'success' });
toast({ title: '알림' }); // color 기본값 neutral
<DropdownMenuItem>복제</DropdownMenuItem>
<Spinner />
```

한 번에 찾기: `grep -rnE "variant: '(default|success|warning|danger)'|color=\"(default|current)\"|usePortalClassName" src`
(`variant:` 는 Toast 외의 객체에도 걸릴 수 있으니 `toast(` 호출인지 확인하세요.)

## 0.12.0 에서 추가된 것 (바꿀 필요 없음)

- `Checkbox` 의 `onCheckedChange(checked: boolean)` — Switch 와 같은 이름. 기존 `onChange` 도 계속 지원해요.
- 타입: `AlertColor`, `ToastColor`, `ToastContextValue`, `TableSize`, `TableAlign`.

## 바꾸지 않기로 한 것 (의도된 차이)

1.0 감사에서 검토했지만 이유가 있어 그대로 두는 것들이에요.

- **size 스케일** — 버튼·입력처럼 높이가 중요한 컴포넌트는 `sm`/`md`/`lg`, 작은 컨트롤(Checkbox·RadioGroup·Switch·Slider)과
  밀도 조절용(Tabs·Table·Pagination)은 `sm`/`md`.
- **이벤트 이름** — 값을 고르는 컴포넌트는 `onValueChange`, 켜고 끄는 것은 `onCheckedChange`, 열고 닫는 것은 `onOpenChange`,
  Pagination 은 값이 페이지라 `page`/`onPageChange`. 네이티브 input 기반 컴포넌트는 `onChange` 도 그대로 받아요.
- **`invalid` vs `error`** — 단독 컨트롤(Input·Checkbox)은 `aria-invalid` 만 거는 `invalid`, 레이블·도움말을 가진 필드
  (TextField·Select 등)는 도움말 색까지 바꾸는 `error`.
- **Slider 값은 배열** — 범위 슬라이더(손잡이 2개)를 같은 컴포넌트로 지원하기 때문이에요.
- **ref 대상** — 입력 하나짜리 필드는 실제 컨트롤(`input`·`button`), 여러 컨트롤을 묶는 그룹(RadioGroup·AgreementGroup·AddressInput·Slider)은 바깥 요소.
- **Button·IconButton 의 color** — primary/neutral/danger 만. 성공·경고는 행동 버튼보다 상태 표시(Alert·Badge·Toast)에 쓰는 색이라서예요.
  필요해지면 1.0 이후에 추가해도 breaking 이 아니에요.
