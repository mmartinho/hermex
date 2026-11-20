/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Guard que libera apenas chamadas servidor-a-servidor que apresentem a chave
 *   interna (`INTERNAL_API_KEY`) no header `x-internal-api-key`. Usado pela mutation que
 *   registra/autentica usuários vindos de login social via Auth.js.
 */
import { timingSafeEqual } from 'node:crypto';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { INTERNAL_API_KEY_HEADER } from '@hermex/shared';
import type { Request } from 'express';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  private readonly expectedKey: Buffer;

  /**
   * @param config - Serviço de configuração (lê `INTERNAL_API_KEY`).
   * @throws {TypeError} Se `INTERNAL_API_KEY` não estiver definida.
   */
  constructor(config: ConfigService) {
    this.expectedKey = Buffer.from(config.getOrThrow<string>('INTERNAL_API_KEY'));
  }

  /**
   * Compara a chave recebida com a esperada em tempo constante.
   *
   * @param context - Contexto de execução (GraphQL).
   * @returns `true` quando a chave confere.
   * @throws {UnauthorizedException} Se a chave estiver ausente ou incorreta.
   */
  canActivate(context: ExecutionContext): boolean {
    const req = GqlExecutionContext.create(context).getContext<{ req: Request }>().req;
    const received = req.headers[INTERNAL_API_KEY_HEADER];

    if (typeof received !== 'string') {
      throw new UnauthorizedException('Chave interna ausente');
    }

    const receivedKey = Buffer.from(received);
    const valid =
      receivedKey.length === this.expectedKey.length &&
      timingSafeEqual(receivedKey, this.expectedKey);

    if (!valid) {
      throw new UnauthorizedException('Chave interna inválida');
    }
    return true;
  }
}
