/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Guard de autenticação JWT adaptado ao GraphQL. O AuthGuard padrão do Passport
 *   espera um contexto HTTP; aqui extraímos a requisição do contexto GraphQL.
 */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Obtém a requisição HTTP a partir do contexto de execução GraphQL.
   *
   * @param context - Contexto de execução do Nest.
   * @returns A requisição Express associada à operação GraphQL.
   */
  getRequest(context: ExecutionContext): Request {
    return GqlExecutionContext.create(context).getContext<{ req: Request }>().req;
  }
}
