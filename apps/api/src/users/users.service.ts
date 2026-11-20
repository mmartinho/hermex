/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Regras de acesso a dados de usuários: consultas por id/email e criação com
 *   senha (hash bcrypt). A lógica de login social fica no AuthService.
 */
import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import type { User as UserEntity } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Custo (salt rounds) do bcrypt. */
export const BCRYPT_ROUNDS = 10;

/** Dados para criar um usuário com email e senha. */
export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class UsersService {
  /**
   * @param prisma - Cliente do banco de dados.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca um usuário pelo id.
   *
   * @param id - Id (UUID) do usuário.
   * @returns O usuário encontrado, ou `null` se não existir.
   */
  findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Busca um usuário pelo email (normalizado em minúsculas).
   *
   * @param email - Email do usuário.
   * @returns O usuário encontrado, ou `null` se não existir.
   */
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  }

  /**
   * Cria um usuário com email e senha (papel padrão: CUSTOMER).
   *
   * @param data - Email, nome e senha em texto puro (será armazenada como hash bcrypt).
   * @returns O usuário criado.
   * @throws {ConflictException} Se já existir um usuário com o mesmo email.
   */
  async create(data: CreateUserData): Promise<UserEntity> {
    const email = data.email.trim().toLowerCase();
    if (await this.findByEmail(email)) {
      throw new ConflictException('Já existe um usuário cadastrado com este email');
    }

    return this.prisma.user.create({
      data: {
        email,
        name: data.name.trim(),
        passwordHash: await hash(data.password, BCRYPT_ROUNDS),
      },
    });
  }
}
