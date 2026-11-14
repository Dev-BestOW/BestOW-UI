# shadcn/ui 프로젝트에 BestOW 한국 키트 얹기

[![StackBlitz 에서 열기](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Dev-BestOW/BestOW-UI/tree/main/examples/shadcn-starter?file=src%2Fbestow-theme.ts)

이미 shadcn/ui·Tailwind v4 로 만든 화면에 [`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react) 의 **한국 서비스 입력만** 얹은 예제예요.
카드·버튼은 shadcn/ui, 사업자등록번호·휴대폰 번호·인증번호·약관 동의는 BestOW 이고, 다크 모드와 색은 shadcn 테마 하나를 따라가요.

```bash
npm install
npm run dev
```

- shadcn 색 → BestOW 토큰 연결: [`src/bestow-theme.ts`](src/bestow-theme.ts) — 접근성 기준에 못 미치는 값(입력 칸 테두리·포커스 표시·보조 글자)은 일부러 잇지 않아요
- 레이어 순서 한 줄: [`src/index.css`](src/index.css) 맨 위 · 스타일 불러오기: [`src/main.tsx`](src/main.tsx)
- 화면: [`src/App.tsx`](src/App.tsx) · shadcn/ui 컴포넌트(MIT, 줄여 옮김): [`src/components/ui`](src/components/ui)
- 설명: Storybook [Guides › shadcn·Tailwind 프로젝트에 한국 키트만 쓰기](https://bestow-ui.com/storybook/?path=/docs/guides-shadcn·tailwind-프로젝트에-한국-키트만-쓰기--docs)
