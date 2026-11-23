/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Divider. Linha horizontal de 1px que separa itens de listas (ex.: opções
 *   dos dropdowns abertos — "Line 11" no Figma).
 */
import { cn } from '@/lib/cn';

/** Cores de linha disponíveis (tokens do design system). */
export type DividerTone = 'divisor' | 'details' | 'secondary-light' | 'white';

export interface DividerProps {
  /** Cor da linha (padrão: `divisor`). */
  tone?: DividerTone;
  className?: string;
}

const TONE_CLASSES: Record<DividerTone, string> = {
  divisor: 'border-neutral-divisor',
  details: 'border-neutral-details',
  'secondary-light': 'border-secondary-light',
  white: 'border-neutral-white',
};

/**
 * Linha divisória decorativa.
 *
 * @param props - Tom da linha e classes extras.
 * @returns Elemento `<hr>` oculto para leitores de tela.
 */
export function Divider({ tone = 'divisor', className }: DividerProps) {
  return <hr aria-hidden="true" className={cn('w-full border-t', TONE_CLASSES[tone], className)} />;
}
