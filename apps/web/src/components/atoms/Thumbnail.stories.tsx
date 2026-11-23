/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Thumbnail: moldura da foto do carro.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Thumbnail } from './Thumbnail';

const meta = {
  title: 'Átomos/Thumbnail',
  component: Thumbnail,
  args: { src: '/storybook/hb20.png', alt: 'Hyundai HB20 1.0 preto' },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
