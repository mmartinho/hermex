/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula NavLink: links "Cadastro" e "Login" do header, destaque e os
 *   estados do componente "Links" do Figma.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavLink } from './NavLink';

const meta = {
  title: 'Moléculas/NavLink',
  component: NavLink,
  args: { href: '/login', children: 'Login', icon: 'login' },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {};

export const Cadastro: Story = {
  args: { href: '/cadastro', children: 'Cadastro', icon: 'account_circle' },
};

export const SemIcone: Story = {
  args: { icon: undefined, children: 'Botão texto' },
};

export const Destaque: Story = {
  args: { highlight: true, icon: undefined, children: 'Entrar' },
};

const STATES = [
  { label: 'Padrão', className: '' },
  { label: 'Hover', className: 'is-hover' },
  { label: 'Pressed', className: 'is-pressed' },
  { label: 'Foco', className: 'is-focus' },
];

export const Estados: Story = {
  parameters: {
    pseudo: { hover: ['.is-hover'], active: ['.is-pressed'], focusVisible: ['.is-focus'] },
  },
  render: (args) => (
    <div className="flex items-center gap-8">
      {STATES.map(({ label, className }) => (
        <NavLink key={label} {...args} className={className}>
          {label}
        </NavLink>
      ))}
    </div>
  ),
};
