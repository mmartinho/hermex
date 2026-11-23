/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Icon. Ícone da fonte Material Icons (ligadura pelo nome), como no Figma.
 *   É decorativo por padrão; com `label` passa a ser anunciado por leitores de tela.
 */
import { cn } from '@/lib/cn';

/** Nomes de ícones Material Icons usados no design system (extensível). */
export type MaterialIconName =
  | 'account_circle'
  | 'add'
  | 'calendar_month'
  | 'keyboard_arrow_down'
  | 'keyboard_arrow_up'
  | 'location_on'
  | 'login'
  | 'logout'
  | 'search'
  | (string & {});

export interface IconProps {
  /** Nome do ícone (ligadura Material Icons), ex.: `search`. */
  name: MaterialIconName;
  /** Tamanho em pixels; se omitido, herda o tamanho da fonte do pai (16px no padrão). */
  size?: number;
  /** Texto acessível; quando omitido o ícone é decorativo (`aria-hidden`). */
  label?: string;
  className?: string;
}

/**
 * Ícone Material Icons.
 *
 * @param props - Nome, tamanho, rótulo acessível e classes extras.
 * @returns Elemento `<span>` com a ligadura do ícone.
 */
export function Icon({ name, size, label, className }: IconProps) {
  return (
    <span
      className={cn('material-icons shrink-0', className)}
      style={size ? { fontSize: size } : undefined}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {name}
    </span>
  );
}
