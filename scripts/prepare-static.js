import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const source = path.join(root, 'index.html');

if (!existsSync(source)) {
  console.error('public/index.html tidak ditemukan. Jalankan vite build dulu.');
  process.exit(1);
}

const slugs = ['krokot', 'lili-paris', 'asoka', 'rumput-jepang', 'pandan'];
const directories = [
  'admin',
  'plants',
  ...slugs.map((slug) => `plants/${slug}`),
];

for (const directory of directories) {
  const targetDir = path.join(root, directory);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, path.join(targetDir, 'index.html'));
}

console.log(`Siap: ${directories.length} halaman SPA statis dibuat di public/.`);
