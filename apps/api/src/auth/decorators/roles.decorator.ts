/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Decorator `@Roles()` que declara quais papéis podem acessar um resolver/campo.
 *   É interpretado pelo RolesGuard.
 */
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import type { UserRole } from '@hermex/shared';

/** Chave dos metadados de papéis exigidos. */
export const ROLES_KEY = 'roles';

/**
 * Define os papéis autorizados.
 *
 * @param roles - Papéis que podem acessar o recurso.
 * @returns Decorator que grava os papéis nos metadados do handler/classe.
 * @example
 *   @UseGuards(GqlAuthGuard, RolesGuard)
 *   @Roles(UserRole.ADMIN)
 */
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
