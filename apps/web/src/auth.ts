/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Configuração central do Auth.js (NextAuth v5). Define os provedores (Google,
 *   Facebook e email/senha) e delega a identidade para a API Nest, que é a fonte da verdade dos
 *   usuários e emite o JWT usado nas chamadas GraphQL. O JWT da API fica guardado no token de
 *   sessão (cookie httpOnly criptografado) e não é exposto ao navegador.
 */
import { toAuthProvider, type UserRole } from '@hermex/shared';
import NextAuth, { CredentialsSignin, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import { AuthenticateWithProviderDocument, LoginDocument } from '@/gql/graphql';
import { NestApiError, nestRequest } from '@/lib/api/nest-client';
import { AUTH_ERROR_ACCOUNT_CONFLICT, AUTH_ERROR_UNSUPPORTED_PROVIDER } from '@/lib/auth/errors';

/** Duração da sessão (7 dias) — alinhada a `JWT_EXPIRES_IN` da API. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Erro de credenciais inválidas, exposto ao formulário de login. */
class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials';
}

/** Retorno das mutations de autenticação da API. */
interface ApiAuthPayload {
  accessToken: string;
  user: { id: string; email: string; name: string; image?: string | null; role: UserRole };
}

/**
 * Converte o retorno da API no `User` do Auth.js.
 *
 * @param payload - Resultado de `login` ou `authenticateWithProvider`.
 * @returns Usuário do Auth.js contendo id/papel da API e o JWT da API.
 */
function toAuthUser(payload: ApiAuthPayload): User {
  return {
    id: payload.user.id,
    email: payload.user.email,
    name: payload.user.name,
    image: payload.user.image ?? null,
    role: payload.user.role,
    accessToken: payload.accessToken,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  providers: [
    Google,
    Facebook,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      /**
       * Valida email/senha na API Nest.
       *
       * @param credentials - Campos enviados pelo formulário.
       * @returns O usuário autenticado.
       * @throws {InvalidCredentialsError} Se as credenciais forem inválidas.
       * @throws {NestApiError} Para outras falhas da API.
       */
      authorize: async (credentials) => {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!email || !password) {
          throw new InvalidCredentialsError();
        }

        try {
          const { login } = await nestRequest(LoginDocument, { input: { email, password } });
          return toAuthUser(login);
        } catch (error) {
          if (error instanceof NestApiError && error.code === 'UNAUTHENTICATED') {
            throw new InvalidCredentialsError();
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * No login social, registra/autentica o usuário na API Nest e enriquece o `user` com o id,
     * o papel e o JWT da API (o mesmo objeto é repassado ao callback `jwt`).
     *
     * @returns `true` para continuar, ou uma URL de erro para redirecionar.
     */
    async signIn({ user, account, profile }) {
      if (!account || account.type === 'credentials') {
        return true;
      }

      const provider = toAuthProvider(account.provider);
      if (!provider || !user.email) {
        return `/login?error=${AUTH_ERROR_UNSUPPORTED_PROVIDER}`;
      }

      // Só o Google garante explicitamente que o email foi verificado.
      const emailVerified =
        provider === 'GOOGLE' &&
        (profile as { email_verified?: boolean } | undefined)?.email_verified === true;

      try {
        const { authenticateWithProvider } = await nestRequest(
          AuthenticateWithProviderDocument,
          {
            input: {
              provider,
              providerAccountId: account.providerAccountId,
              email: user.email,
              emailVerified,
              name: user.name ?? user.email,
              image: user.image ?? null,
            },
          },
          { internal: true },
        );
        Object.assign(user, toAuthUser(authenticateWithProvider));
        return true;
      } catch (error) {
        if (error instanceof NestApiError && error.code === 'CONFLICT') {
          return `/login?error=${AUTH_ERROR_ACCOUNT_CONFLICT}`;
        }
        throw error;
      }
    },

    /**
     * Persiste no token de sessão os dados vindos da API no momento do login.
     *
     * @returns O token de sessão atualizado.
     */
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.picture = user.image;
      }
      return token;
    },

    /**
     * Expõe id e papel na sessão. O accessToken da API NÃO é exposto.
     *
     * @returns A sessão enviada aos Server/Client Components.
     */
    session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
