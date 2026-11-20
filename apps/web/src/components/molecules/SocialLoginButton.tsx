/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Molécula SocialLoginButton. Formulário de um botão que inicia o login com um
 *   provedor social (Google ou Facebook) via Server Action.
 */
import { Button } from '@/components/atoms';
import { loginWithProvider, type SocialProvider } from '@/lib/auth/actions';

export interface SocialLoginButtonProps {
  /** Provedor social. */
  provider: SocialProvider;
  /** Caminho para voltar após o login. */
  callbackUrl?: string;
}

const PROVIDERS: Record<SocialProvider, { label: string; icon: React.ReactNode }> = {
  google: {
    label: 'Continuar com Google',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
        />
      </svg>
    ),
  },
  facebook: {
    label: 'Continuar com Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"
        />
      </svg>
    ),
  },
};

/**
 * Botão de login social.
 *
 * @param props - Provedor e URL de retorno.
 * @returns Formulário com o botão do provedor.
 */
export function SocialLoginButton({ provider, callbackUrl }: SocialLoginButtonProps) {
  const { label, icon } = PROVIDERS[provider];
  return (
    <form action={loginWithProvider.bind(null, provider, callbackUrl)}>
      <Button type="submit" variant="secondary" fullWidth>
        {icon}
        {label}
      </Button>
    </form>
  );
}
