/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Módulo de locais de retirada e devolução. Registra o resolver de locais; o
 *   PrismaService vem do PrismaModule, que é global.
 */
import { Module } from '@nestjs/common';
import { LocationsResolver } from './locations.resolver';

@Module({
  providers: [LocationsResolver],
})
export class LocationsModule {}
