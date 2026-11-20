/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Configuração base do ESLint (flat config) compartilhada por todos os pacotes
 *   do monorepo. Cada app importa este array e o combina com o preset do seu framework.
 */
import eslintConfigPrettier from 'eslint-config-prettier/flat';

/**
 * Regras comuns a todo o monorepo.
 * O `eslint-config-prettier` desliga regras de formatação para que o Prettier seja o único
 * responsável pelo estilo do código.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const baseConfig = [
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  eslintConfigPrettier,
];

export default baseConfig;
