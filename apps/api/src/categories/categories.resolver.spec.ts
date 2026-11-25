/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Testes unitários do CategoriesResolver: ordenação por nome na consulta ao banco
 *   e retorno da lista (inclusive vazia).
 */
import type { PrismaService } from '../prisma/prisma.service';
import { CategoriesResolver } from './categories.resolver';

/** Cria uma categoria fake com o nome informado. */
const makeCategory = (name: string) => ({
  id: `category-${name.toLowerCase()}`,
  name,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('CategoriesResolver', () => {
  let prisma: { category: { findMany: jest.Mock } };
  let resolver: CategoriesResolver;

  beforeEach(() => {
    prisma = { category: { findMany: jest.fn() } };
    resolver = new CategoriesResolver(prisma as unknown as PrismaService);
  });

  describe('categories', () => {
    it('busca as categorias ordenadas por nome e devolve a lista', async () => {
      const categories = [makeCategory('Hatch'), makeCategory('Sedan')];
      prisma.category.findMany.mockResolvedValue(categories);

      await expect(resolver.categories()).resolves.toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
    });

    it('devolve lista vazia quando não há categorias', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      await expect(resolver.categories()).resolves.toEqual([]);
    });
  });
});
