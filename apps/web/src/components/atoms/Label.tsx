/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
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
    <label
      className={`block text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`}
      {...rest}
    />
  );
}
