/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Resolver GraphQL de veículos. Expõe a query pública `vehicles`, somente de
 *   leitura, que traz cada veículo já com a sua categoria (relation do Prisma, sem N+1).
 */
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Vehicle } from './vehicle.model';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  /**
   * @param prisma - Serviço de acesso ao banco.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todos os veículos com a categoria populada. A diária é convertida de `Decimal`
   * (banco) para `number` (GraphQL `Float`).
   *
   * @returns Os veículos ordenados por marca e modelo; lista vazia se não houver nenhum.
   * @throws {Error} Se a consulta ao banco falhar.
   */
  @Query(() => [Vehicle], { description: 'Veículos da frota, ordenados por marca e modelo' })
  async vehicles(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      include: { category: true },
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    });

    return vehicles.map((vehicle) => ({ ...vehicle, dailyRate: vehicle.dailyRate.toNumber() }));
  }
}
