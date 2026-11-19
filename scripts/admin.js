import { createApp } from '../server/app.js';

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  const inline = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return inline ? inline.slice(name.length + 3) : undefined;
}

const email = (readArg('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = readArg('password') || process.env.ADMIN_PASSWORD || '';
const name = (readArg('name') || process.env.ADMIN_NAME || 'Admin Digital Garden').trim();

if (!email || !password) {
  console.error('Penggunaan: npm run admin:create -- --email admin@contoh.id --password "kata-sandi-kuat" [--name "Nama Admin"]');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Kata sandi minimal 8 karakter.');
  process.exit(1);
}

const ctx = await createApp({
  dataDir: process.env.DATA_DIR || './data',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  admin: { email, password, name },
});

ctx.close();
console.log(`Akun admin ${email} siap digunakan.`);
