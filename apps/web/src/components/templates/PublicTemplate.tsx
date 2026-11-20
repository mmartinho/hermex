/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Template PublicTemplate. Estrutura das páginas públicas (home, login): cabeçalho
 *   com link de entrada, conteúdo e rodapé.
 */
import type { ReactNode } from 'react';
import { NavLink } from '@/components/molecules';
import { Header } from '@/components/organisms';

export interface PublicTemplateProps {
  children: ReactNode;
  /** Exibe o link "Entrar" no cabeçalho (padrão: true). */
  showLogin?: boolean;
}

/**
 * Layout de páginas públicas.
 *
 * @param props - Conteúdo da página e visibilidade do link de login.
 * @returns Estrutura com cabeçalho, `<main>` e rodapé.
 */
export function PublicTemplate({ children, showLogin = true }: PublicTemplateProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header
        actions={
          showLogin ? (
            <NavLink href="/login" highlight>
              Entrar
            </NavLink>
          ) : null
        }
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">{children}</main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
        Hermex · Locadora de veículos
      </footer>
    </div>
  );
}
