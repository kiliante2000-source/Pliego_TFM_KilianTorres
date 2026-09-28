import 'dotenv/config';
import { bootstrap } from './app.js';

bootstrap().catch((err) => {
  console.error('Failed to start API', err);
  process.exit(1);
});
