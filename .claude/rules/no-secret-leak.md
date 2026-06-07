# Rule: never leak the engine token or base URL to the client

- `ENGINE_BASE_URL` and `COCKPIT_API_TOKEN` are SERVER-ONLY. No `NEXT_PUBLIC_` prefix.
- All engine calls go through Route Handlers in `app/api/engine/*` or server
  components, never from client code. `lib/engine.ts` imports `server-only`.
- A pre-write hook blocks `NEXT_PUBLIC_*TOKEN/SECRET/KEY/ENGINE_BASE_URL`.
