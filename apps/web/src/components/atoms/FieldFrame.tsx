/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo FieldFrame. Moldura compartilhada pelos campos do Figma ("Campo de busca",
 *   "Campo de busca localização", "Campo de data", "Dropdown horário", "Filtro"): borda de 1px,
 *   raio de 4px, espaçamentos e as cores de borda por tom e por estado (hover, pressed, foco).
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tons dos campos:
 * - `neutral`: fundo claro, borda cinza (campo de busca do header, campos de formulário);
 * - `inverse`: sobre fundo da marca, borda e texto brancos (busca de carros);
 * - `secondary`: borda e texto azul-escuro (filtro de categoria).
 */
export type FieldTone = 'neutral' | 'inverse' | 'secondary';

/** Cores de borda/texto de cada tom no estado padrão. */
export const FIELD_TONE_CLASSES: Record<FieldTone, string> = {
  neutral: 'border-neutral-details text-neutral-text',
  inverse: 'border-neutral-white text-neutral-white',
  secondary: 'border-secondary text-secondary',
};

/** Cores de borda nos estados do Figma: hover, pressed (`active`) e foco (`focus-within`). */
export const FIELD_STATE_CLASSES =
  'hover:border-primary-light focus-within:border-focus active:border-primary-dark';

/** Estrutura comum: borda de 1px, raio de 4px, `px-4 py-3`, ícone e texto com 8px de espaço. */
export const FIELD_BASE_CLASSES =
  'flex items-center gap-2 rounded border bg-transparent px-4 py-3 font-sans text-body-md transition-colors';

export interface FieldFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** Tom do campo (padrão: `neutral`). */
  tone?: FieldTone;
  /** Destaca a moldura como inválida (borda vermelha de feedback). */
  invalid?: boolean;
}

/**
 * Moldura de campo com ícone/texto.
 *
 * @param props - Tom, estado inválido e atributos nativos da `<div>`.
 * @returns `<div>` com a borda e os estados do design system.
 */
export function FieldFrame({
  tone = 'neutral',
  invalid = false,
  className,
  ...rest
}: FieldFrameProps) {
  return (
    <div
      className={cn(
        FIELD_BASE_CLASSES,
        FIELD_TONE_CLASSES[tone],
        invalid ? 'border-negative' : FIELD_STATE_CLASSES,
        className,
      )}
      {...rest}
    />
  );
}
