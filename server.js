import path from 'node:path';
import { createApp } from './server/app.js';

const isVercel = Boolean(process.env.VERCEL);
const admin = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
  ? {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME || 'Admin Digital Garden',
    }
  : undefined;

const ctx = await createApp({
  dataDir: process.env.DATA_DIR || (isVercel ? '/tmp/data' : './data'),
  appUrl: process.env.APP_URL || 'https://egardenxerpeel.vercel.app',
  nodeEnv: process.env.NODE_ENV || (isVercel ? 'production' : undefined),
  trustProxy: process.env.TRUST_PROXY === '1' || isVercel,
  staticDir: path.resolve('public'),
  admin,
});

export default ctx.app;
