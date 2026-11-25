/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-25
 * Descrição: Módulo raiz da API. Registra a configuração (variáveis de ambiente validadas),
 *   o servidor GraphQL code-first (Apollo), o acesso ao banco (Prisma) e os módulos de
 *   domínio (usuários, autenticação, categorias, locais e veículos).
 */
import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import './common/graphql/enums';
import { createFormatError } from './common/graphql/format-error';
import { validateEnv } from './config/env.validation';
import { LocationsModule } from './locations/locations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService): ApolloDriverConfig => {
        const isDev = config.get<string>('NODE_ENV') !== 'production';
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: false,
          introspection: isDev,
          plugins: isDev ? [ApolloServerPluginLandingPageLocalDefault()] : [],
          formatError: createFormatError(isDev),
          context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
        };
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    LocationsModule,
    VehiclesModule,
  ],
})
export class AppModule {}
