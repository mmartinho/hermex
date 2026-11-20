/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Route Handler do Auth.js. Atende os endpoints /api/auth/* (signin, callback dos
 *   provedores sociais, signout, session, csrf).
 */
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
