import { createTheme } from '@bestow-ui/react';

/**
 * shadcn/ui 의 CSS 변수를 BestOW 토큰으로 잇는다. ThemeProvider 의 overrides 로 넘긴다.
 *
 * - 값이 `var(--primary)` 라서 `.dark` 를 켜고 끄면 shadcn 쪽 값을 따라 BestOW 도 바뀐다(라이트·다크 공통으로 한 번만 적음).
 * - overrides 는 portal(팝업·대화상자)에도 붙으므로 body 로 나가는 요소도 같은 색이다.
 * - 일부러 잇지 않은 것:
 *   · 입력 칸 테두리(--input): shadcn 기본값은 흰 배경에서 대비 약 1.3:1 — 칸 경계는 3:1 이 필요하다(WCAG 1.4.11 비텍스트 대비).
 *   · 포커스 표시(--ring): 흰 배경에서 약 2.6:1 이라 키보드 포커스가 잘 안 보인다.
 *   · 보조 글자(--muted-foreground): 회색 배경(--muted) 위에서 4.5:1 에 못 미친다.
 *   · 상태 색(--destructive 등): BestOW 값은 라이트·다크 모두 4.5:1 을 계산해 둔 값이다.
 */
export const shadcnBridge = createTheme({
  common: {
    color: {
      bg: { default: 'var(--background)' },
      fg: { default: 'var(--foreground)' },
      border: { default: 'var(--border)' },
      primary: {
        solid: 'var(--primary)',
        // shadcn 버튼의 hover:bg-primary/90 과 같은 색
        solidHover: 'color-mix(in oklab, var(--primary) 90%, var(--background))',
        contrast: 'var(--primary-foreground)',
        text: 'var(--primary)',
        subtle: 'var(--accent)',
        subtleHover: 'color-mix(in oklab, var(--accent) 90%, var(--foreground))',
      },
    },
    radius: {
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 4px)',
    },
    // 앱 글꼴(Tailwind 의 font-sans)을 따른다. 'inherit' 는 안 된다 — CSS 변수에 쓰면 바깥의 같은 변수(BestOW 기본 글꼴)를 이어받는다
    font: { family: { sans: 'var(--font-sans)' } },
  },
});
