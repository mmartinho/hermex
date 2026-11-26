/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-25
 * Descrição: Seed do banco. Cria (ou atualiza) o usuário administrador inicial usando
 *   SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD de apps/api/.env, e cadastra as categorias de
 *   veículos, os locais e os veículos de exemplo. É idempotente. Executado com `pnpm db:seed`.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Categorias de veículos exibidas no filtro da home. */
const CATEGORY_NAMES = ['Hatch', 'Sedan', 'SUV', 'Minivan', 'Picape'];

/** Locais de exemplo (endereços fictícios) para retirada e devolução. */
const LOCATIONS = [
  {
    name: 'Hermex Belo Horizonte Centro',
    address: 'Av. Exemplo, 100 - Centro',
    city: 'Belo Horizonte',
    state: 'MG',
  },
  {
    name: 'Hermex Rio de Janeiro Centro',
    address: 'Rua Exemplo, 200 - Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    name: 'Hermex São Paulo Paulista',
    address: 'Av. Exemplo, 300 - Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  },
];

/** Veículos de exemplo (placas fictícias), sem imagem. */
const VEHICLES = [
  {
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2025,
    licensePlate: 'HMX1A01',
    dailyRate: '119.90',
    transmission: 'MANUAL',
    category: 'Hatch',
  },
  {
    brand: 'Hyundai',
    model: 'HB20',
    year: 2026,
    licensePlate: 'HMX1A02',
    dailyRate: '139.90',
    transmission: 'AUTOMATIC',
    category: 'Hatch',
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2026,
    licensePlate: 'HMX1A03',
    dailyRate: '229.90',
    transmission: 'AUTOMATIC',
    category: 'Sedan',
  },
  {
    brand: 'Jeep',
    model: 'Compass',
    year: 2025,
    licensePlate: 'HMX1A04',
    dailyRate: '279.90',
    transmission: 'AUTOMATIC',
    category: 'SUV',
  },
  {
    brand: 'Chevrolet',
    model: 'Spin',
    year: 2025,
    licensePlate: 'HMX1A05',
    dailyRate: '199.90',
    transmission: 'AUTOMATIC',
    category: 'Minivan',
  },
  {
    brand: 'Fiat',
    model: 'Strada',
    year: 2026,
    licensePlate: 'HMX1A06',
    dailyRate: '169.90',
    transmission: 'MANUAL',
    category: 'Picape',
  },
  {
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2024,
    licensePlate: 'HMX1A07',
    dailyRate: '129.90',
    transmission: 'MANUAL',
    category: 'Hatch',
    available: false,
  },
] as const;

/**
 * Cria/atualiza o administrador.
 *
 * @returns Promise resolvida ao final do cadastro.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function seedAdmin(): Promise<void> {
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@hermex.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      name: 'Administrador',
      role: 'ADMIN',
      emailVerified: new Date(),
      passwordHash: await hash(password, 10),
    },
  });

  console.warn(`Seed concluído: admin ${admin.email} (${admin.id})`);
}

/**
 * Cadastra as categorias que ainda não existem (upsert pelo nome, que é único).
 *
 * @returns Promise resolvida ao final do cadastro.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function seedCategories(): Promise<void> {
  for (const name of CATEGORY_NAMES) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.warn(`Seed concluído: ${CATEGORY_NAMES.length} categorias`);
}

/**
 * Cadastra os locais de exemplo que ainda não existem (upsert pelo nome, que é único).
 *
 * @returns Promise resolvida ao final do cadastro.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function seedLocations(): Promise<void> {
  for (const location of LOCATIONS) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: location,
    });
  }

  console.warn(`Seed concluído: ${LOCATIONS.length} locais`);
}

/**
 * Cadastra os veículos de exemplo que ainda não existem (upsert pela placa, que é única),
 * vinculando cada um à sua categoria. Depende de `seedCategories` já ter sido executado.
 *
 * @returns Promise resolvida ao final do cadastro.
 * @throws {Error} Se o banco estiver inacessível ou a categoria do veículo não existir.
 */
async function seedVehicles(): Promise<void> {
  for (const { category, ...vehicle } of VEHICLES) {
    await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: {},
      create: { ...vehicle, category: { connect: { name: category } } },
    });
  }

  console.warn(`Seed concluído: ${VEHICLES.length} veículos`);
}

/**
 * Executa todas as etapas do seed.
 *
 * @returns Promise resolvida ao final do seed.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function main(): Promise<void> {
  await seedAdmin();
  await seedCategories();
  await seedLocations();
  await seedVehicles();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
