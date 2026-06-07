// Route Handler: proxies engine /status to the browser WITHOUT exposing the token.
import { NextResponse } from 'next/server';
import { getStatus } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getStatus());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
