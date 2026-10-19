# BestOW UI 기여 가이드

BestOW UI 에 컴포넌트·아이콘을 추가하거나 버그를 고칠 때 필요한 내용을 정리했어요.
사용 방법은 [Storybook](https://dev-bestow.github.io/BestOW-UI/) 의 **Introduction** 페이지를 봐 주세요.

## 개발 환경

- Node.js 22 (`.nvmrc`)
- pnpm 11 — corepack 으로 실행해요 (`corepack enable` 한 번). pnpm 10 은 쓰지 않아요.

```bash
corepack enable
pnpm install
pnpm build        # tokens → icons → react 순서로 빌드
pnpm storybook    # http://localhost:6006
```

> pnpm 11 은 올라온 지 24시간이 안 된 패키지 설치를 거부해요(minimumReleaseAge).
> 방금 나온 버전을 추가하다 설치가 실패하면 하루 지난 버전을 골라 주세요.

### 저장소 구조

| 경로 | 내용 |
|---|---|
| `packages/tokens` | `@bestow-ui/tokens` — 원시 디자인 토큰. 의존성 없음 |
| `packages/icons` | `@bestow-ui/icons` — `svg/*.svg` 에서 생성한 아이콘 컴포넌트 |
| `packages/react` | `@bestow-ui/react` — 테마(`src/theme`)와 컴포넌트(`src/components`) |
| `apps/storybook` | 문서·개발 환경. 패키지의 `src` 를 바로 읽어요 |
| `apps/playground` | Next.js 예제 앱. 패키지의 `dist` 를 써서 실제 설치와 같은 조건으로 확인해요 |

### 자주 쓰는 명령

| 명령 | 내용 |
|---|---|
| `pnpm storybook` | Storybook 개발 서버 |
| `pnpm playground` | Next.js 예제 앱 (http://localhost:3000). 패키지를 고친 뒤엔 `pnpm build` 를 다시 해요 |
| `pnpm test` | 단위 테스트 (Vitest + jsdom) |
| `pnpm test:stories` | 모든 스토리를 실제 브라우저에서 라이트·다크로 렌더링 + axe 접근성 검사. `pnpm build` 먼저 |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm size` | 번들 크기 검사 (`.size-limit.json`). `pnpm build` 먼저. PR 에는 base 와 비교한 표가 코멘트로 달려요 |
| `pnpm changeset` | 변경 내역 기록 |

## 작업 흐름

1. `main` 에서 브랜치를 만들어 작업해요.
2. 공개 API 가 바뀌면 changeset 을 추가해요 ([아래](#changeset-작성법) 참고).
3. PR 을 올리기 전에 아래 명령이 모두 통과하는지 확인해요. CI 도 같은 순서로 검사해요.

   ```bash
   pnpm lint && pnpm format:check && pnpm build && pnpm size && pnpm typecheck \
     && pnpm test && pnpm test:stories && pnpm build-storybook && pnpm build-playground && pnpm test:e2e
   ```

4. PR 이 `main` 에 머지되면 봇이 "chore: version packages" PR 을 만들어요. 그 PR 을 머지하면 npm 배포와 GitHub Release 가 자동으로 진행돼요.

## 컴포넌트 추가 체크리스트

`packages/react/src/components/<Name>/` 아래에 다음 파일을 만들어요.

| 파일 | 내용 |
|---|---|
| `<Name>.tsx` | 컴포넌트 |
| `<Name>.css.ts` | vanilla-extract 스타일 |
| `<Name>.stories.tsx` | 스토리 |
| `<Name>.test.tsx` | 테스트 |
| `index.ts` | export |

- [ ] `packages/react/src/client.ts` 에 `export * from './components/<Name>';` 를 추가했다 (서버 컴포넌트에서도 부를 순수 함수는 hook 없는 파일에 두고 `shared.ts` 에서 export)
- [ ] 스타일 값은 모두 `vars` 로 참조했다 (하드코딩한 색·간격 없음)
- [ ] `forwardRef` 로 ref 를 넘기고, `className` 과 나머지 HTML 속성을 전달했다
- [ ] 최상위 `forwardRef(...)`·`createContext(...)` 앞에 `/* @__PURE__ */` 를 붙였다
- [ ] 스토리: `tags: ['autodocs']`, Playground + 변형별 스토리. 라이트·다크 모두 확인했다
- [ ] 테스트: 역할·라벨 기반으로 쓰고, 접근성 속성과 키보드 상호작용을 확인했다
- [ ] 화면에 보이는 기본 문구는 `useMessages()` 로 바꿀 수 있게 했다 (`prop ?? m.키 ?? '한국어 기본값'`, 새 키는 `BestowMessages`·`en` 에도.
  1.0 이후 추가하는 키는 선택(`?`) 키로 — 사용자가 만든 다른 언어 묶음이 타입 오류로 깨지지 않게)
- [ ] 목록·대화상자처럼 열어야 보이는 상태가 있으면 `play` 로 열어 둔 스토리를 만들었다 (axe·시각 회귀가 그 상태도 검사. `defaultOpen` 은 문서 페이지를 가리므로 쓰지 않는다)
- [ ] 키보드·포커스·이름 등 접근성 동작이 바뀌면 [KWCAG 2.2 대응 문서](apps/storybook/stories/accessibility/kwcag.ts)와
  [컴포넌트별 키보드·스크린리더 문서](apps/storybook/stories/accessibility/componentA11y.ts) 해당 항목을 고쳤다(새 컴포넌트는 추가)
- [ ] `apps/playground` 에 사용 예를 추가했다 — E2E(`pnpm test:e2e`)가 콘솔·hydration 오류와 axe 를 자동으로 본다.
  jsdom 에서 재현되지 않는 동작(실제 키보드 이벤트 순서·커서 위치 등)은 `apps/playground/e2e` 에 테스트를 추가했다
- [ ] changeset(`"@bestow-ui/react": minor`)을 추가했다

### 스타일 규칙

```ts
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const badge = recipe({
  base: { borderRadius: vars.radius.full, fontSize: vars.font.size.xs },
  variants: {
    color: {
      primary: { background: vars.color.primary.subtle, color: vars.color.primary.text },
      danger: { background: vars.color.danger.subtle, color: vars.color.danger.text },
    },
  },
  defaultVariants: { color: 'primary' },
});
```

- **색·간격·모서리·글꼴은 반드시 `vars` 로.** 그래야 다크 모드와 브랜드 테마가 적용돼요.
- variant 는 `recipe()` 로 만들고, prop 이름은 기존 컴포넌트와 맞춰요: `variant`, `color`, `size`(`sm`/`md`/`lg`), `fullWidth`.
- HTML 의 `color` 속성과 겹치면 props 타입에서 `Omit` 해요.
- 아이콘은 `@bestow-ui/icons` 에서 가져와요. react 패키지 안에 SVG 를 새로 만들지 않아요.
- 공용 애니메이션(`src/styles/animations.css.ts`)과 스크린리더 전용 텍스트(`src/styles/visuallyHidden.css.ts`)를 재사용해요.
- 애니메이션은 `reducedMotion` 미디어쿼리에서 꺼요.

### 왜 `/* @__PURE__ */` 가 필요한가요?

```tsx
export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) { … });
```

이 표시가 없으면 번들러가 `forwardRef(...)` 호출에 부작용이 있다고 보고 지우지 못해요.
그러면 사용자가 `Button` 하나만 import 해도 모든 컴포넌트와 Radix 가 번들에 들어가요(실제로 2.4 kB → 40 kB).
`pnpm size` 의 "Button 하나" 항목이 이 문제를 감시해요.

### 폼 컴포넌트

TextField·Select 와 같은 패턴을 따라요.

- props: `label`, `helperText`, `error`, `required`
- `useId()` 로 id 를 만들어 `label` 과 `aria-describedby` 를 연결해요.
- 접근 가능한 이름(label)에는 짧은 레이블만 넣고, 보조 설명은 별도 요소로 두고 `aria-describedby` 로 연결해요.
- 값을 고르는 Radix 컴포넌트(Select, RadioGroup 등)는 `'value' in props` 일 때 `value ?? ''` 로 넘겨 **항상 제어 모드**로 둬요.
  `useState<string>()` 처럼 초기값이 없을 때 "uncontrolled → controlled" 경고가 나지 않게 하려는 거예요.

### 오버레이 (Popover, Menu, Modal …)

- [Radix UI](https://www.radix-ui.com) primitive 위에 스타일만 입혀요.
- Radix 의 portal 콘텐츠는 `ThemeProvider` 바깥(`body`)에 렌더링돼요. **`usePortalProps()` 의 `className`·`style` 을 꼭 붙여요.**
  빠지면 portal 안에서 다크 모드와 브랜드 테마가 깨져요.
- z-index 는 `vars.zIndex.*` 를 써요.
- 열림/닫힘 애니메이션은 `[data-state="open"]` 같은 셀렉터로 걸고, `reducedMotion` 에서 꺼요.

### 스토리

- 모든 스토리는 CI 에서 실제 브라우저로 렌더링되고, 라이트·다크 두 테마 모두에서 **axe 접근성 검사**(글자 대비 4.5:1 등)를 통과해야 해요.
- 모든 스토리는 라이트·다크 스크린샷으로 **시각 회귀 검사**를 받아요. 애니메이션처럼 매번 결과가 달라지는 스토리는 `tags: ['!visual']` 로 빼요.
- **새 스토리**는 기준 이미지가 자동으로 만들어져요. main 에 머지(push)되면 봇이 `📸 새 스토리 기준 이미지 추가` 커밋을 올려요.
- **기존 화면을 의도적으로 바꿨다면** Visual regression 이 실패해요. 실패한 실행의 `visual-report` 아티팩트로 의도한 변경인지 확인한 뒤,
  Actions → **Visual regression** → Run workflow(브랜치 선택 + **update** 체크)로 기준 이미지를 갱신해요. 봇이 그 브랜치에 커밋해 줘요.
- 기준 이미지는 글꼴 렌더링 차이 때문에 CI 의 Linux 환경에서만 만들어요. 봇 커밋 뒤에는 로컬에서 `git pull` 을 해 주세요.
- "오늘" 처럼 날마다 바뀌는 값은 prop 으로 고정해요(예: `Calendar` 의 `today`). 그렇지 않으면 스크린샷이 매일 달라져요.
- 한국 서비스 키트 부품은 `title: 'Korean Kit/<이름>'` 으로 둬요. 외부 서비스를 쓰는 부품은 가짜 공급자로 스토리·테스트를 돌려요.

### 테스트

- 커서 위치처럼 jsdom 이 실제 브라우저와 다르게 다루는 동작은 스토리 `play`(실제 Chromium)로 확인해요.

- [Testing Library](https://testing-library.com) 의 역할·라벨 쿼리(`getByRole`, `getByLabelText`)를 써요.
- 상호작용은 `@testing-library/user-event` 의 `userEvent.setup()` 으로 써요.
- 핵심 테스트는 구현을 일부러 망가뜨려 보고 실제로 실패하는지 확인해요.

## 아이콘 추가

1. `packages/icons/svg/<kebab-case>.svg` 를 추가해요.
   - `viewBox="0 0 24 24"`, stroke 2, 둥근 끝(round). `<g>` 없이 평탄한 도형으로.
   - Lucide 에서 가져오면 그대로 넣으면 돼요. 직접 그리면 같은 규격으로 그려요.
2. 생성 스크립트를 실행해요. `src/generated/icons.ts` 에 `PascalCaseIcon` 컴포넌트가 생겨요.

   ```bash
   pnpm --filter @bestow-ui/icons generate
   ```

3. `svg` 파일과 **생성된 `src/generated/icons.ts` 를 함께 커밋**해요. CI 가 생성물이 최신인지 확인해요.
4. changeset(`"@bestow-ui/icons": minor`)을 추가해요.

기본 세트는 [Lucide](https://lucide.dev)(ISC 라이선스)라서 `packages/icons/LICENSE` 를 유지해야 해요.

## 디자인 토큰 수정

- 원시 값은 `packages/tokens/src/index.ts` 에 있어요. 라이트·다크 의미 색상(`lightColors`/`darkColors`)은 같은 키를 가져야 해요.
- 토큰 키 이름은 CSS 변수 이름(`--bestow-color-primary-solid` 등)이 되고, 사용자가 CSS 로 덮어쓰는 **공개 API** 예요. 이름을 바꾸거나 지우면 breaking change 예요.
- 토큰 값을 바꾸면 `pnpm build` 를 다시 해야 Storybook 에 반영돼요. vanilla-extract 가 스타일을 계산할 때 `packages/tokens/dist` 를 읽기 때문이에요.
- 글자색을 바꾸면 배경과의 대비가 4.5:1 이상인지 확인해요 (`pnpm test:stories` 의 axe 검사가 잡아 줘요).

## changeset 작성법

npm 에 배포되는 패키지(`@bestow-ui/tokens`, `icons`, `react`)를 바꾸면 changeset 을 추가해요. 문서·CI·예제 앱만 바꿨다면 필요 없어요.

```bash
pnpm changeset   # 대화형으로 패키지와 버전 종류를 고르고 설명을 적어요
```

또는 `.changeset/<짧은-이름>.md` 를 직접 만들어도 돼요.

```md
---
"@bestow-ui/react": minor
---

Rating 컴포넌트 추가 — 별점 입력. `value`/`onValueChange`, `max`, `size`(sm/md/lg), `readOnly` 지원.
```

| 변경 | 버전 (react·tokens 1.0 이후) |
|---|---|
| 기존 prop·타입·export·CSS 변수(`--bestow-*`) 이름을 바꾸거나 지움 | `major` |
| 새 컴포넌트·새 기능·새 prop | `minor` |
| 버그 수정·스타일 수정·내부 변경 | `patch` |

- 이름을 바꾸고 싶으면 바로 지우지 말고, 새 이름을 추가하고 옛 이름은 `@deprecated` + 개발 모드 경고(`warnOnce`)로 남기는 `minor` 를 먼저 내요.
  옛 이름은 다음 major 에서 지워요. `@bestow-ui/icons` 는 아직 0.x 라 기능 추가 = `minor` 예요.

- 설명은 CHANGELOG 와 GitHub Release 에 그대로 실려요. 사용자 입장에서 무엇이 바뀌었는지 써 주세요.
- `@bestow-ui/react` 와 `@bestow-ui/tokens` 는 linked 설정이라, 같은 릴리스에서 함께 바뀌면 같은 버전 번호를 써요.
