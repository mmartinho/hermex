/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula SocialLoginButton (Google e Facebook). No Storybook a Server
 *   Action de login é substituída por um mock (ver `.storybook/mocks/auth-actions.ts`).
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialLoginButton } from './SocialLoginButton';

const meta = {
  title: 'Moléculas/SocialLoginButton',
  component: SocialLoginButton,
  args: { provider: 'google' },
  argTypes: { provider: { control: 'inline-radio', options: ['google', 'facebook'] } },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {};

export const Facebook: Story = { args: { provider: 'facebook' } };
