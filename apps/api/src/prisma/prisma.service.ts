/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Serviço de acesso ao banco via Prisma Client (Prisma 7, driver adapter `pg`).
 *   Abre a conexão quando o módulo inicia e a encerra no shutdown da aplicação.
 */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * @param config - Serviço de configuração, usado para ler `DATABASE_URL`.
   * @throws {TypeError} Se `DATABASE_URL` não estiver definida.
   */
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: config.getOrThrow<string>('DATABASE_URL') }),
    });
  }

  /**
   * Conecta ao banco ao iniciar o módulo.
   *
   * @returns Promise resolvida após a conexão.
   * @throws {Error} Se o banco estiver inacessível.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Fecha a conexão com o banco ao encerrar a aplicação.
   *
   * @returns Promise resolvida após a desconexão.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
