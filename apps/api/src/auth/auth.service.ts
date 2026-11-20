/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Regras de autenticação da API: login com email/senha, cadastro, login social
 *   (criação/vínculo de contas Google/Facebook) e emissão do JWT. A API é a fonte da verdade
 *   dos usuários; o Auth.js no front apenas delega para cá.
 */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokenPayload } from '@hermex/shared';
import { compare } from 'bcryptjs';
import type { User as UserEntity } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import type { LoginInput, ProviderAuthInput, RegisterInput } from './dto/auth.inputs';
import type { AuthPayload } from './models/auth-payload.model';

@Injectable()
export class AuthService {
  /**
   * @param prisma - Cliente do banco de dados.
   * @param usersService - Serviço de usuários.
   * @param jwtService - Serviço de assinatura de JWT (configurado no AuthModule).
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Autentica com email e senha.
   *
   * @param input - Email e senha.
   * @returns JWT e dados do usuário.
   * @throws {UnauthorizedException} Se as credenciais forem inválidas ou se o usuário só
   *   possuir login social (sem senha cadastrada).
   */
  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(input.email);
    const valid = !!user?.passwordHash && (await compare(input.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    return this.buildPayload(user);
  }

  /**
   * Cadastra um usuário com email e senha e já o autentica.
   *
   * @param input - Email, nome e senha.
   * @returns JWT e dados do novo usuário.
   * @throws {ConflictException} Se o email já estiver em uso.
   */
  async register(input: RegisterInput): Promise<AuthPayload> {
    const user = await this.usersService.create(input);
    return this.buildPayload(user);
  }

  /**
   * Autentica (ou cadastra) um usuário vindo de um provedor social.
   *
   * Regras:
   * 1. Se já existir uma conta (provider + providerAccountId), autentica o usuário dono dela.
   * 2. Se não existir conta, mas existir usuário com o mesmo email, vincula a nova conta
   *    **somente se o provedor garantir que o email foi verificado** (evita sequestro de conta).
   * 3. Se não existir usuário, cria usuário + conta.
   *
   * @param input - Identidade retornada pelo provedor.
   * @returns JWT e dados do usuário.
   * @throws {ConflictException} Se o email já pertencer a outro usuário e o provedor não
   *   garantir que o email foi verificado.
   */
  async authenticateWithProvider(input: ProviderAuthInput): Promise<AuthPayload> {
    const email = input.email.trim().toLowerCase();

    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: input.provider,
          providerAccountId: input.providerAccountId,
        },
      },
      include: { user: true },
    });
    if (account) {
      return this.buildPayload(account.user);
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      if (!input.emailVerified) {
        throw new ConflictException(
          'Este email já está cadastrado. Entre com o método usado anteriormente.',
        );
      }
      const linked = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          emailVerified: existing.emailVerified ?? new Date(),
          image: existing.image ?? input.image ?? null,
          accounts: {
            create: { provider: input.provider, providerAccountId: input.providerAccountId },
          },
        },
      });
      return this.buildPayload(linked);
    }

    const created = await this.prisma.user.create({
      data: {
        email,
        name: input.name.trim(),
        image: input.image ?? null,
        emailVerified: input.emailVerified ? new Date() : null,
        accounts: {
          create: { provider: input.provider, providerAccountId: input.providerAccountId },
        },
      },
    });
    return this.buildPayload(created);
  }

  /**
   * Gera o JWT da API para um usuário e monta o retorno das mutations.
   *
   * @param user - Usuário autenticado.
   * @returns JWT assinado e dados do usuário.
   */
  private async buildPayload(user: UserEntity): Promise<AuthPayload> {
    const payload: AuthTokenPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
}
