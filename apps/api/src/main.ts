/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Ponto de entrada da API Hermex. Cria a aplicação Nest, aplica validação global
 *   dos inputs, configura CORS para o front-end e inicia o servidor HTTP (GraphQL em /graphql).
 */
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Inicializa e sobe a aplicação Nest.
 *
 * @returns Promise resolvida quando o servidor começa a escutar a porta configurada.
 * @throws {Error} Se a configuração obrigatória estiver ausente ou a porta estiver ocupada.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(','),
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  Logger.log(`API disponível em http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
