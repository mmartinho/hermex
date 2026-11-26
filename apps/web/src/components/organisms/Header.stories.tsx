/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-26
 * Descrição: Stories do organismo Header (US07 / HRMX-7), refeito a partir do Figma
 *   (node 66:997): versão deslogada padrão (desktop, tablet e mobile), com ações
 *   personalizadas e sem ações.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, Button } from '@/components/atoms';
import { Header } from './Header';

const meta = {
  title: 'Organismos/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Padrão (Figma "1920 Deslogado"): logo, busca e links Cadastro/Login. */
export const Deslogado: Story = {};

/** Layout do Figma "768 Deslogado" (viewport `tablet`): logo menor e links com padding. */
export const Tablet: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
};

/** Layout do Figma "360 Deslogado" (viewport `mobile1`, 320px): busca na 2ª linha e links empilhados. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/** Área da direita substituída pelo template (ex.: usuário logado). */
export const AcoesPersonalizadas: Story = {
  args: {
    actions: (
      <div className="flex items-center gap-3">
        <Avatar name="Maria Silva" />
        <Button variant="ghost">Sair</Button>
      </div>
    ),
  },
};

/** `actions={null}`: sem links (ex.: página de login). */
export const SemAcoes: Story = { args: { actions: null } };
