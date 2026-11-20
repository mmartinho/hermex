/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Molécula NavLink. Link de navegação do cabeçalho baseado no `next/link`.
 */
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

export interface NavLinkProps extends LinkProps {
  children: ReactNode;
  /** Estilo de destaque (botão). */
  highlight?: boolean;
  className?: string;
}

/**
 * Link de navegação.
 *
 * @param props - Destino (`href`), conteúdo e estilo.
 * @returns Elemento `<a>` gerenciado pelo Next.
 */
export function NavLink({
  children,
  highlight = false,
  className = '',
  ...linkProps
}: NavLinkProps) {
  return (
    <Link
      {...linkProps}
      className={[
        'rounded-lg px-3 py-2 text-sm font-medium transition',
        highlight
          ? 'bg-brand-600 text-white hover:bg-brand-700'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  );
}
