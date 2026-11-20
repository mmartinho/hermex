/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Testes unitários do AuthService, com foco nas regras de login social
 *   (reuso de conta, vínculo por email verificado e bloqueio de vínculo inseguro) e login com senha.
 */
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import type { PrismaService } from '../prisma/prisma.service';
import type { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { ProviderAuthInput } from './dto/auth.inputs';

/** Cria um usuário fake com valores padrão. */
const makeUser = (overrides: Record<string, unknown> = {}) => ({
  id: 'user-1',
  email: 'ana@example.com',
  name: 'Ana',
  image: null,
  emailVerified: null,
  passwordHash: null,
  role: 'CUSTOMER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const googleInput: ProviderAuthInput = {
  provider: 'GOOGLE',
  providerAccountId: 'google-123',
  email: 'Ana@Example.com',
  emailVerified: true,
  name: 'Ana',
  image: 'https://example.com/ana.png',
};

describe('AuthService', () => {
  let prisma: {
    account: { findUnique: jest.Mock };
    user: { update: jest.Mock; create: jest.Mock };
  };
  let users: { findByEmail: jest.Mock; create: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      account: { findUnique: jest.fn() },
      user: { update: jest.fn(), create: jest.fn() },
    };
    users = { findByEmail: jest.fn(), create: jest.fn() };
    service = new AuthService(
      prisma as unknown as PrismaService,
      users as unknown as UsersService,
      new JwtService({ secret: 'test-secret-with-enough-length' }),
    );
  });

  describe('authenticateWithProvider', () => {
    it('reutiliza a conta social já vinculada', async () => {
      prisma.account.findUnique.mockResolvedValue({ user: makeUser() });

      const result = await service.authenticateWithProvider(googleInput);

      expect(result.user.id).toBe('user-1');
      expect(result.accessToken).toEqual(expect.any(String));
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('vincula a um usuário existente quando o email é verificado', async () => {
      prisma.account.findUnique.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue(makeUser({ emailVerified: new Date() }));

      await service.authenticateWithProvider(googleInput);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      );
    });

    it('recusa vincular quando o provedor não verificou o email', async () => {
      prisma.account.findUnique.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(makeUser());

      await expect(
        service.authenticateWithProvider({ ...googleInput, emailVerified: false }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('cria usuário + conta quando o email é novo (normalizando o email)', async () => {
      prisma.account.findUnique.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(makeUser());

      await service.authenticateWithProvider(googleInput);

      const [[args]] = prisma.user.create.mock.calls as [[{ data: { email: string } }]];
      expect(args.data.email).toBe('ana@example.com');
    });
  });

  describe('login', () => {
    it('autentica com senha correta', async () => {
      users.findByEmail.mockResolvedValue(makeUser({ passwordHash: await hash('Senha@123', 4) }));

      const result = await service.login({ email: 'ana@example.com', password: 'Senha@123' });

      expect(result.user.email).toBe('ana@example.com');
    });

    it('recusa usuário sem senha (somente login social)', async () => {
      users.findByEmail.mockResolvedValue(makeUser());

      await expect(
        service.login({ email: 'ana@example.com', password: 'qualquer' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
