/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Tipo GraphQL `Location`. Representa uma filial/ponto de retirada e devolução de
 *   veículos da locadora.
 */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Local de retirada e devolução de veículos' })
export class Location {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  address!: string;

  @Field()
  city!: string;

  @Field({ description: 'Sigla da UF (ex.: SP)' })
  state!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
