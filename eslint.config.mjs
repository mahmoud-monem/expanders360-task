import eslint from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    ignores: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    plugins: {
      js: eslint,
      '@stylistic/ts': stylisticTs,
    },
    languageOptions: {
      parser: parserTs,
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@stylistic/ts/lines-between-class-members': ['error', 'always'],
    },
  },
);
