/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Organismo Header. Cabeçalho da aplicação com a marca Hermex e uma área à direita
 *   (ações) fornecida pelo template.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface HeaderProps {
  /** Conteúdo da área direita (links, menu do usuário...). */
  actions?: ReactNode;
  /** Destino do clique na marca (padrão: `/`). */
  homeHref?: string;
}

/**
 * Cabeçalho da aplicação.
 *
 * @param props - Ações da direita e link da marca.
 * @returns Elemento `<header>`.
 */
export function Header({ actions, homeHref = '/' }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={homeHref} className="flex items-center gap-2 text-lg font-bold text-secondary">
          <span aria-hidden="true" className="rounded-md bg-primary px-2 py-0.5 text-white">
            H
          </span>
          Hermex
        </Link>
        <nav className="flex items-center gap-2">{actions}</nav>
      </div>
    </header>
  );
}
