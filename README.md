# BestOW UI

React + vanilla-extract 기반 디자인 시스템.

| 패키지 | 설명 |
|---|---|
| `@bestow-ui/tokens` | 색상·간격·타이포그래피 등 디자인 토큰 (원시 값) |
| `@bestow-ui/react` | 테마(ThemeProvider)와 React 컴포넌트 |
| `@bestow-ui/icons` | SVG 아이콘 React 컴포넌트 (기본 세트는 [Lucide](https://lucide.dev), ISC) |
| `apps/storybook` | 컴포넌트 문서 / 개발 환경 |

## 사용하기

```bash
pnpm add @bestow-ui/react
```

```tsx
import '@bestow-ui/react/styles.css';
import { ThemeProvider, Button } from '@bestow-ui/react';

export function App() {
  return (
    <ThemeProvider theme="light">
      <Button variant="solid" color="primary">확인</Button>
    </ThemeProvider>
  );
}
```

### 아이콘

```tsx
import { SearchIcon, TrashIcon } from '@bestow-ui/icons';

<SearchIcon />                         // 24px, 장식용(aria-hidden)
<TrashIcon size={16} strokeWidth={1.5} />
<SearchIcon title="검색" />             // 스크린리더가 읽는 아이콘
```

필요한 아이콘만 import 하면 그 아이콘만 번들에 포함돼요.

**아이콘 추가하기:** `packages/icons/svg/` 에 24×24 SVG 파일(`kebab-case.svg`)을 넣고 `pnpm --filter @bestow-ui/icons generate` 를 실행하면 `PascalCaseIcon` 컴포넌트가 만들어져요. 생성된 `src/generated/icons.ts` 도 함께 커밋해야 해요 (CI 가 확인해요).

## 개발

```bash
corepack enable        # pnpm 활성화 (최초 1회)
pnpm install
pnpm storybook         # http://localhost:6006
pnpm test
pnpm build
```

### 새 컴포넌트 추가

`packages/react/src/components/<Name>/` 아래에 다음 파일을 만들고 `src/index.ts`에서 export 한다.

- `<Name>.tsx` — 컴포넌트 (forwardRef, className/나머지 props 전달)
- `<Name>.css.ts` — 스타일. 값은 반드시 `vars`(테마 토큰)로 참조
- `<Name>.stories.tsx` — Storybook 스토리 (`tags: ['autodocs']`)
- `<Name>.test.tsx` — 테스트

## 배포

```bash
pnpm changeset          # 변경 내역 기록
pnpm version-packages   # 버전 올리기 + CHANGELOG 생성
pnpm release            # 빌드 후 npm 배포
```

## CI/CD (GitHub Actions)

| 워크플로 | 트리거 | 내용 |
|---|---|---|
| `ci.yml` | PR, main push | 빌드 → 타입 체크 → 테스트 → Storybook 빌드 |
| `release.yml` | main push | changeset 이 있으면 "version packages" PR 생성, 그 PR 이 머지되면 npm 배포 |
| `storybook.yml` | main push (패키지 변경 시), 수동 | Storybook 을 GitHub Pages 에 배포 |

배포 흐름: 작업 브랜치에서 `pnpm changeset` → PR 머지 → 자동 생성된 버전 PR 머지 → npm 배포.
