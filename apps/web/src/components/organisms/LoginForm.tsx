/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Organismo LoginForm (Client Component). Destaca o login social (Google/Facebook)
 *   e oferece, abaixo, o login com email e senha.
 */
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/atoms';
import { FormField, SocialLoginButton } from '@/components/molecules';
import { type LoginFormState, loginWithCredentials } from '@/lib/auth/actions';

export interface LoginFormProps {
  /** Caminho para voltar após o login. */
  callbackUrl?: string;
  /** Mensagem de erro vinda da URL (ex.: falha no login social). */
  initialError?: string | null;
}

/**
 * Formulário de login.
 *
 * @param props - URL de retorno e erro inicial.
 * @returns Cartão com botões sociais e formulário de email/senha.
 */
export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    loginWithCredentials,
    {},
  );
  const error = state.error ?? initialError;

  return (
    <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Entrar no Hermex</h1>
        <p className="text-sm text-slate-500">Alugue seu carro em poucos cliques.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <SocialLoginButton provider="google" callbackUrl={callbackUrl} />
        <SocialLoginButton provider="facebook" callbackUrl={callbackUrl} />
      </div>

      <div className="flex items-center gap-3 text-xs uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        ou com email
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? ''} />
        <FormField id="email" label="Email" type="email" autoComplete="email" required />
        <FormField
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" fullWidth loading={pending}>
          Entrar
        </Button>
      </form>
    </div>
  );
}
