/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Testes unitários do LocationsResolver: ordenação por nome na consulta ao banco
 *   e retorno da lista (inclusive vazia).
 */
import type { PrismaService } from '../prisma/prisma.service';
import { LocationsResolver } from './locations.resolver';

/** Cria um local fake com o nome informado. */
const makeLocation = (name: string) => ({
  id: `location-${name.toLowerCase()}`,
  name,
  address: 'Av. Exemplo, 100 - Centro',
  city: 'São Paulo',
  state: 'SP',
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('LocationsResolver', () => {
  let prisma: { location: { findMany: jest.Mock } };
  let resolver: LocationsResolver;

  beforeEach(() => {
    prisma = { location: { findMany: jest.fn() } };
    resolver = new LocationsResolver(prisma as unknown as PrismaService);
  });

  describe('locations', () => {
    it('busca os locais ordenados por nome e devolve a lista', async () => {
      const locations = [makeLocation('Centro'), makeLocation('Paulista')];
      prisma.location.findMany.mockResolvedValue(locations);

      await expect(resolver.locations()).resolves.toEqual(locations);
      expect(prisma.location.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
    });

    it('devolve lista vazia quando não há locais', async () => {
      prisma.location.findMany.mockResolvedValue([]);

      await expect(resolver.locations()).resolves.toEqual([]);
    });
  });
});
