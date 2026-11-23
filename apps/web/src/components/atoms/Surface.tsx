/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Surface. Superfície base do componente "Card" do Figma: fundo branco,
 *   sombra elevation-2, raio de 4px, padding de 32px e, quando interativa, borda laranja-clara
 *   no hover (variantes "Lg/Sm Hover").
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  /** Tag HTML (padrão: `div`). */
  as?: 'div' | 'article' | 'section' | 'li';
  /** Aplica a borda de hover do card (padrão: `false`). */
  interactive?: boolean;
}

/**
 * Superfície elevada (card).
 *
 * @param props - Tag, interatividade e atributos nativos.
 * @returns Elemento com fundo, sombra e espaçamentos do card.
 */
export function Surface({
  as: Tag = 'div',
  interactive = false,
  className,
  ...rest
}: SurfaceProps) {
  return (
    <Tag
      className={cn(
        // Borda transparente reserva o 1px do hover para o card não "pular".
        'flex flex-col items-center justify-center gap-4 rounded border border-transparent bg-neutral-white p-8 shadow-elevation-2',
        interactive && 'transition-colors hover:border-primary-light',
        className,
      )}
      {...rest}
    />
  );
}
