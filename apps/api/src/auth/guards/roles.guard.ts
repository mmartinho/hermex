/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Guard de autorização por papel. Lê os papéis exigidos via decorator `@Roles()` e
 *   verifica o papel do usuário autenticado. Deve ser usado depois do GqlAuthGuard.
 */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { UserRole } from '@hermex/shared';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedUser } from '../strategies/jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * @param reflector - Utilitário do Nest para ler metadados de decorators.
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Verifica se o usuário possui algum dos papéis exigidos.
   *
   * @param context - Contexto de execução (GraphQL).
   * @returns `true` se não houver papéis exigidos ou se o usuário tiver um deles.
   * @throws {ForbiddenException} Se o usuário não tiver nenhum dos papéis exigidos.
   */
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }

    const req = GqlExecutionContext.create(context).getContext<{ req: Request }>().req;
    const user = req.user as AuthenticatedUser | undefined;
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Acesso negado para o seu perfil');
    }
    return true;
  }
}
