/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Tipo GraphQL `User`. Representa o usuário exposto pela API — propositalmente sem
 *   campos sensíveis como o hash da senha.
 */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@hermex/shared';

@ObjectType({ description: 'Usuário do Hermex' })
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true, description: 'URL da foto de perfil' })
  image?: string | null;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => Date, { nullable: true, description: 'Quando o email foi verificado' })
  emailVerified?: Date | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
