// @ts-check
/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Configuração do ESLint da API Nest. Combina o preset type-checked do
 *   typescript-eslint com a configuração base compartilhada do monorepo (que integra o Prettier).
 */
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.base.mjs';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'src/generated/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  ...baseConfig,
);
