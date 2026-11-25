/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Testes unitários do VehiclesResolver: consulta com a categoria incluída e em
 *   ordem determinística, retorno dos campos de imagem, categoria e transmissão e conversão
 *   da diária para número.
 */
import { Prisma } from '../generated/prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import { VehiclesResolver } from './vehicles.resolver';

/**
 * Cria um registro de veículo como o Prisma o devolve (com a categoria incluída).
 *
 * @param overrides - Campos que substituem os valores padrão.
 * @returns O veículo fake.
 */
const makeVehicle = (overrides: Record<string, unknown> = {}) => ({
  id: 'vehicle-1',
  brand: 'Hyundai',
  model: 'HB20',
  year: 2026,
  licensePlate: 'HMX1A01',
  dailyRate: new Prisma.Decimal('129.90'),
  imageUrl: 'https://example.com/hb20.png',
  transmission: 'MANUAL',
  available: true,
  categoryId: 'category-hatch',
  category: {
    id: 'category-hatch',
    name: 'Hatch',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('VehiclesResolver', () => {
  let prisma: { vehicle: { findMany: jest.Mock } };
  let resolver: VehiclesResolver;

  beforeEach(() => {
    prisma = { vehicle: { findMany: jest.fn() } };
    resolver = new VehiclesResolver(prisma as unknown as PrismaService);
  });

  describe('vehicles', () => {
    it('busca os veículos com a categoria em uma única chamada, por marca e modelo', async () => {
      prisma.vehicle.findMany.mockResolvedValue([]);

      await resolver.vehicles();

      expect(prisma.vehicle.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        include: { category: true },
        orderBy: [{ brand: 'asc' }, { model: 'asc' }],
      });
    });

    it('devolve imageUrl, category e transmission junto dos campos anteriores', async () => {
      const record = makeVehicle({ transmission: 'AUTOMATIC' });
      prisma.vehicle.findMany.mockResolvedValue([record]);

      const [vehicle] = await resolver.vehicles();

      expect(vehicle).toMatchObject({
        id: 'vehicle-1',
        brand: 'Hyundai',
        model: 'HB20',
        year: 2026,
        licensePlate: 'HMX1A01',
        imageUrl: 'https://example.com/hb20.png',
        transmission: 'AUTOMATIC',
        available: true,
        category: { id: 'category-hatch', name: 'Hatch' },
      });
    });

    it('converte a diária de Decimal para número', async () => {
      prisma.vehicle.findMany.mockResolvedValue([makeVehicle()]);

      const [vehicle] = await resolver.vehicles();

      expect(vehicle.dailyRate).toBe(129.9);
    });

    it('aceita veículo sem imagem e sem categoria', async () => {
      prisma.vehicle.findMany.mockResolvedValue([
        makeVehicle({ imageUrl: null, categoryId: null, category: null }),
      ]);

      const [vehicle] = await resolver.vehicles();

      expect(vehicle.imageUrl).toBeNull();
      expect(vehicle.category).toBeNull();
    });

    it('devolve lista vazia quando não há veículos', async () => {
      prisma.vehicle.findMany.mockResolvedValue([]);

      await expect(resolver.vehicles()).resolves.toEqual([]);
    });
  });
});
