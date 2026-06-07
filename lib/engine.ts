// lib/engine.ts — SERVER ONLY. Never import this into a client component.
// Centralises every call to the oobbot control API and attaches the
// bearer token server-side so it never reaches the browser bundle.

import 'server-only';
import type { EngineStatus } from './types';

const BASE = process.env.ENGINE_BASE_URL;
const TOKEN = process.env.COCKPIT_API_TOKEN;

function authHeaders(): HeadersInit {
  if (!TOKEN) throw new Error('COCKPIT_API_TOKEN is not set (server env).');
  return { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
}

function url(path: string): string {
  if (!BASE) throw new Error('ENGINE_BASE_URL is not set (server env).');
  return `${BASE}${path}`;
}

export async function getStatus(): Promise<EngineStatus> {
  const r = await fetch(url('/status'), { cache: 'no-store' });
  if (!r.ok) throw new Error(`engine /status ${r.status}`);
  return r.json();
}

export async function pause(on: boolean): Promise<void> {
  const r = await fetch(url(`/control/pause?on=${on}`), {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!r.ok) throw new Error(`engine pause ${r.status}`);
}

export async function flatten(): Promise<void> {
  const r = await fetch(url('/control/flatten'), {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!r.ok) throw new Error(`engine flatten ${r.status}`);
}

export async function setLimits(maxPositionFraction: number): Promise<void> {
  const r = await fetch(url('/control/limits'), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ max_position_fraction: maxPositionFraction }),
  });
  if (!r.ok) throw new Error(`engine limits ${r.status}`);
}
