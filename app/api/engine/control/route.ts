// Route Handler: control actions. Token attached server-side in lib/engine.
import { NextRequest, NextResponse } from 'next/server';
import { pause, flatten, setLimits } from '@/lib/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    switch (body.action) {
      case 'pause':
        await pause(Boolean(body.on));
        break;
      case 'flatten':
        await flatten();
        break;
      case 'limits':
        await setLimits(Number(body.maxPositionFraction));
        break;
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
