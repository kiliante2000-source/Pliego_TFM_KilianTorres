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

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '4mb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'pliego-api', env: env.NODE_ENV });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/projects', projectRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/assets', assetRouter);

  app.use(errorHandler);

  return app;
}

export async function bootstrap() {
  await assetService.ensureDirs();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Pliego API listening on http://127.0.0.1:${env.PORT}`);
  });
}
