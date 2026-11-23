/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Button. Botão base do design system Hermex com as variantes do Figma
 *   ("Botão primário", "Botão secundário" e "Botão fantasma"), seus estados (hover, pressed,
 *   foco), ícone opcional à esquerda e estado de carregamento.
 */
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type MaterialIconName } from './Icon';
import { Spinner } from './Spinner';

/** Variantes visuais do botão. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual (padrão: `primary`). */
  variant?: ButtonVariant;
  /** Ícone Material Icons à esquerda do texto. */
  icon?: MaterialIconName;
  /** Exibe spinner e desabilita o botão. */
  loading?: boolean;
  /** Ocupa toda a largura disponível. */
  fullWidth?: boolean;
}

/** Cores de cada variante nos estados padrão, hover (`hover:`) e pressed (`active:`). */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-neutral-white hover:bg-primary-light hover:text-neutral-text active:bg-primary-dark active:text-neutral-white',
  secondary: 'bg-secondary text-neutral-white hover:bg-secondary-dark active:bg-secondary-light',
  ghost: 'bg-neutral-white text-neutral-text hover:bg-primary-light active:bg-neutral-details',
};

/**
 * Botão base.
 *
 * @param props - Variante, ícone, loading, fullWidth e atributos nativos do botão.
 * @returns Elemento `<button>` estilizado.
 */
export function Button({
  variant = 'primary',
  icon,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded px-4 py-3 font-sans text-body-md transition-colors',
        // Foco do Figma: borda de 2px na cor de foco, desenhada por dentro (sem mudar o tamanho).
        'outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-focus',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASSES[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
