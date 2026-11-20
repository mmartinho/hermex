/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Resolver GraphQL de autenticação. Expõe as mutations `login`, `register` e
 *   `authenticateWithProvider` (esta última restrita a chamadas internas do servidor Next).
 */
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, ProviderAuthInput, RegisterInput } from './dto/auth.inputs';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { AuthPayload } from './models/auth-payload.model';

@Resolver()
export class AuthResolver {
  /**
   * @param authService - Serviço de autenticação.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Login com email e senha.
   *
   * @param input - Credenciais.
   * @returns JWT e usuário.
   * @throws {UnauthorizedException} Se as credenciais forem inválidas.
   */
  @Mutation(() => AuthPayload, { description: 'Login com email e senha' })
  login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  /**
   * Cadastro com email e senha.
   *
   * @param input - Dados de cadastro.
   * @returns JWT e usuário criado.
   * @throws {ConflictException} Se o email já estiver em uso.
   */
  @Mutation(() => AuthPayload, { description: 'Cadastro com email e senha' })
  register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  /**
   * Login/cadastro via provedor social. Uso interno: exige o header `x-internal-api-key`.
   *
   * @param input - Identidade retornada pelo provedor social.
   * @returns JWT e usuário.
   * @throws {UnauthorizedException} Se a chave interna estiver ausente/inválida.
   * @throws {ConflictException} Se o email já existir e não puder ser vinculado com segurança.
   */
  @Mutation(() => AuthPayload, {
    description: 'Login social (uso interno do servidor web; exige x-internal-api-key)',
  })
  @UseGuards(InternalApiKeyGuard)
  authenticateWithProvider(@Args('input') input: ProviderAuthInput): Promise<AuthPayload> {
    return this.authService.authenticateWithProvider(input);
  }
}
