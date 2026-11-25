/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Resolver GraphQL de locais. Expõe a query pública `locations`, somente de
 *   leitura; os locais são gerenciados via seed (e, no futuro, por um administrador).
 */
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Location } from './location.model';

@Resolver(() => Location)
export class LocationsResolver {
  /**
   * @param prisma - Serviço de acesso ao banco.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todos os locais, sem paginação (a lista é curta).
   *
   * @returns Os locais ordenados por nome (A-Z); lista vazia se não houver nenhum.
   * @throws {Error} Se a consulta ao banco falhar.
   */
  @Query(() => [Location], { description: 'Locais de retirada e devolução, ordenados por nome' })
  locations(): Promise<Location[]> {
    return this.prisma.location.findMany({ orderBy: { name: 'asc' } });
  }
}
