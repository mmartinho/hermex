/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Utilitário para compor listas de classes CSS (Tailwind) ignorando valores
 *   falsos, usado pelos componentes do design system.
 */

/** Valor aceito por {@link cn}: classes ou valores falsos (ignorados). */
export type ClassValue = string | false | null | undefined;

/**
 * Junta classes CSS, descartando valores falsos (`false`, `null`, `undefined`, `''`).
 *
 * @param classes - Classes ou expressões condicionais.
 * @returns String com as classes separadas por espaço.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
