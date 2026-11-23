/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Heading: escala de títulos do Figma (xxl a xs) e o título do banner.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading } from './Heading';

const SIZES = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

const meta = {
  title: 'Átomos/Heading',
  component: Heading,
  args: { size: 'md', children: 'Encontre o carro ideal' },
  argTypes: { size: { control: 'inline-radio', options: SIZES } },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Escala: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 text-neutral-text">
      {SIZES.map((size) => (
        <Heading key={size} {...args} size={size}>
          heading-{size}
        </Heading>
      ))}
    </div>
  ),
};

export const Banner: Story = {
  args: { size: 'xxl', className: 'max-w-[672px] text-neutral-white' },
  globals: { backgrounds: { value: 'secondary' } },
  render: (args) => (
    <Heading {...args}>
      <span className="text-primary">Encontre o carro ideal</span> para todas as ocasiões
    </Heading>
  ),
};
