/**
 * 반응형 구간 미디어쿼리(모바일 우선 min-width). `@bestow-ui/tokens` 의 breakpoint(px)를 em 으로 바꾼 값 —
 * em 이라 브라우저 기본 글꼴 크기를 키우면 구간도 따라 바뀐다. 값을 직접 적는다(최상위에서 tokens 객체 속성을 읽으면
 * tokens 전체가 번들에 딸려 온다 — responsive.test.ts 가 tokens 와 같은지 확인).
 *
 * @example style({ flexDirection: 'column', '@media': { [media.md]: { flexDirection: 'row' } } }) // vanilla-extract
 */
export const media = {
  sm: '(min-width: 40em)',
  md: '(min-width: 48em)',
  lg: '(min-width: 64em)',
  xl: '(min-width: 80em)',
} as const;

export type Breakpoint = keyof typeof media;

/**
 * 한 값 또는 구간별 값. 구간 값은 그 폭 이상에서 쓰이고, 주지 않은 구간은 앞(좁은) 구간 값을 이어받는다.
 *
 * @example direction={{ base: 'column', md: 'row' }} // 768px 미만은 세로, 이상은 가로
 */
export type Responsive<T> = T | ({ base?: T } & { [K in Breakpoint]?: T });

const keys = ['base', 'sm', 'md', 'lg', 'xl'] as const;

export const isResponsiveObject = <T>(value: Responsive<T> | undefined): value is Exclude<Responsive<T>, T> =>
  typeof value === 'object' && value !== null;

/**
 * 각 구간의 실제 값(앞 구간을 이어받음)을 CSS 변수 `--bestow-<name>-<구간>` 으로 out 에 넣는다.
 * styles/responsive.css.ts 의 responsiveProperty 가 이 변수를 미디어쿼리로 읽는다.
 */
export function responsiveVars<T>(
  out: Record<string, string>,
  name: string,
  value: Responsive<T> | undefined,
  toCss: (value: T) => string,
) {
  if (value === undefined) return;
  const values = (isResponsiveObject(value) ? value : { base: value }) as Partial<Record<(typeof keys)[number], T>>;
  let current: T | undefined;
  for (const key of keys) {
    current = values[key] ?? current;
    if (current !== undefined) out[`--bestow-${name}-${key}`] = toCss(current);
  }
}

/** space 토큰 키 → 테마 CSS 변수. 변수 이름(--bestow-space-*)이 공개 API 로 고정이라 vars 를 import 하지 않고 적는다 */
export const spaceVar = (key: string | number) => `var(--bestow-space-${key})`;
