/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Decorator de parâmetro `@CurrentUser()` que injeta no resolver o usuário
 *   autenticado (definido em `req.user` pela JwtStrategy).
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../strategies/jwt.strategy';

/**
 * Extrai o usuário autenticado do contexto GraphQL.
 *
 * @returns O usuário autenticado, ou `undefined` se a rota não for protegida por GqlAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined => {
    const req = GqlExecutionContext.create(context).getContext<{ req: Request }>().req;
    return req.user as AuthenticatedUser | undefined;
  },
);
