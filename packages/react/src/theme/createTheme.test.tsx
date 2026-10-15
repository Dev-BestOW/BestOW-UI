import { render, screen } from '@testing-library/react';
import { lightColors, darkColors } from '@bestow-ui/tokens';
import { Modal } from '../components/Modal';
import { contrastRatio, createIntentColors } from './color';
import { vars } from './contract.css';
import { createTheme } from './createTheme';
import { ThemeProvider } from './ThemeProvider';

const PRIMARY = '--bestow-color-primary-solid';

describe('vars', () => {
  it('CSS 변수 이름이 고정돼 있다 (공개 API)', () => {
    expect(vars.color.primary.solid).toBe(`var(${PRIMARY})`);
    expect(vars.color.primary.solidHover).toBe('var(--bestow-color-primary-solid-hover)');
    expect(vars.space[4]).toBe('var(--bestow-space-4)');
    expect(vars.font.lineHeight.normal).toBe('var(--bestow-font-line-height-normal)');
  });
});

describe('createTheme', () => {
  it('common 을 모드별 값에 병합하고 모드별 값이 우선한다', () => {
    const theme = createTheme({
      common: { radius: { md: '6px' }, color: { primary: { solid: '#111111' } } },
      dark: { color: { primary: { solid: '#222222' } } },
    });
    expect(theme.light).toEqual({ radius: { md: '6px' }, color: { primary: { solid: '#111111' } } });
    expect(theme.dark).toEqual({ radius: { md: '6px' }, color: { primary: { solid: '#222222' } } });
  });

  it('여러 입력을 순서대로 깊게 병합한다', () => {
    const theme = createTheme(createIntentColors('primary', '#7c3aed'), createIntentColors('danger', '#e11d48'), {
      light: { color: { primary: { solid: '#000000' } } },
    });
    expect(theme.light.color?.primary?.solid).toBe('#000000');
    expect(theme.light.color?.primary?.text).toBeDefined();
    expect(theme.light.color?.danger?.solid).toBe('#e11d48');
  });
});

describe('createIntentColors', () => {
  it.each(['#7c3aed', '#facc15', '#0ea5e9', '#111827', '#f472b6', '#16a34a'])(
    '%s 로 만든 색이 대비 기준(4.5:1)을 만족한다',
    (color) => {
      const { light, dark } = createIntentColors('primary', color);
      const l = light!.color!.primary!;
      const d = dark!.color!.primary!;
      expect(l.solid).toBe(color);
      expect(contrastRatio(l.contrast!, l.solid!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(l.text!, lightColors.bg.default)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(l.text!, l.subtleHover!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(d.text!, darkColors.bg.default)).toBeGreaterThanOrEqual(4.5);
      // 노랑처럼 밝은 색은 흰 글자가 안 보이므로 어두운 글자를 고른다
      if (contrastRatio('#ffffff', color) < 4.5) expect(l.contrast).not.toBe('#ffffff');
    },
  );

  it('primary 는 포커스 링 색도 브랜드를 따라가고, 다른 intent 는 건드리지 않는다', () => {
    const primary = createIntentColors('primary', '#7c3aed');
    expect(primary.light?.color?.border?.focus).toBe('#7c3aed');
    expect(primary.dark?.color?.border?.focus).toBe(primary.dark?.color?.primary?.solidHover);
    expect(createIntentColors('danger', '#e11d48').light?.color?.border).toBeUndefined();
  });

  it('잘못된 색은 에러를 낸다', () => {
    expect(() => createIntentColors('primary', 'purple')).toThrow('hex');
  });
});

describe('ThemeProvider overrides', () => {
  const brand = createTheme({
    light: { color: { primary: { solid: '#7c3aed' } } },
    dark: { color: { primary: { solid: '#a78bfa' } } },
  });

  it('현재 모드의 오버라이드를 인라인 CSS 변수로 적용한다', () => {
    const { rerender } = render(
      <ThemeProvider data-testid="root" theme="light" overrides={brand} style={{ padding: 4 }} />,
    );
    const root = screen.getByTestId('root');
    expect(root.style.getPropertyValue(PRIMARY)).toBe('#7c3aed');
    expect(root.style.padding).toBe('4px');

    rerender(<ThemeProvider data-testid="root" theme="dark" overrides={brand} />);
    expect(screen.getByTestId('root').style.getPropertyValue(PRIMARY)).toBe('#a78bfa');
  });

  it('중첩 ThemeProvider 는 바깥 오버라이드를 이어받고 안쪽 값이 우선한다', () => {
    const inner = createTheme({ common: { radius: { md: '2px' } } });
    render(
      <ThemeProvider theme="light" overrides={brand}>
        <ThemeProvider data-testid="inherit" theme="dark" />
        <ThemeProvider data-testid="inner" theme="light" overrides={inner} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('inherit').style.getPropertyValue(PRIMARY)).toBe('#a78bfa');
    const innerEl = screen.getByTestId('inner');
    expect(innerEl.style.getPropertyValue(PRIMARY)).toBe('#7c3aed');
    expect(innerEl.style.getPropertyValue('--bestow-radius-md')).toBe('2px');
  });

  it('theme 을 생략하면 바깥 모드를 이어받는다', () => {
    render(
      <ThemeProvider theme="dark">
        <ThemeProvider data-testid="child" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('child').getAttribute('data-theme')).toBe('dark');
  });

  it('portal 콘텐츠에도 오버라이드를 적용한다', () => {
    render(
      <ThemeProvider theme="dark" overrides={brand}>
        <Modal defaultOpen title="제목" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('dialog').style.getPropertyValue(PRIMARY)).toBe('#a78bfa');
  });

  it('오버라이드가 없으면 인라인 변수를 넣지 않는다', () => {
    render(<ThemeProvider data-testid="plain" />);
    expect(screen.getByTestId('plain').getAttribute('style')).toBeNull();
  });
});
