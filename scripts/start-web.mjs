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
  process.env.CORS_ORIGIN ||= process.env.RENDER_EXTERNAL_URL;
  process.env.FRONTEND_URL ||= process.env.RENDER_EXTERNAL_URL;
}

process.env.NODE_ENV ||= 'production';
process.env.DATABASE_URL ||= 'file:./data/pliego.db';
process.env.PUBLIC_DIR ||= path.join(backend, 'public');
process.env.UPLOAD_DIR ||= path.join(backend, 'uploads');
process.env.EXPORT_DIR ||= path.join(backend, 'exports');

for (const dir of [
  path.join(backend, 'data'),
  process.env.UPLOAD_DIR,
  process.env.EXPORT_DIR,
]) {
  fs.mkdirSync(dir, { recursive: true });
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
