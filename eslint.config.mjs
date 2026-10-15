// ESLint flat config. 포맷은 Prettier 가 맡고(eslint-config-prettier 로 충돌 규칙 끔), ESLint 는 버그·접근성·hooks 규칙만 본다.
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/dist/',
    '**/storybook-static/',
    '**/.next/',
    '**/out/',
    '**/next-env.d.ts',
    'packages/icons/src/generated/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  storybook.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  prettier,
]);
