/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Átomo Spinner. Indicador de carregamento acessível.
 */

export interface SpinnerProps {
  /** Tamanho do spinner (padrão: `md`). */
  size?: 'sm' | 'md' | 'lg';
  /** Texto lido por leitores de tela. */
  label?: string;
}

const SIZE_CLASSES = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-4' };

/**
 * Indicador de carregamento circular.
 *
 * @param props - Tamanho e rótulo acessível.
 * @returns Elemento animado com `role="status"`.
 */
export function Spinner({ size = 'md', label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <span
        className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-current border-t-transparent`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
