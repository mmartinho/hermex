/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do organismo Header (versão do bootstrap, ainda não refeita a partir do
 *   Figma), com links de navegação na área de ações.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavLink } from '@/components/molecules';
import { Header } from './Header';

const meta = {
  title: 'Organismos/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Deslogado: Story = {
  args: {
    actions: (
      <>
        <NavLink href="/cadastro" icon="account_circle">
          Cadastro
        </NavLink>
        <NavLink href="/login" icon="login">
          Login
        </NavLink>
      </>
    ),
  },
};

export const SemAcoes: Story = {};
