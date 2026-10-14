/**
 * BestOW UI 디자인 토큰.
 * 플랫폼에 독립적인 원시 값만 정의한다. 컴포넌트는 @bestow-ui/react 의 테마(vars)를 통해 참조한다.
 */

export const palette = {
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    950: '#16181b',
  },
  blue: {
    50: '#eef4ff',
    100: '#dbe6fe',
    200: '#bfd3fe',
    300: '#93b4fd',
    400: '#6090fa',
    500: '#3b6ff6',
    600: '#2554eb',
    700: '#1d42d8',
    800: '#1e37af',
    900: '#1e338a',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
} as const;

export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const fontFamily = {
  sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

export const shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 12px 32px rgba(0, 0, 0, 0.12)',
} as const;

export const duration = {
  fast: '120ms',
  normal: '200ms',
  slow: '320ms',
} as const;

export const zIndex = {
  dropdown: '1000',
  overlay: '1300',
  modal: '1310',
  toast: '1400',
  tooltip: '1500',
} as const;

/** 의미 기반(semantic) 색상. 라이트/다크 테마가 같은 키를 가져야 한다. */
/** solid 배경 위 글자색은 각 그룹의 contrast 를 사용한다. */
export interface SemanticColors {
  bg: { default: string; subtle: string; muted: string; inverse: string; overlay: string };
  fg: { default: string; muted: string; subtle: string; inverse: string };
  border: { default: string; strong: string; focus: string };
  primary: { solid: string; solidHover: string; contrast: string; subtle: string; subtleHover: string; text: string };
  neutral: { solid: string; solidHover: string; contrast: string; subtle: string; subtleHover: string; text: string };
  danger: { solid: string; solidHover: string; contrast: string; subtle: string; subtleHover: string; text: string };
  success: { solid: string; solidHover: string; contrast: string; subtle: string; subtleHover: string; text: string };
}

export const lightColors: SemanticColors = {
  bg: { default: palette.white, subtle: palette.gray[50], muted: palette.gray[100], inverse: palette.gray[900], overlay: 'rgba(0, 0, 0, 0.45)' },
  fg: { default: palette.gray[900], muted: palette.gray[700], subtle: palette.gray[600], inverse: palette.white },
  border: { default: palette.gray[300], strong: palette.gray[500], focus: palette.blue[500] },
  primary: { solid: palette.blue[600], solidHover: palette.blue[700], contrast: palette.white, subtle: palette.blue[50], subtleHover: palette.blue[100], text: palette.blue[700] },
  neutral: { solid: palette.gray[800], solidHover: palette.gray[900], contrast: palette.white, subtle: palette.gray[100], subtleHover: palette.gray[200], text: palette.gray[800] },
  danger: { solid: palette.red[600], solidHover: palette.red[700], contrast: palette.white, subtle: palette.red[50], subtleHover: palette.red[100], text: palette.red[700] },
  success: { solid: palette.green[700], solidHover: palette.green[800], contrast: palette.white, subtle: palette.green[50], subtleHover: palette.green[100], text: palette.green[700] },
};

export const darkColors: SemanticColors = {
  bg: { default: palette.gray[950], subtle: palette.gray[900], muted: palette.gray[800], inverse: palette.gray[50], overlay: 'rgba(0, 0, 0, 0.65)' },
  fg: { default: palette.gray[50], muted: palette.gray[300], subtle: palette.gray[500], inverse: palette.gray[900] },
  border: { default: palette.gray[700], strong: palette.gray[500], focus: palette.blue[400] },
  primary: { solid: palette.blue[600], solidHover: palette.blue[500], contrast: palette.white, subtle: 'rgba(59, 111, 246, 0.16)', subtleHover: 'rgba(59, 111, 246, 0.26)', text: palette.blue[300] },
  neutral: { solid: palette.gray[200], solidHover: palette.gray[100], contrast: palette.gray[900], subtle: 'rgba(255, 255, 255, 0.08)', subtleHover: 'rgba(255, 255, 255, 0.14)', text: palette.gray[100] },
  danger: { solid: palette.red[600], solidHover: palette.red[500], contrast: palette.white, subtle: 'rgba(239, 68, 68, 0.16)', subtleHover: 'rgba(239, 68, 68, 0.26)', text: palette.red[300] },
  success: { solid: palette.green[700], solidHover: palette.green[600], contrast: palette.white, subtle: 'rgba(34, 197, 94, 0.16)', subtleHover: 'rgba(34, 197, 94, 0.26)', text: palette.green[300] },
};
