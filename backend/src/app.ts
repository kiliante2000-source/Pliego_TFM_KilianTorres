import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';
import { publicRouter, assetRouter } from './routes/publicRoutes.js';
import { assetService } from './services/assetService.js';
import { pingDatabase, prepareDatabase } from './utils/prisma.js';

function resolvePublicDir() {
  const candidates = [
    process.env.PUBLIC_DIR,
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '../frontend/dist'),
  ].filter(Boolean) as string[];
  return candidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')));
}

export function createApp() {
  const app = express();
  const publicDir = resolvePublicDir();

  app.set('trust proxy', 1);
  app.use(
    helmet({
      // SPA + Google Fonts + inline styles from Vite build
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  const corsOrigins = new Set(
    [
      ...env.CORS_ORIGIN.split(',').map((s) => s.trim()),
      'http://127.0.0.1:45321',
      'http://localhost:45321',
      'http://127.0.0.1:4174',
      'http://localhost:4174',
      'https://kiliante2000-source.github.io',
    ].filter(Boolean),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || corsOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '4mb' }));
  app.use(cookieParser());

  app.get('/api/health', async (_req, res) => {
    try {
      await pingDatabase();
      res.json({ ok: true, service: 'pliego-api', env: env.NODE_ENV, db: 'up' });
    } catch {
      res.status(503).json({ ok: false, service: 'pliego-api', env: env.NODE_ENV, db: 'down' });
    }
  });

  app.use('/api/auth', authRouter);
  app.use('/api/projects', projectRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/assets', assetRouter);

  if (publicDir) {
    app.use(express.static(publicDir, { index: false, maxAge: '1h' }));
    // Express 5 requires a named wildcard (path-to-regexp)
    app.get('/{*path}', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(publicDir, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  }

  app.use(errorHandler);

  return app;
}

export async function bootstrap() {
  await prepareDatabase();
  await assetService.ensureDirs();
  const app = createApp();
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Pliego listening on http://0.0.0.0:${env.PORT}`);
  });
}
