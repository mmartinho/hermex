/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do template PublicTemplate (páginas públicas), com e sem o link de login.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '@/components/atoms';
import { PublicTemplate } from './PublicTemplate';

const meta = {
  title: 'Templates/PublicTemplate',
  component: PublicTemplate,
  args: { children: <Text>Conteúdo da página</Text> },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PublicTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComLogin: Story = {};

export const SemLogin: Story = { args: { showLogin: false } };
