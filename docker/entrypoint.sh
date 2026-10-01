#!/usr/bin/env bash
set -euo pipefail

mkdir -p /app/data /app/uploads /app/exports

# Render (and similar) inject the public HTTPS URL
if [[ -n "${RENDER_EXTERNAL_URL:-}" ]]; then
  export CORS_ORIGIN="${CORS_ORIGIN:-$RENDER_EXTERNAL_URL}"
  export FRONTEND_URL="${FRONTEND_URL:-$RENDER_EXTERNAL_URL}"
fi

# Free tiers often use ephemeral disks — schema + demo account on every boot
npx prisma db push --skip-generate
npx tsx prisma/seed.ts

exec node dist/index.js
