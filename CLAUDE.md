# CLAUDE.md — oobbot-web-cockpit

This is **your private operator cockpit** for the oobbot trading engine — a single-user
internal UI to MONITOR and CONTROL the bot running real money on Hyperliquid.

## What this repo is and is not
- IS: a Next.js (App Router) + TypeScript dashboard. Shows live status, positions,
  PnL, equity curve, the Lagrangian multipliers, and exposes guarded control
  actions (pause, flatten, set position limits).
- IS NOT: a public website, user onboarding, or anything multi-tenant. One operator
  (you). No public signup. Keep it that way until scope explicitly changes.

## How it talks to the engine
- The engine (`oobbot` repo) exposes a FastAPI control API.
- **The browser never calls the engine directly.** All calls go through Next.js
  Route Handlers under `app/api/engine/*`, which attach the `COCKPIT_API_TOKEN`
  server-side and proxy to `ENGINE_BASE_URL`. This keeps the token out of the client
  bundle. See `lib/engine.ts`.
- Read endpoints (`/status`) poll via SWR. Write endpoints (pause/flatten/limits)
  are POSTs behind a confirmation step in the UI.

## Hard rules (see .claude/rules/)
1. **Never expose `COCKPIT_API_TOKEN` or `ENGINE_BASE_URL` to the client.** No
   `NEXT_PUBLIC_` prefix on secrets. Tokens live in server-only env and are used
   only in Route Handlers / server components.
2. **Control actions that can affect money** (flatten especially) require an explicit
   in-UI confirmation. No one-click flatten.
3. This UI must gate access (at minimum a server-side auth check on every route).
   Until real auth is wired, it binds to localhost only — never deploy open.

## How to work here
- Node 20+, Next.js App Router, TypeScript strict.
- Tooling, lean and conflict-free: **ESLint** (next config) + **Prettier** +
  **tsc --noEmit**. Tests via **Vitest**. Do not add a second formatter/linter.
- `npm run dev` to develop, `npm run typecheck && npm run lint` before commit.
- Conventional Commits. Small PRs.

## Data shapes
Engine `/status` returns at least: `{ equity, paused, positions: [...],
pnl: {...}, lambdas: {...} }`. Mirror the engine's response type in `lib/types.ts`
and keep it in sync when the engine changes.
