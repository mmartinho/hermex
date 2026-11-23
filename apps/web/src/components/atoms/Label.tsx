/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Label. Rótulo de campos de formulário.
 */
import type { LabelHTMLAttributes } from 'react';

/**
 * Rótulo de formulário.
 *
 * @param props - Atributos nativos do label (use `htmlFor` para associar ao campo).
 * @returns Elemento `<label>` estilizado.
 */
export function Label({ className = '', ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`block font-sans text-body-md text-neutral-text ${className}`} {...rest} />
  );
}
