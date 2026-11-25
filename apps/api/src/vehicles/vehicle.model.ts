/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Tipo GraphQL `Vehicle`. Representa um veículo da frota da locadora, com os dados
 *   exibidos nos cards da home (imagem, categoria e transmissão).
 */
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Transmission } from '@hermex/shared';
import { Category } from '../categories/category.model';

@ObjectType({ description: 'Veículo da frota' })
export class Vehicle {
  @Field(() => ID)
  id!: string;

  @Field({ description: 'Marca (ex.: Hyundai)' })
  brand!: string;

  @Field({ description: 'Modelo (ex.: HB20)' })
  model!: string;

  @Field(() => Int, { description: 'Ano do modelo' })
  year!: number;

  @Field({ description: 'Placa do veículo' })
  licensePlate!: string;

  @Field(() => Float, { description: 'Valor da diária em reais' })
  dailyRate!: number;

  @Field(() => String, { nullable: true, description: 'URL da imagem do veículo' })
  imageUrl!: string | null;

  @Field(() => Transmission)
  transmission!: Transmission;

  @Field({ description: 'Indica se o veículo pode ser ofertado para locação' })
  available!: boolean;

  @Field(() => Category, { nullable: true })
  category!: Category | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
