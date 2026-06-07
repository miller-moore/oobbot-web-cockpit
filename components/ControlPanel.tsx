// components/ControlPanel.tsx — guarded control actions.
// flatten requires explicit confirmation (CLAUDE.md rule 2).
'use client';

import { useState } from 'react';
import { sendControl } from '@/lib/useStatus';

export function ControlPanel({ paused, onChange }: { paused: boolean; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [confirmFlatten, setConfirmFlatten] = useState(false);

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await sendControl(body);
      onChange();
    } catch (e) {
      alert(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button disabled={busy} onClick={() => act({ action: 'pause', on: !paused })}>
        {paused ? 'Resume' : 'Pause'}
      </button>

      {!confirmFlatten ? (
        <button disabled={busy} onClick={() => setConfirmFlatten(true)}>
          Flatten…
        </button>
      ) : (
        <span style={{ display: 'flex', gap: 8 }}>
          <strong style={{ color: 'var(--amber)' }}>Close ALL positions?</strong>
          <button
            disabled={busy}
            onClick={async () => {
              await act({ action: 'flatten' });
              setConfirmFlatten(false);
            }}
          >
            Yes, flatten
          </button>
          <button disabled={busy} onClick={() => setConfirmFlatten(false)}>
            Cancel
          </button>
        </span>
      )}
    </div>
  );
}
