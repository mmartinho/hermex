/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-25
 * Descrição: Registro dos enums compartilhados (@hermex/shared) no schema GraphQL code-first.
 *   Deve ser importado uma única vez na inicialização (feito em app.module.ts).
 */
import { registerEnumType } from '@nestjs/graphql';
import { AuthProvider, Transmission, UserRole } from '@hermex/shared';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Papel (perfil de acesso) do usuário',
});

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
  description: 'Provedor de login social',
});

registerEnumType(Transmission, {
  name: 'Transmission',
  description: 'Tipo de transmissão (câmbio) do veículo',
});
