/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do organismo LoginForm. As Server Actions de login são substituídas por um
 *   mock no Storybook: enviar o formulário sempre mostra a mensagem de erro de exemplo.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Organismos/LoginForm',
  component: LoginForm,
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComErroInicial: Story = {
  args: { initialError: 'Sua sessão expirou. Entre novamente.' },
};
