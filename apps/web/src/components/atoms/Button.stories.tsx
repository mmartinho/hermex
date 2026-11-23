/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Button: variantes do Figma (primário, secundário, fantasma),
 *   estados (padrão, hover, pressed, foco), ícone, carregamento e largura total.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'Átomos/Button',
  component: Button,
  args: { children: 'Botão primário', variant: 'primary' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    icon: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primario: Story = {};

export const Secundario: Story = {
  args: { variant: 'secondary', children: 'Buscar' },
};

export const Fantasma: Story = {
  args: { variant: 'ghost', icon: 'login', children: 'Login' },
};

export const ComIcone: Story = {
  args: { icon: 'add' },
};

export const Carregando: Story = {
  args: { loading: true, children: 'Entrando…' },
};

export const LarguraTotal: Story = {
  args: { fullWidth: true, children: 'Ver detalhes' },
  decorators: [(Story) => <div className="w-[278px]">{Story()}</div>],
};

/** Estados do Figma lado a lado (hover/pressed/foco simulados pelo addon de pseudo-estados). */
export const Estados: Story = {
  parameters: {
    pseudo: { hover: ['.is-hover'], active: ['.is-pressed'], focusVisible: ['.is-focus'] },
  },
  render: (args) => (
    <div className="grid grid-cols-4 items-center gap-4">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="contents">
          <Button {...args} variant={variant}>
            Padrão
          </Button>
          <Button {...args} variant={variant} className="is-hover">
            Hover
          </Button>
          <Button {...args} variant={variant} className="is-pressed">
            Pressed
          </Button>
          <Button {...args} variant={variant} className="is-focus">
            Foco
          </Button>
        </div>
      ))}
    </div>
  ),
};
