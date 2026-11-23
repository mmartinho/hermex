/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Molécula Price. Preço da diária do card de carro: valor em Exo 2 (heading xs)
 *   seguido do período em Inter (body lg), ex.: "R$ 120/diária".
 */
import { Heading, Text } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface PriceProps {
  /** Valor em reais. */
  amount: number;
  /** Período cobrado (padrão: `/diária`). */
  period?: string;
  /** Moeda ISO 4217 (padrão: `BRL`). */
  currency?: string;
  className?: string;
}

/**
 * Formata um valor monetário em pt-BR, sem casas decimais quando o valor é inteiro.
 *
 * @param amount - Valor.
 * @param currency - Moeda ISO 4217.
 * @returns Valor formatado (ex.: `R$ 120`).
 */
export function formatPrice(amount: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Preço com período.
 *
 * @param props - Valor, período, moeda e classes extras.
 * @returns Linha com o valor em destaque e o período.
 */
export function Price({ amount, period = '/diária', currency = 'BRL', className }: PriceProps) {
  return (
    <p className={cn('flex items-baseline text-neutral-black', className)}>
      <Heading as="span" size="xs">
        {formatPrice(amount, currency)}
      </Heading>
      <Text as="span" size="lg">
        {period}
      </Text>
    </p>
  );
}
