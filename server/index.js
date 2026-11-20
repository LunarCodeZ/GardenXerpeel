import path from 'node:path';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';
// Di production (Render/Railway), host harus 0.0.0.0 agar bisa diakses dari luar.
// Secara default lokal tetap 127.0.0.1.
const host = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1');
const appUrl = process.env.APP_URL || (isProduction ? `http://${host}:${port}` : 'http://localhost:5173');

const admin = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
  ? {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME || 'Admin Digital Garden',
    }
  : undefined;

const ctx = await createApp({
  dataDir: process.env.DATA_DIR || './data',
  appUrl,
  nodeEnv: process.env.NODE_ENV,
  trustProxy: process.env.TRUST_PROXY === '1',
  staticDir: isProduction || process.env.SERVE_STATIC === '1' ? path.resolve('public') : undefined,
  admin,
});

const server = ctx.app.listen(port, host, () => {
  console.log(`Digital Garden API berjalan di http://${host}:${port}`);
  console.log(`URL publik: ${appUrl}`);
});

function shutdown(signal) {
  console.log(`\nMenerima ${signal}. Menutup server...`);
  server.close(() => {
    ctx.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
