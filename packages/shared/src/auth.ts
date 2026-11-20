/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Contratos de autenticação compartilhados entre web e api: papéis de usuário,
 *   provedores de login social, payload do JWT emitido pela API e nome do header usado na
 *   comunicação interna (servidor Next -> servidor Nest).
 */

/**
 * Papéis (perfis de acesso) de um usuário do Hermex.
 * Os valores precisam ser idênticos ao enum `UserRole` do Prisma.
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const;

/** Tipo união dos papéis de usuário (`'ADMIN' | 'CUSTOMER'`). */
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Provedores de login social suportados.
 * Os valores precisam ser idênticos ao enum `AuthProvider` do Prisma.
 */
export const AuthProvider = {
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
} as const;

/** Tipo união dos provedores sociais (`'GOOGLE' | 'FACEBOOK'`). */
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

/**
 * Conteúdo (claims) do JWT emitido pela API Nest.
 */
export interface AuthTokenPayload {
  /** Id do usuário (subject). */
  sub: string;
  /** Email do usuário. */
  email: string;
  /** Papel do usuário. */
  role: UserRole;
}

/**
 * Header HTTP que carrega a chave interna usada nas chamadas servidor-a-servidor
 * (ex.: Auth.js chamando a mutation `authenticateWithProvider`). Nunca deve ser enviado
 * pelo navegador.
 */
export const INTERNAL_API_KEY_HEADER = 'x-internal-api-key';

/**
 * Converte o id de provedor usado pelo Auth.js (`google`, `facebook`) para o enum
 * `AuthProvider` da API.
 *
 * @param providerId - Id do provedor no Auth.js (case-insensitive).
 * @returns O valor correspondente de `AuthProvider`, ou `null` se o provedor não for suportado.
 */
export function toAuthProvider(providerId: string): AuthProvider | null {
  const normalized = providerId.toUpperCase();
  return normalized in AuthProvider ? (normalized as AuthProvider) : null;
}
