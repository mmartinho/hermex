/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do organismo ProfileCard com um usuário de exemplo.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileCard } from './ProfileCard';

const meta = {
  title: 'Organismos/ProfileCard',
  component: ProfileCard,
  args: {
    user: {
      id: 'usr_1',
      email: 'maria.souza@exemplo.com',
      name: 'Maria Souza',
      image: null,
      role: 'CUSTOMER',
      emailVerified: '2026-11-19T12:00:00.000Z',
      createdAt: '2026-11-19T12:00:00.000Z',
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cliente: Story = {};
