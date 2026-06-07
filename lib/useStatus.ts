// lib/useStatus.ts — client hook polling the server-proxied status route.
'use client';

import useSWR from 'swr';
import type { EngineStatus } from './types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useStatus() {
  const { data, error, isLoading, mutate } = useSWR<EngineStatus>(
    '/api/engine/status',
    fetcher,
    { refreshInterval: 2000 }, // 2s poll; engine /status is cheap
  );
  return { status: data, error, isLoading, refresh: mutate };
}

export async function sendControl(body: Record<string, unknown>): Promise<void> {
  const r = await fetch('/api/engine/control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`control failed: ${r.status}`);
}
