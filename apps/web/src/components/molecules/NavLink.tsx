/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Molécula NavLink. Link de navegação baseado no `next/link`, com o visual do
 *   componente "Links" do Figma (hover/pressed sublinhados, foco com borda magenta) e ícone
 *   opcional à esquerda (ex.: "Cadastro" e "Login" do header).
 */
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type MaterialIconName } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface NavLinkProps extends LinkProps {
  children: ReactNode;
  /** Ícone Material Icons à esquerda do texto. */
  icon?: MaterialIconName;
  /** Destaque em formato de botão primário (chamada para ação). */
  highlight?: boolean;
  className?: string;
}

/** Visual do componente "Links" do Figma. */
const LINK_CLASSES =
  'text-neutral-text underline-offset-2 hover:text-primary-light hover:underline active:text-primary-dark active:underline';

/** Destaque: mesmas cores do "Botão primário". */
const HIGHLIGHT_CLASSES =
  'rounded bg-primary px-4 py-3 text-neutral-white hover:bg-primary-light hover:text-neutral-text active:bg-primary-dark active:text-neutral-white';

/**
 * Link de navegação.
 *
 * @param props - Destino (`href`), conteúdo, ícone, destaque e classes extras.
 * @returns Elemento `<a>` gerenciado pelo Next.
 */
export function NavLink({
  children,
  icon,
  highlight = false,
  className,
  ...linkProps
}: NavLinkProps) {
  return (
    <Link
      {...linkProps}
      className={cn(
        'inline-flex items-center gap-2 font-sans text-body-md transition-colors',
        // Foco do Figma: borda de 1px na cor de foco, com 8px de respiro, sem deslocar o layout.
        'outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-offset-8 focus-visible:outline-focus',
        highlight ? HIGHLIGHT_CLASSES : LINK_CLASSES,
        className,
      )}
    >
      {icon && <Icon name={icon} />}
      {children}
    </Link>
  );
}
