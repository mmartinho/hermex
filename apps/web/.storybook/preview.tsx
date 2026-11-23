/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Configuração de preview do Storybook. Carrega os estilos globais (tokens Tailwind),
 *   a fonte Material Icons e as fontes do next/font (aplicadas no <html>, como no layout raiz),
 *   e define fundos de exemplo com as cores da marca para os componentes de tom invertido.
 */
import '@fontsource/material-icons';
import type { Preview } from '@storybook/nextjs-vite';
import { fontVariables } from '../src/app/fonts';
import '../src/app/globals.css';

// As variáveis de fonte precisam estar no elemento raiz para os tokens do @theme resolverem.
document.documentElement.classList.add(...fontVariables.split(' '));

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        white: { name: 'Branco', value: '#ffffff' },
        neutral: { name: 'Neutro', value: '#fbfbfb' },
        primary: { name: 'Laranja (busca)', value: '#e28634' },
        secondary: { name: 'Azul (rodapé)', value: '#23384d' },
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    backgrounds: { value: 'white' },
  },
  tags: ['autodocs'],
};

export default preview;
