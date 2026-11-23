/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Fontes do design system Hermex via next/font: Inter (body) e Exo 2 (headings).
 *   Expõe as variáveis CSS `--font-inter` e `--font-exo2`, consumidas pelos tokens do
 *   `globals.css`. Compartilhado entre o layout raiz e o Storybook.
 */
import { Exo_2, Inter } from 'next/font/google';

/** Fonte de texto (body). */
export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

/** Fonte de títulos (headings), usada em negrito. */
export const exo2 = Exo_2({
  variable: '--font-exo2',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

/** Classes que definem as variáveis das fontes; aplicar no elemento raiz. */
export const fontVariables = `${inter.variable} ${exo2.variable}`;
