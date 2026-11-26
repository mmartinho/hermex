/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-26
 * Descrição: Layout raiz do front-end Hermex. Define idioma, fontes (Inter, Exo 2 e Material
 *   Icons), metadados e o provider do Apollo Client para toda a aplicação.
 */
import type { Metadata } from 'next';
import '@fontsource/material-icons';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { fontVariables } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Hermex · Locadora de veículos',
    template: '%s · Hermex',
  },
  description: 'Alugue carros de forma rápida e segura com a Hermex.',
};

/**
 * Layout raiz.
 *
 * @param props.children - Página/layout aninhado.
 * @returns Documento HTML base.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      {/* Extensões do navegador (ex.: ColorZilla) injetam atributos no <body> antes da hidratação;
          a supressão vale só para o próprio <body>, não para os filhos. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
