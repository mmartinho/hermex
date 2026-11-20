/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Inputs GraphQL das mutations de autenticação (login, cadastro e login social),
 *   com validação via class-validator.
 */
import { Field, InputType } from '@nestjs/graphql';
import { AuthProvider } from '@hermex/shared';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType({ description: 'Credenciais de login com email e senha' })
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

@InputType({ description: 'Dados para cadastro com email e senha' })
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(72) // limite do bcrypt
  password!: string;
}

@InputType({
  description: 'Identidade obtida de um provedor social (uso interno: servidor Next -> API)',
})
export class ProviderAuthInput {
  @Field(() => AuthProvider)
  @IsIn(Object.values(AuthProvider))
  provider!: AuthProvider;

  @Field({ description: 'Id do usuário no provedor' })
  @IsString()
  @IsNotEmpty()
  providerAccountId!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ description: 'Se o provedor garante que o email foi verificado' })
  @IsBoolean()
  emailVerified!: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  image?: string | null;
}
