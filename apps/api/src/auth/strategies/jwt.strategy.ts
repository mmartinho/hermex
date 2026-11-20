/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Estratégia Passport que valida o JWT emitido pela própria API, lido do header
 *   `Authorization: Bearer <token>`, e transforma o payload no usuário autenticado da requisição.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { AuthTokenPayload, UserRole } from '@hermex/shared';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** Usuário autenticado anexado em `req.user` após a validação do token. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param config - Serviço de configuração (lê `JWT_SECRET`).
   * @throws {TypeError} Se `JWT_SECRET` não estiver definido.
   */
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Converte o payload (já com assinatura e expiração verificadas) no usuário da requisição.
   *
   * @param payload - Claims do JWT.
   * @returns O usuário autenticado.
   */
  validate(payload: AuthTokenPayload): AuthenticatedUser {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
