#!/usr/bin/env node
/**
 * Production start for Render (native Node).
 * Sets public URL, ensures SQLite schema + demo seed, then boots Express (API + SPA).
 */
import { spawnSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backend = path.join(root, 'backend');

if (process.env.RENDER_EXTERNAL_URL) {
  process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || process.env.RENDER_EXTERNAL_URL;
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL;
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Always use absolute paths — Render may inject relative values that break after cwd changes
const dataDir = path.join(backend, 'data');
process.env.DATABASE_URL = `file:${path.join(dataDir, 'pliego.db')}`;
process.env.PUBLIC_DIR = path.join(backend, 'public');
process.env.UPLOAD_DIR = path.join(backend, 'uploads');
process.env.EXPORT_DIR = path.join(backend, 'exports');

for (const dir of [dataDir, process.env.UPLOAD_DIR, process.env.EXPORT_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(path.join(process.env.PUBLIC_DIR, 'index.html'))) {
  console.error('Missing SPA build at', process.env.PUBLIC_DIR);
  process.exit(1);
}

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

run('npx', ['prisma', 'db', 'push', '--skip-generate'], backend);
run('npx', ['tsx', 'prisma/seed.ts'], backend);

const child = spawn('node', ['dist/index.js'], {
  cwd: backend,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
