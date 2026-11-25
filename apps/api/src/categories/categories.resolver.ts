/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Resolver GraphQL de categorias. Expõe a query pública `categories`, somente de
 *   leitura; as categorias são gerenciadas via seed/migration.
 */
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './category.model';

@Resolver(() => Category)
export class CategoriesResolver {
  /**
   * @param prisma - Serviço de acesso ao banco.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todas as categorias, sem paginação (a lista é curta e fixa).
   *
   * @returns As categorias ordenadas por nome (A-Z); lista vazia se não houver nenhuma.
   * @throws {Error} Se a consulta ao banco falhar.
   */
  @Query(() => [Category], { description: 'Categorias de veículos, ordenadas por nome' })
  categories(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
}
