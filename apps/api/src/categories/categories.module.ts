/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Módulo de categorias de veículos. Registra o resolver de categorias; o
 *   PrismaService vem do PrismaModule, que é global.
 */
import { Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver';

@Module({
  providers: [CategoriesResolver],
})
export class CategoriesModule {}
