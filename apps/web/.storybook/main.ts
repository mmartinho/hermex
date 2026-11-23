/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Configuração principal do Storybook do front-end Hermex (framework Next.js + Vite).
 *   Carrega as stories de `src/**`, serve `public/` e as imagens de exemplo em `/storybook`,
 *   adiciona o Tailwind via plugin do Vite e troca as Server Actions de autenticação por um mock
 *   (elas dependem do servidor Next/Auth.js, que não existe no Storybook).
 */
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public', { from: './assets', to: '/storybook' }],
  core: {
    // Não envia telemetria (mesmo anônima) para fora da máquina.
    disableTelemetry: true,
  },

  /**
   * Ajusta a configuração do Vite usada pelo Storybook.
   *
   * @param viteConfig - Configuração gerada pelo framework.
   * @returns Configuração com Tailwind e o mock das Server Actions.
   */
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          {
            find: /^@\/lib\/auth\/actions$/,
            replacement: fileURLToPath(new URL('./mocks/auth-actions.ts', import.meta.url)),
          },
        ],
      },
    });
  },
};

export default config;
