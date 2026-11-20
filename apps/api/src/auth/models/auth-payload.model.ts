/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Tipo GraphQL de retorno das mutations de autenticação: o JWT emitido pela API
 *   e os dados do usuário autenticado.
 */
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType({ description: 'Resultado de uma autenticação bem-sucedida' })
export class AuthPayload {
  @Field({ description: 'JWT a ser enviado em `Authorization: Bearer <token>`' })
  accessToken!: string;

  @Field(() => User)
  user!: User;
}
