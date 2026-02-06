import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // reactPerfPlugin finds performance issues in react code
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  reactPerfPlugin.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // rules-of-hooks finds hooks that are called incorrectly (conditionally or in loops)
      'react-hooks/rules-of-hooks': 'error',
      // exhaustive-deps finds hooks with inproper effect dependencies
      'react-hooks/exhaustive-deps': 'warn',
      // Disable strict perf rules for now to allow for cleaner JSX
      'react-perf/jsx-no-new-function-as-prop': 'off',
      'react-perf/jsx-no-new-object-as-prop': 'off',
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginPrettierRecommended
);
