import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default defineConfig(
  {
    ignores: ['dist/**', 'eslint.config.js', 'vitest.config.ts'],
  },
  // @ts-ignore - InfiniteArray type mismatch in flat config
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPerfPlugin.configs.flat.recommended,
    plugins: {
      'react-hooks': reactHooks,
      'react-perf': reactPerfPlugin,
    },
    rules: {
      // rules-of-hooks finds hooks that are called incorrectly (conditionally or in loops)
      'react-hooks/rules-of-hooks': 'error',
      // exhaustive-deps finds hooks with inproper effect dependencies
      'react-hooks/exhaustive-deps': 'error',
      'react-perf/jsx-no-new-function-as-prop': 'warn',
      'react-perf/jsx-no-new-object-as-prop': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
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
