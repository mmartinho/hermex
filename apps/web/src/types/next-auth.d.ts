/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Extensão dos tipos do Auth.js. Adiciona id/papel do usuário na sessão e guarda o
 *   JWT da API Nest dentro do token de sessão (que fica somente no cookie criptografado e
 *   nunca é exposto ao navegador).
 */
import type { UserRole } from '@hermex/shared';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /** Usuário retornado pelos providers/callbacks (antes de virar sessão). */
  interface User {
    role?: UserRole;
    /** JWT emitido pela API Nest. */
    accessToken?: string;
  }

  /** Sessão disponível via `auth()` — sem o accessToken, de propósito. */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Conteúdo do token de sessão do Auth.js (cookie criptografado). */
  interface JWT {
    userId?: string;
    role?: UserRole;
    /** JWT emitido pela API Nest, usado nas chamadas server-side. */
    accessToken?: string;
  }
}
