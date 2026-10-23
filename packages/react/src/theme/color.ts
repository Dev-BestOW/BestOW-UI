// 대표색 하나로 intent 색 세트를 만드는 색 계산 유틸.
// OKLCH(사람이 느끼는 밝기에 가까운 색 공간)에서 밝기를 조절하고, WCAG 대비(4.5:1)를 만족하도록 글자색을 찾는다.
import { darkColors, lightColors, palette } from '@bestow-ui/tokens';
import type { ThemeInput } from './createTheme';

type Rgb = [number, number, number]; // 0~1, sRGB
interface Oklch {
  l: number;
  c: number;
  h: number;
}

export function parseHex(hex: string): Rgb {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`올바른 hex 색이 아니에요: "${hex}" (예: "#7c3aed")`);
  let h = m[1]!;
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

export function toHex(rgb: Rgb): string {
  return `#${rgb
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklch([r, g, b]: Rgb): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(a, bb), h: Math.atan2(bb, a) };
}

function oklchToRgbUnclamped({ l, c, h }: Oklch): Rgb {
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    fromLinear(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    fromLinear(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** sRGB 범위를 벗어나면 채도(c)를 줄여 범위 안으로 맞춘다. */
function oklchToRgb(color: Oklch): Rgb {
  const l = Math.min(1, Math.max(0, color.l));
  let rgb = oklchToRgbUnclamped({ ...color, l });
  if (inGamut(rgb)) return rgb;
  let lo = 0;
  let hi = color.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgbUnclamped({ l, c: mid, h: color.h }))) lo = mid;
    else hi = mid;
  }
  rgb = oklchToRgbUnclamped({ l, c: lo, h: color.h });
  return rgb;
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** WCAG 대비율 (1 ~ 21) */
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(parseHex(a)), luminance(parseHex(b))];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** fg 를 alpha 만큼 bg 위에 겹친 결과 색 */
function blend(fg: string, alpha: number, bg: string): string {
  const [f, b] = [parseHex(fg), parseHex(bg)];
  return toHex(f.map((v, i) => v * alpha + b[i]! * (1 - alpha)) as Rgb);
}

const withL = (base: Oklch, l: number, c = base.c) => toHex(oklchToRgb({ l, c, h: base.h }));

/** 대상 배경들 위에서 대비 4.5 를 넘을 때까지 밝기를 step 만큼 옮긴다. */
function findReadable(base: Oklch, startL: number, step: number, backgrounds: string[]): string {
  let l = startL;
  for (let i = 0; i < 40; i++) {
    const hex = withL(base, l);
    if (backgrounds.every((bg) => contrastRatio(hex, bg) >= 4.5)) return hex;
    l = Math.min(1, Math.max(0, l + step));
  }
  return step < 0 ? palette.black : palette.white;
}

/**
 * solid 의 hover 색: 밝기를 delta 만큼 옮기되, 그 결과에서 글자색(contrast) 대비가 4.5 아래로 떨어지면 반대 방향으로 옮긴다.
 * (예: 다크 모드에서 파란 버튼을 밝게 하면 흰 글자 대비가 떨어지므로 어둡게 한다)
 */
function hoverFor(base: Oklch, delta: number, contrast: string): string {
  const preferred = withL(base, Math.min(1, Math.max(0, base.l + delta)));
  if (contrastRatio(contrast, preferred) >= 4.5) return preferred;
  return withL(base, Math.min(1, Math.max(0, base.l - delta)));
}

/**
 * solid 배경과 그 위 글자색(contrast). 흰 글자가 4.5 를 넘으면 흰색, 아니면 짙은 글자.
 * 둘 다 4.5 미만인 중간 밝기 색(초록 #059669, 주황 #ea580c 등)은 solid 의 밝기를 가장 적게 옮겨 4.5 를 맞춘다
 * (같은 거리면 어둡게 + 흰 글자를 먼저 고른다).
 */
function solidWithContrast(color: string): { solid: string; contrast: string } {
  const white = palette.white;
  const dark = palette.gray[900];
  if (contrastRatio(white, color) >= 4.5) return { solid: color, contrast: white };
  if (contrastRatio(dark, color) >= 4.5) return { solid: color, contrast: dark };
  const base = rgbToOklch(parseHex(color));
  for (let delta = 0.005; delta <= 1; delta += 0.005) {
    const darker = withL(base, Math.max(0, base.l - delta));
    if (contrastRatio(white, darker) >= 4.5) return { solid: darker, contrast: white };
    const lighter = withL(base, Math.min(1, base.l + delta));
    if (contrastRatio(dark, lighter) >= 4.5) return { solid: lighter, contrast: dark };
  }
  return { solid: palette.black, contrast: white };
}

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = parseHex(hex).map((v) => Math.round(v * 255));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export type IntentName = 'primary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info';

/**
 * 대표색 하나로 intent(primary 등)의 라이트·다크 색 세트를 만든다. 결과는 createTheme 에 넘긴다.
 * - solid 는 넘긴 색을 그대로 쓴다 (다크모드에서 너무 어두우면 조금 밝힌다). 단 흰 글자·짙은 글자 모두
 *   대비 4.5:1 이 안 나오는 중간 밝기 색이면 4.5 가 나올 만큼만 밝기를 옮긴다.
 * - text 와 contrast(solid 위 글자색)는 WCAG AA 대비 4.5:1 을 만족하도록 계산한다.
 * - intent 가 'primary' 면 포커스 링 색(border.focus)도 함께 바꾼다.
 *
 * @example createTheme(createIntentColors('primary', '#7c3aed'))
 */
export function createIntentColors(intent: IntentName, color: string): ThemeInput {
  const input = toHex(parseHex(color));
  const base = rgbToOklch(parseHex(input));

  // 라이트
  const lightSubtle = withL(base, 0.97, Math.min(base.c, 0.12) * 0.3);
  const lightSubtleHover = withL(base, 0.93, Math.min(base.c, 0.12) * 0.45);
  const { solid, contrast: lightContrast } = solidWithContrast(input);
  const light = {
    solid,
    solidHover: hoverFor(rgbToOklch(parseHex(solid)), -0.06, lightContrast),
    contrast: lightContrast,
    subtle: lightSubtle,
    subtleHover: lightSubtleHover,
    text: findReadable(base, Math.min(base.l, 0.55), -0.02, [lightColors.bg.default, lightSubtle, lightSubtleHover]),
  };

  // 다크
  const darkBg = darkColors.bg.default;
  const { solid: darkSolid, contrast: darkContrast } = solidWithContrast(base.l < 0.5 ? withL(base, 0.55) : input);
  const darkBase = rgbToOklch(parseHex(darkSolid));
  const darkSubtleOnBg = blend(darkSolid, 0.16, darkBg);
  const darkSubtleHoverOnBg = blend(darkSolid, 0.26, darkBg);
  const dark = {
    solid: darkSolid,
    solidHover: hoverFor(darkBase, 0.06, darkContrast),
    contrast: darkContrast,
    subtle: rgba(darkSolid, 0.16),
    subtleHover: rgba(darkSolid, 0.26),
    text: findReadable(darkBase, Math.max(darkBase.l, 0.75), 0.02, [darkBg, darkSubtleOnBg, darkSubtleHoverOnBg]),
  };

  // primary 는 포커스 링(border.focus)도 브랜드 색을 따라가게 한다. 다크는 어두운 배경에서 잘 보이도록 solid 보다 밝게.
  // 포커스 링은 그래픽이라 배경과 3:1 이상이어야 한다(WCAG 1.4.11). 노랑·하늘색처럼 밝은 색은 라이트에서 미달이므로
  // 그때는 배경 대비 4.5:1 이 보장된 text 색을 쓴다.
  const focusOn = (candidate: string, fallback: string, bg: string) =>
    contrastRatio(candidate, bg) >= 3 ? candidate : fallback;
  const focus =
    intent === 'primary'
      ? {
          light: { border: { focus: focusOn(light.solid, light.text, lightColors.bg.default) } },
          dark: {
            border: { focus: focusOn(withL(darkBase, Math.min(1, darkBase.l + 0.06)), dark.text, darkBg) },
          },
        }
      : undefined;

  return {
    light: { color: { [intent]: light, ...focus?.light } },
    dark: { color: { [intent]: dark, ...focus?.dark } },
  } as ThemeInput;
}
