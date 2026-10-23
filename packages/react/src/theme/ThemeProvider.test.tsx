import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Modal } from '../components/Modal';
import { Tooltip } from '../components/Tooltip';
import { createIntentColors } from './color';
import { systemThemeClass, themeClass } from './contract.css';
import { createTheme } from './createTheme';
import { ThemeProvider, useTheme } from './ThemeProvider';

/** OS 다크 모드 설정 흉내 (jsdom 에는 matchMedia 가 없다). set 으로 설정을 바꾸면 change 이벤트를 보낸다. */
function mockColorScheme(initial: 'light' | 'dark') {
  let dark = initial === 'dark';
  const listeners = new Set<() => void>();
  const mql = {
    media: '(prefers-color-scheme: dark)',
    get matches() {
      return dark;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };
  window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList);
  return {
    listeners,
    set(next: 'light' | 'dark') {
      dark = next === 'dark';
      listeners.forEach((listener) => listener());
    },
  };
}

function ShowTheme() {
  return <span data-testid="shown">{useTheme()}</span>;
}

const brand = createTheme(createIntentColors('primary', '#7c3aed'));

describe('ThemeProvider', () => {
  it('portal 로 렌더링되는 요소에도 현재 테마를 적용한다', () => {
    render(
      <ThemeProvider theme="dark">
        <Modal defaultOpen title="제목" />
        <Tooltip content="도움말" defaultOpen>
          <button>버튼</button>
        </Tooltip>
      </ThemeProvider>,
    );
    const dialog = screen.getByRole('dialog');
    // portal 이므로 ThemeProvider div 바깥(body 직속)에 렌더링된다
    expect(dialog.closest('[data-theme]')).toBeNull();
    expect(dialog.classList.contains(themeClass.dark)).toBe(true);
    expect(document.querySelector('[data-radix-popper-content-wrapper] > *')?.classList.contains(themeClass.dark)).toBe(
      true,
    );
  });
});

describe('ThemeProvider theme="system"', () => {
  afterEach(() => {
    // @ts-expect-error jsdom 원래 상태(없음)로 되돌린다
    delete window.matchMedia;
  });

  it('OS 가 다크면 다크 테마를 적용하고 useTheme 도 dark 다', () => {
    mockColorScheme('dark');
    const { container } = render(
      <ThemeProvider theme="system">
        <ShowTheme />
      </ThemeProvider>,
    );
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.classList.contains(themeClass.dark)).toBe(true);
    expect(screen.getByTestId('shown').textContent).toBe('dark');
  });

  it('OS 설정을 바꾸면 따라 바뀌고, 언마운트하면 구독을 끊는다', () => {
    const scheme = mockColorScheme('light');
    const { container, unmount } = render(
      <ThemeProvider theme="system">
        <ShowTheme />
      </ThemeProvider>,
    );
    expect(container.firstElementChild!.getAttribute('data-theme')).toBe('light');
    act(() => scheme.set('dark'));
    expect(container.firstElementChild!.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('shown').textContent).toBe('dark');
    unmount();
    expect(scheme.listeners.size).toBe(0);
  });

  it('light·dark 를 직접 주면 OS 설정을 구독하지 않는다', () => {
    const scheme = mockColorScheme('dark');
    const { container } = render(<ThemeProvider theme="light" />);
    expect(container.firstElementChild!.getAttribute('data-theme')).toBe('light');
    expect(scheme.listeners.size).toBe(0);
  });

  it('중첩 ThemeProvider 는 system 을 이어받고, 브랜드 오버라이드는 OS 모드의 값을 쓴다', () => {
    mockColorScheme('dark');
    render(
      <ThemeProvider theme="system" overrides={brand}>
        <ThemeProvider data-testid="inner">
          <ShowTheme />
        </ThemeProvider>
      </ThemeProvider>,
    );
    const inner = screen.getByTestId('inner');
    expect(inner.getAttribute('data-theme')).toBe('dark');
    expect(inner.style.getPropertyValue('--bestow-color-primary-solid')).toBe(brand.dark.color!.primary!.solid);
  });

  it('portal 도 OS 모드의 테마 클래스를 받는다', () => {
    mockColorScheme('dark');
    render(
      <ThemeProvider theme="system">
        <Modal defaultOpen title="제목" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('dialog').classList.contains(themeClass.dark)).toBe(true);
  });

  it('서버 렌더링은 OS 설정을 몰라 CSS 미디어쿼리로 그린다 (오버라이드도 라이트·다크 둘 다)', () => {
    const html = renderToString(
      <ThemeProvider theme="system" overrides={brand}>
        <ShowTheme />
      </ThemeProvider>,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    const root = host.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-theme')).toBe('system');
    expect(root.classList.contains(systemThemeClass)).toBe(true);
    expect(root.getAttribute('style')).toBeNull();
    const css = root.querySelector('style')!.textContent!;
    const id = root.getAttribute('data-bestow-theme-id');
    expect(css).toContain(`.${systemThemeClass}[data-bestow-theme-id="${id}"]{`);
    expect(css).toContain(`--bestow-color-primary-solid:${brand.light.color!.primary!.solid}`);
    expect(css).toMatch(
      new RegExp(
        `@media \\(prefers-color-scheme: dark\\)\\{.*--bestow-color-primary-solid:${brand.dark.color!.primary!.solid}`,
      ),
    );
  });

  it('오버라이드 값의 < 는 이스케이프해 style 태그를 닫지 못한다', () => {
    const html = renderToString(
      <ThemeProvider
        theme="system"
        overrides={createTheme({ common: { font: { family: { sans: '</style><b>x' } } } })}
      />,
    );
    expect(html).not.toContain('</style><b>');
    expect(html).toContain('\\3c /style>');
  });

  it('hydration 은 불일치 경고 없이 끝나고 바로 OS 모드로 바뀐다', async () => {
    const app = (
      <ThemeProvider theme="system" overrides={brand}>
        <ShowTheme />
      </ThemeProvider>
    );
    const html = renderToString(app);
    mockColorScheme('dark');
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const root = await act(async () => hydrateRoot(host, app));
    const messages = error.mock.calls.map((call) => call.map(String).join(' '));
    error.mockRestore();
    expect(messages).toEqual([]);
    const el = host.firstElementChild as HTMLElement;
    expect(el.getAttribute('data-theme')).toBe('dark');
    expect(el.classList.contains(themeClass.dark)).toBe(true);
    expect(el.querySelector('style')).toBeNull();
    expect(el.style.getPropertyValue('--bestow-color-primary-solid')).toBe(brand.dark.color!.primary!.solid);
    expect(host.textContent).toBe('dark');
    act(() => root.unmount());
    host.remove();
  });
});
