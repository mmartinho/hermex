/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-25
 * Data Atualização: 2026-11-25
 * Descrição: Módulo de veículos da frota. Registra o resolver de veículos; o PrismaService vem
 *   do PrismaModule, que é global.
 */
import { Module } from '@nestjs/common';
import { VehiclesResolver } from './vehicles.resolver';

@Module({
  providers: [VehiclesResolver],
})
export class VehiclesModule {}
