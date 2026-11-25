/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-25
 * Descrição: Seed do banco. Cria (ou atualiza) o usuário administrador inicial usando
 *   SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD de apps/api/.env, e cadastra as categorias de
 *   veículos. É idempotente. Executado com `pnpm db:seed`.
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
 * Executa todas as etapas do seed.
 *
 * @returns Promise resolvida ao final do seed.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function main(): Promise<void> {
  await seedAdmin();
  await seedCategories();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
