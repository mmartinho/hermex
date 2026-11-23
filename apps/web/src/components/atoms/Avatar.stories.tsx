/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Avatar: iniciais em tamanhos diferentes e sem nome.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Átomos/Avatar',
  component: Avatar,
  args: { name: 'Maria Souza', size: 36 },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Iniciais: Story = {};

export const Grande: Story = { args: { size: 64 } };

export const SemNome: Story = { args: { name: null } };
