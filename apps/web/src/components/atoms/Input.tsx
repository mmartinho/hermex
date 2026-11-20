/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Átomo Input. Campo de texto base com estado de erro.
 */
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Destaca o campo como inválido. */
  invalid?: boolean;
}

/**
 * Campo de entrada de texto.
 *
 * @param props - Atributos nativos do input e flag `invalid`.
 * @returns Elemento `<input>` estilizado.
 */
export function Input({ invalid = false, className = '', ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={[
        'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm',
        'placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0',
        'dark:bg-slate-900 dark:text-slate-100',
        invalid
          ? 'border-red-500 focus:outline-red-500'
          : 'border-slate-300 focus:outline-brand-600 dark:border-slate-600',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
