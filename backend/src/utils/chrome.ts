import fs from 'node:fs';
import { env } from './env.js';

const SYSTEM_CANDIDATES = [
  env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/local/bin/google-chrome',
  '/usr/local/bin/chromium',
];

export type ChromeLaunch = {
  executablePath: string;
  args: string[];
  /** When using @sparticuz/chromium on Render/native Node */
  headless: boolean | 'shell';
};

/**
 * Resolve a Chrome/Chromium binary for PDF export.
 * Prefer a system install (Docker); fall back to @sparticuz/chromium
 * for Render's native Node runtime (no apt chromium).
 */
export async function resolveChromeLaunch(): Promise<ChromeLaunch> {
  for (const candidate of SYSTEM_CANDIDATES) {
    if (candidate && fs.existsSync(candidate)) {
      return {
        executablePath: candidate,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=none',
        ],
        headless: true,
      };
    }
  }

  const chromium = (await import('@sparticuz/chromium')).default;
  // Render/native Node: no GPU; shell headless is more reliable for PDF
  chromium.setGraphicsMode = false;
  const executablePath = await chromium.executablePath();
  if (!executablePath || !fs.existsSync(executablePath)) {
    throw new Error(
      'No se encontró Chromium. Instala chromium en el servidor o usa la imagen Docker de PLIEGO.',
    );
  }

  return {
    executablePath,
    args: [
      ...chromium.args,
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: (chromium.headless as boolean | 'shell') ?? 'shell',
  };
}
