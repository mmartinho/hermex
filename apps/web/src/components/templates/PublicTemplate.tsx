/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-26
 * Descrição: Template PublicTemplate. Estrutura das páginas públicas (home, login): cabeçalho
 *   (com os links padrão "Cadastro"/"Login" do Header), conteúdo e rodapé.
 */
import type { ReactNode } from 'react';
import { Header } from '@/components/organisms';

export interface PublicTemplateProps {
  children: ReactNode;
  /** Exibe os links "Cadastro" e "Login" no cabeçalho (padrão: true). */
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
      {/* `undefined` usa os links padrão do Header; `null` esconde a área de ações. */}
      <Header actions={showLogin ? undefined : null} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">{children}</main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
        Hermex · Locadora de veículos
      </footer>
    </div>
  );
}
