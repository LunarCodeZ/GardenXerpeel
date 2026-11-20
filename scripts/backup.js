import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.env.DATA_DIR || './data');
const backupDir = path.resolve(process.env.BACKUP_DIR || './backups');
const source = path.join(dataDir, 'garden.db');

mkdirSync(backupDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
const target = path.join(backupDir, `garden-${stamp}.db`);

const db = new DatabaseSync(source);
try {
  db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}';`);
} finally {
  db.close();
}

console.log(`Backup database dibuat: ${target}`);
