/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Layout raiz do front-end Hermex. Define idioma, fontes, metadados e o provider
 *   do Apollo Client para toda a aplicação.
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
