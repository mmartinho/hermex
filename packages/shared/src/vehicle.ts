/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Contratos de veículos compartilhados entre web e api, como o tipo de transmissão
 *   (câmbio) de um veículo da frota.
 */

/**
 * Tipos de transmissão (câmbio) de um veículo.
 * Os valores precisam ser idênticos ao enum `Transmission` do Prisma.
 */
export const Transmission = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
} as const;

/** Tipo união das transmissões (`'MANUAL' | 'AUTOMATIC'`). */
export type Transmission = (typeof Transmission)[keyof typeof Transmission];
