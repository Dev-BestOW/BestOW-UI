# BestOW UI

React + vanilla-extract 기반 디자인 시스템.

사용 방법은 Storybook 의 **Introduction** 페이지, 기여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md), 앞으로의 작업 계획은 [docs/ROADMAP.md](docs/ROADMAP.md)를 참고하세요.

| 패키지 | 설명 |
|---|---|
| `@bestow-ui/tokens` | 색상·간격·타이포그래피 등 디자인 토큰 (원시 값) |
| `@bestow-ui/react` | 테마(ThemeProvider)와 React 컴포넌트 |
| `@bestow-ui/icons` | SVG 아이콘 React 컴포넌트 (기본 세트는 [Lucide](https://lucide.dev), ISC) |
| `apps/storybook` | 컴포넌트 문서 / 개발 환경 |
| `apps/playground` | Next.js 예제 앱 (실제 설치와 같은 조건으로 확인) |

- Storybook: https://dev-bestow.github.io/BestOW-UI/
- 예제 앱: https://dev-bestow.github.io/BestOW-UI/playground/

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

### 브랜드 테마 (커스터마이징)

```tsx
import { ThemeProvider, createTheme, createIntentColors } from '@bestow-ui/react';

const brand = createTheme(
  createIntentColors('primary', '#7c3aed'),           // 대표색 하나로 라이트·다크 색 세트 자동 생성 (대비 4.5:1 보장)
  {
    common: { radius: { md: '6px' }, font: { family: { sans: 'Inter, sans-serif' } } },
    dark: { color: { bg: { default: '#0b0b10' } } },   // 모드별 값
  },
);

<ThemeProvider theme={mode} overrides={brand}>…</ThemeProvider>
```

- `theme`(light/dark)과 `overrides`(브랜드)는 따로 동작해서, 모드를 바꿔도 브랜드는 유지돼요.
- 중첩한 ThemeProvider 는 바깥의 모드와 브랜드를 이어받고, 안쪽에서 준 값이 우선해요.
- CSS 변수 이름이 고정돼 있어서 CSS 로만 바꿀 수도 있어요: `:root { --bestow-color-primary-solid: #7c3aed; }`
  전체 목록은 Storybook **Foundations › Theming › CSS 변수**.
- 직접 만든 portal 요소에는 `usePortalProps()` 의 `className`/`style` 을 붙여야 테마가 적용돼요.

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
pnpm build && pnpm playground   # Next.js 예제 앱 http://localhost:3000
pnpm test
pnpm build
```

컴포넌트·아이콘 추가 체크리스트, changeset 작성법은 [CONTRIBUTING.md](CONTRIBUTING.md) 를 봐 주세요.

## 배포

```bash
pnpm changeset          # 변경 내역 기록
pnpm version-packages   # 버전 올리기 + CHANGELOG 생성
pnpm release            # 빌드 후 npm 배포
```

## CI/CD (GitHub Actions)

| 워크플로 | 트리거 | 내용 |
|---|---|---|
| `ci.yml` | PR, main push | 아이콘 생성물 확인 → lint → 포맷 → 빌드 → 번들 크기 → 타입 체크 → 테스트 → 스토리 렌더링·axe → Storybook·예제 앱 빌드 |
| `visual.yml` | PR, main push, 수동 | 모든 스토리의 라이트·다크 스크린샷 비교 (수동 실행 + update 로 기준 이미지 갱신) |
| `release.yml` | main push | changeset 이 있으면 "version packages" PR 생성(GitHub App 토큰), 그 PR 이 머지되면 npm 배포 |
| `storybook.yml` | main push (패키지·앱 변경 시), 수동 | Storybook 과 예제 앱(정적 export)을 GitHub Pages 에 배포 |

배포 흐름: 작업 브랜치에서 `pnpm changeset` → PR 머지 → 자동 생성된 버전 PR 머지 → npm 배포.

## 라이선스

[MIT](LICENSE) © Dev-BestOW. 단, `@bestow-ui/icons` 의 아이콘 그림은 Lucide 기반이라 [ISC](packages/icons/LICENSE) 예요.
