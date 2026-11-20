/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Template PrivateTemplate. Estrutura da área logada: cabeçalho com o menu do
 *   usuário (carregado sob Suspense, pois lê a sessão) e o conteúdo da página.
 */
import { type ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/atoms';
import { Header, UserMenu } from '@/components/organisms';

export interface PrivateTemplateProps {
  children: ReactNode;
}

/**
 * Layout da área logada.
 *
 * @param props - Conteúdo da página.
 * @returns Estrutura com cabeçalho autenticado e `<main>`.
 */
export function PrivateTemplate({ children }: PrivateTemplateProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        homeHref="/dashboard"
        actions={
          <Suspense fallback={<Spinner size="sm" />}>
            <UserMenu />
          </Suspense>
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
