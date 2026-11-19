import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import sharp from 'sharp';
import { createApp } from '../server/app.js';

let ctx, dir, agent, csrf, plant, imagePath;
const origin = 'http://localhost:5173';
const content = { name: 'Tanaman uji', slug: 'tanaman-uji', short_description: 'Ringkasan yang sudah diperiksa.', description: 'Deskripsi tanaman untuk pengujian aplikasi.', care_guide: 'Periksa kelembapan media.', characteristics: 'Daun hijau.', benefits: 'Penghias taman.', verified: true, status: 'published' };
before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'garden-test-'));
  ctx = await createApp({ dataDir: dir, appUrl: origin, admin: { email: 'test@example.com', password: 'test-password-long-123', name: 'Pengelola' } });
  agent = request.agent(ctx.app);
});
after(async () => { ctx?.close(); await rm(dir, { recursive: true, force: true }); });
const write = (method, url) => agent[method](url).set('Origin', origin).set('X-CSRF-Token', csrf || '');

test('public seed contains no drafts and admin endpoints require authentication', async () => {
  const res = await request(ctx.app).get('/api/plants').expect(200);
  assert.equal(res.body.data.length, 0);
  await request(ctx.app).get('/api/plants/krokot').expect(404);
  await request(ctx.app).get('/api/admin/plants').expect(401);
  await request(ctx.app).post('/api/admin/plants').send(content).expect(401);
});
test('login rejects invalid credentials and establishes an HttpOnly session', async () => {
  await agent.post('/api/login').set('Origin', origin).send({email:'test@example.com', password:'wrong'}).expect(401);
  const res = await agent.post('/api/login').set('Origin', origin).send({email:'test@example.com', password:'test-password-long-123'}).expect(200);
  csrf = res.body.data.csrf;
  assert.ok(csrf);
  assert.match(res.headers['set-cookie'][0], /HttpOnly/);
  assert.match(res.headers['set-cookie'][0], /SameSite=Strict/);
  const list = await agent.get('/api/admin/plants').expect(200);
  assert.equal(list.body.meta.total, 5);
  assert.ok(list.body.data.every(p => p.status === 'draft'));
});
test('writes reject CSRF, cross-origin requests, invalid data and duplicates', async () => {
  await agent.post('/api/admin/plants').set('Origin', origin).send(content).expect(403);
  await write('post', '/api/admin/plants').set('Origin', 'https://evil.example').send(content).expect(403);
  await write('post', '/api/admin/plants').send({name:''}).expect(422);
  await write('post', '/api/admin/plants').send({...content, slug:'krokot'}).expect(409);
  await write('post', '/api/admin/plants').send({...content, slug:'bad slug'}).expect(422);
  await write('post', '/api/admin/plants').send({...content, verified:false}).expect(422);
});
test('create, read and update published content while enforcing immutable slugs', async () => {
  const res = await write('post', '/api/admin/plants').send(content).expect(201);
  plant = res.body.data;
  assert.equal(plant.qr_url, origin + '/plants/tanaman-uji');
  const pub = await request(ctx.app).get('/api/plants/tanaman-uji').expect(200);
  assert.equal(pub.body.data.name, content.name);
  await write('put', '/api/admin/plants/' + plant.id).send({...content, name:'Nama baru'}).expect(200);
  await write('put', '/api/admin/plants/' + plant.id).send({...content, slug:'ganti-slug'}).expect(422);
  const search = await agent.get('/api/admin/plants?q=Nama%20baru').expect(200);
  assert.equal(search.body.meta.total, 1);
});
test('image validation rejects disguised files and stores optimized images', async () => {
  await write('post', `/api/admin/plants/${plant.id}/image`).attach('image', Buffer.from('<svg>bad</svg>'), {filename:'bad.png', contentType:'image/png'}).expect(422);
  await write('post', `/api/admin/plants/${plant.id}/image`).attach('image', Buffer.alloc(5 * 1024 * 1024 + 1), {filename:'large.jpg', contentType:'image/jpeg'}).expect(413);
  const png = await sharp({create:{width:40,height:40,channels:3,background:'#245640'}}).png().toBuffer();
  const res = await write('post', `/api/admin/plants/${plant.id}/image`).attach('image', png, {filename:'plant.png',contentType:'image/png'}).expect(200);
  imagePath = res.body.data.image_path;
  assert.match(imagePath, /\.webp$/);
  await request(ctx.app).get(imagePath).expect(200).expect('Content-Type', /webp/);
});
test('QR serves real SVG and PNG downloads with stable destination', async () => {
  const res = await agent.get(`/api/admin/plants/${plant.id}/qr?format=svg`).expect(200);
  assert.match(res.text, /<svg/);
  assert.match(res.headers['content-disposition'], /tanaman-uji\.svg/);
  const png = await agent.get(`/api/admin/plants/${plant.id}/qr?format=png`).expect(200);
  assert.equal(png.body.subarray(1,4).toString(), 'PNG');
  await request(ctx.app).get(`/api/admin/plants/${plant.id}/qr`).expect(401);
});
test('unpublishing hides detail, list and original image from public', async () => {
  await write('put', `/api/admin/plants/${plant.id}`).send({...content, status:'draft'}).expect(200);
  await request(ctx.app).get('/api/plants/tanaman-uji').expect(404);
  await request(ctx.app).get(imagePath).expect(404);
  await agent.get(imagePath).expect(200);
  assert.equal((await request(ctx.app).get('/api/plants')).body.data.length, 0);
});
test('database persists across app restart and passwords are hashed', async () => {
  const row = ctx.db.prepare('SELECT password_hash FROM admins').get();
  assert.notEqual(row.password_hash, 'test-password-long-123');
  assert.match(row.password_hash, /^scrypt:/);
  ctx.close();
  ctx = await createApp({dataDir:dir, appUrl:origin});
  agent = request.agent(ctx.app);
  const login = await agent.post('/api/login').set('Origin',origin).send({email:'test@example.com',password:'test-password-long-123'}).expect(200);
  csrf = login.body.data.csrf;
  const res = await agent.get('/api/admin/plants/' + plant.id).expect(200);
  assert.equal(res.body.data.slug, 'tanaman-uji');
});
test('dashboard counts, pagination, deletion and logout work', async () => {
  const counts = await agent.get('/api/admin/dashboard').expect(200);
  assert.equal(counts.body.data.total, 6);
  assert.equal(counts.body.data.draft, 6);
  const paged = await agent.get('/api/admin/plants?limit=2&page=2').expect(200);
  assert.equal(paged.body.data.length, 2);
  await write('delete', '/api/admin/plants/' + plant.id).expect(200);
  await agent.get('/api/admin/plants/' + plant.id).expect(404);
  await write('post', '/api/logout').expect(200);
  await agent.get('/api/me').expect(401);
});
