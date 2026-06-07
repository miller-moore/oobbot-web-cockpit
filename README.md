# oobbot-web-cockpit

Private, single-operator cockpit for the oobbot trading engine. Next.js (App Router) +
TypeScript. Shows live equity, PnL, positions, and the Lagrangian constraint
multipliers, and exposes guarded control actions (pause / flatten / set limits).

> Internal tool for one operator (you). Not a public site, not multi-tenant.
> The browser never calls the engine directly — see the security model below.

## Security model (important)

- `ENGINE_BASE_URL` and `COCKPIT_API_TOKEN` are **server-only**. Never `NEXT_PUBLIC_`.
- All engine traffic goes through Route Handlers in `app/api/engine/*`, which attach
  the token server-side and proxy to the engine. The token never ships to the client.
- `lib/engine.ts` imports `server-only` so it can't be bundled into client code.
- A pre-write hook blocks any `NEXT_PUBLIC_*TOKEN/SECRET/KEY/ENGINE_BASE_URL`.
- `flatten` requires an explicit in-UI confirmation (no one-click close-all).
- Until real operator auth is added, **bind to localhost only — never deploy open.**

## Layout

```
app/
  layout.tsx, globals.css     terminal aesthetic (dark, dense, monospace)
  page.tsx                    the dashboard
  api/engine/status/route.ts  GET  -> proxies engine /status (token attached server-side)
  api/engine/control/route.ts POST -> pause | flatten | limits
components/ControlPanel.tsx   guarded control buttons
lib/engine.ts                 server-only engine client
lib/types.ts                  EngineStatus shape — keep in sync with the engine
lib/useStatus.ts              SWR polling hook + sendControl helper
.claude/                      CLAUDE.md, rules/, hooks/, settings.json
```

## Quickstart

```bash
npm install
cp .env.example .env.local      # set ENGINE_BASE_URL + COCKPIT_API_TOKEN (match the engine)
npm run dev                     # http://localhost:3000

# quality gates (same as CI)
npm run typecheck && npm run lint && npm run build
```

Start the engine's control API first (see the oobbot README), then this.

## Git & CI

Trunk-based, small PRs, Conventional Commits. CI runs typecheck, lint, and build.
