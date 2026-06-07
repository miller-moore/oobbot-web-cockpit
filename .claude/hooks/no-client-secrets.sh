#!/usr/bin/env bash
# Blocks the classic Next.js mistake: exposing a secret to the client bundle
# via a NEXT_PUBLIC_ prefix, or importing the server-only engine client into a
# 'use client' component.
set -euo pipefail
payload="$(cat || true)"
if printf '%s' "$payload" | grep -Eq 'NEXT_PUBLIC_[A-Z_]*(TOKEN|SECRET|KEY|ENGINE_BASE_URL)'; then
  echo "BLOCKED: secret-looking value behind NEXT_PUBLIC_ (would ship to the browser)." >&2
  exit 2
fi
exit 0
