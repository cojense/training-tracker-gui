import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'conductor'] },
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
      'react-refresh': reactRefresh,
    },
    rules: {
      // --- CORE RULES (Do Not Disable) ---
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // --- NEGOTIABLE RULES (Agent may ask to disable) ---
      // These are often stylistic or overly strict for rapid prototyping.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow warn/error, warn on log

      // --- PROJECT SPECIFIC OVERRIDES ---
      // Add user-negotiated overrides here (Conductor will append below)
    },
  }
);
