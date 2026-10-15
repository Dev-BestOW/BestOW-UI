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
      <ThemeProvider theme={context.globals.theme as ThemeName} style={{ padding: 24, minHeight: '100%' }}>
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
          'Layout',
          'Components',
        ],
      },
    },
  },
};

export default preview;
