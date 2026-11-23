/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula SocialLinks: ícones das redes sociais do rodapé.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialLinks } from './SocialLinks';

const meta = {
  title: 'Moléculas/SocialLinks',
  component: SocialLinks,
  args: {
    links: [
      { network: 'whatsapp', href: 'https://wa.me/' },
      { network: 'instagram', href: 'https://www.instagram.com/' },
      { network: 'tiktok', href: 'https://www.tiktok.com/' },
    ],
  },
  globals: { backgrounds: { value: 'secondary' } },
} satisfies Meta<typeof SocialLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rodape: Story = {};
