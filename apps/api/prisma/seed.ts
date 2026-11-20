/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Seed do banco. Cria (ou atualiza) o usuário administrador inicial usando
 *   SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD de apps/api/.env. Executado com `pnpm db:seed`.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/**
 * Cria/atualiza o administrador.
 *
 * @returns Promise resolvida ao final do seed.
 * @throws {Error} Se o banco estiver inacessível.
 */
async function main(): Promise<void> {
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

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
