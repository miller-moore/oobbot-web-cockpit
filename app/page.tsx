// app/page.tsx — operator dashboard. Client component (live polling).
'use client';

import { useStatus } from '@/lib/useStatus';
import { ControlPanel } from '@/components/ControlPanel';

function money(n: number | undefined): string {
  if (n === undefined) return '—';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function Dashboard() {
  const { status, error, isLoading, refresh } = useStatus();

  if (isLoading) return <main style={{ padding: 24 }}>connecting to engine…</main>;
  if (error || !status)
    return (
      <main style={{ padding: 24, color: 'var(--red)' }}>
        engine unreachable. Is the control API running at ENGINE_BASE_URL?
      </main>
    );

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 18, letterSpacing: 1 }}>RL COCKPIT</h1>
        <span style={{ color: status.paused ? 'var(--amber)' : 'var(--green)' }}>
          {status.paused ? '⏸ PAUSED' : '● LIVE'}
        </span>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Stat label="Equity" value={money(status.equity)} />
        <Stat label="Day PnL" value={money(status.pnl?.dayPnl)} signed={status.pnl?.dayPnl} />
        <Stat label="Total PnL" value={money(status.pnl?.totalPnl)} signed={status.pnl?.totalPnl} />
        <Stat label="Open positions" value={String(status.positions?.length ?? 0)} />
      </section>

      <section style={panel}>
        <h2 style={h2}>Constraint multipliers</h2>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>λ_dd {status.lambdas?.drawdown?.toFixed(3)}</span>
          <span>λ_to {status.lambdas?.turnover?.toFixed(3)}</span>
          <span>λ_in {status.lambdas?.inertia?.toFixed(3)}</span>
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Positions</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--muted)', textAlign: 'right' }}>
              <th style={{ textAlign: 'left' }}>Instrument</th>
              <th>Size</th>
              <th>Notional</th>
              <th>uPnL</th>
            </tr>
          </thead>
          <tbody>
            {(status.positions ?? []).map((p) => (
              <tr key={p.instrument} style={{ textAlign: 'right' }}>
                <td style={{ textAlign: 'left' }}>{p.instrument}</td>
                <td>{p.size}</td>
                <td>{money(p.notional)}</td>
                <td className={p.unrealizedPnl >= 0 ? 'pos' : 'neg'}>{money(p.unrealizedPnl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={panel}>
        <h2 style={h2}>Control</h2>
        <ControlPanel paused={status.paused} onChange={refresh} />
      </section>
    </main>
  );
}

const panel: React.CSSProperties = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 16,
};
const h2: React.CSSProperties = { fontSize: 12, color: 'var(--muted)', marginBottom: 8 };

function Stat({ label, value, signed }: { label: string; value: string; signed?: number }) {
  const cls = signed === undefined ? '' : signed >= 0 ? 'pos' : 'neg';
  return (
    <div style={panel}>
      <div style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</div>
      <div className={cls} style={{ fontSize: 22, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}
