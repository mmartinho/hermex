/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Input. Campo de texto base do design system, com os tons e estados de
 *   borda do Figma. Com `bare` perde a moldura para ser embutido num FieldFrame (ex.: IconInput).
 */
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import {
  FIELD_BASE_CLASSES,
  FIELD_STATE_CLASSES,
  FIELD_TONE_CLASSES,
  type FieldTone,
} from './FieldFrame';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Tom do campo (padrão: `neutral`). */
  tone?: FieldTone;
  /** Destaca o campo como inválido. */
  invalid?: boolean;
  /** Sem borda/padding: para uso dentro de uma moldura (FieldFrame). */
  bare?: boolean;
}

/** Cor do placeholder por tom (no Figma o texto de exemplo usa a mesma cor do campo). */
const PLACEHOLDER_CLASSES: Record<FieldTone, string> = {
  neutral: 'placeholder:text-neutral-text',
  inverse: 'placeholder:text-neutral-white',
  secondary: 'placeholder:text-secondary',
};

/**
 * Campo de entrada de texto.
 *
 * @param props - Tom, `invalid`, `bare` e atributos nativos do input.
 * @returns Elemento `<input>` estilizado.
 */
export function Input({
  tone = 'neutral',
  invalid = false,
  bare = false,
  className,
  ...rest
}: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full min-w-0 outline-none',
        PLACEHOLDER_CLASSES[tone],
        bare
          ? 'bg-transparent font-sans text-body-md text-inherit'
          : cn(
              FIELD_BASE_CLASSES,
              FIELD_TONE_CLASSES[tone],
              invalid ? 'border-negative' : FIELD_STATE_CLASSES,
            ),
        className,
      )}
      {...rest}
    />
  );
}
