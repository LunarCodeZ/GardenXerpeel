import { rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { createApp } from '../server/app.js';

const port = 4173;
const host = '127.0.0.1';
const appUrl = `http://${host}:${port}`;
const dataDir = path.resolve('.local/test-data');
const staticDir = path.resolve('dist');

rmSync(dataDir, { recursive: true, force: true });

if (!existsSync(path.join(staticDir, 'index.html'))) {
  console.log('Build frontend untuk pengujian browser...');
  execSync('npm run build', { stdio: 'inherit' });
}

const ctx = await createApp({
  dataDir,
  appUrl,
  staticDir,
  nodeEnv: 'test',
  admin: {
    email: 'browser@example.com',
    password: 'browser-test-password-123',
    name: 'Pengelola Taman',
  },
});

const server = ctx.app.listen(port, host, () => {
  console.log(`Test server berjalan di ${appUrl}`);
});

function shutdown() {
  server.close(() => {
    ctx.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
