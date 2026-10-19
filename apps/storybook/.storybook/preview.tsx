import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, type ThemeName } from '@bestow-ui/react';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'BestOW 테마',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        theme={context.globals.theme as ThemeName}
        // 스토리 화면에서는 테마 배경을 화면 높이까지 채운다(다크에서 아래가 흰색으로 남지 않게).
        // 자동 문서 페이지는 스토리가 여러 개 이어지므로 내용 높이만 쓴다.
        style={{
          padding: 24,
          boxSizing: 'border-box',
          minHeight: context.viewMode === 'story' ? '100vh' : undefined,
        }}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Design Tokens', 'Theming', 'Theme Builder', 'Icons'],
          'Accessibility',
          ['KWCAG 2.2 대응', '컴포넌트별 키보드·스크린리더'],
          'Guides',
          ['언제 무엇을 쓰나', '화면 패턴'],
          'Layout',
          'Components',
          'Korean Kit',
        ],
      },
    },
  },
};

export default preview;
