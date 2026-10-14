# BestOW UI

React + vanilla-extract 기반 디자인 시스템.

| 패키지 | 설명 |
|---|---|
| `@bestow/tokens` | 색상·간격·타이포그래피 등 디자인 토큰 (원시 값) |
| `@bestow/react` | 테마(ThemeProvider)와 React 컴포넌트 |
| `apps/storybook` | 컴포넌트 문서 / 개발 환경 |

## 사용하기

```bash
pnpm add @bestow/react
```

```tsx
import '@bestow/react/styles.css';
import { ThemeProvider, Button } from '@bestow/react';

export function App() {
  return (
    <ThemeProvider theme="light">
      <Button variant="solid" color="primary">확인</Button>
    </ThemeProvider>
  );
}
```

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
