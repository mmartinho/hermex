/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Resolver GraphQL de usuários. Expõe a query `me`, que retorna o usuário dono do
 *   token JWT enviado na requisição.
 */
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  /**
   * @param usersService - Serviço de usuários.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retorna o usuário autenticado.
   *
   * @param current - Usuário extraído do JWT pelo GqlAuthGuard.
   * @returns Os dados do usuário autenticado.
   * @throws {UnauthorizedException} Se o token estiver ausente ou inválido (via guard).
   * @throws {NotFoundException} Se o usuário do token não existir mais.
   */
  @Query(() => User, { description: 'Usuário autenticado' })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() current: AuthenticatedUser): Promise<User> {
    const user = await this.usersService.findById(current.id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
}
