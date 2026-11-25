/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Tipo GraphQL `Category`. Representa uma categoria de veículo (ex.: SUV, Sedan),
 *   usada para filtrar a frota.
 */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Categoria de veículo' })
export class Category {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
