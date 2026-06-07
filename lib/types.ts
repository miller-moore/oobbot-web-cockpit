// lib/types.ts — keep in sync with the engine's /status response.
export interface Position {
  instrument: string;
  size: number;        // signed; + long, - short
  notional: number;
  unrealizedPnl: number;
}

export interface EngineStatus {
  equity: number;
  paused: boolean;
  positions: Position[];
  pnl: { dayPnl: number; totalPnl: number };
  lambdas: { drawdown: number; turnover: number; inertia: number };
  // equity curve points for the chart: [unix_ms, equity]
  equityCurve?: [number, number][];
}
