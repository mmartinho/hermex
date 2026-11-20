/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Configuração do Prisma CLI (Prisma 7+). Define onde ficam o schema, as migrations,
 *   o comando de seed e a URL do banco (lida de apps/api/.env).
 */
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Fallback permite rodar `prisma generate` (ex.: no postinstall) sem .env configurado.
    url: process.env.DATABASE_URL ?? 'postgresql://hermex:hermex@localhost:5432/hermex',
  },
});
