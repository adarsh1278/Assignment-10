import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';

const TEST_EMAIL = `ds_test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
let authCookie: string[];

beforeAll(async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
  authCookie = loginRes.headers['set-cookie'];
});

afterAll(async () => {
  await prisma.dayStatus.deleteMany({ where: { updatedBy: { email: TEST_EMAIL } } });
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe('GET /api/day-status/:date — Public', () => {
  it('returns null data for missing date', async () => {
    const res = await request(app).get('/api/day-status/2026-06-15');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects invalid date format', async () => {
    const res = await request(app).get('/api/day-status/not-a-date');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects February 30', async () => {
    const res = await request(app).get('/api/day-status/2026-02-30');
    expect(res.status).toBe(400);
  });

  it('rejects April 31', async () => {
    const res = await request(app).get('/api/day-status/2026-04-31');
    expect(res.status).toBe(400);
  });
});

describe('POST /api/day-status — Protected', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/day-status')
      .send({ date: '2026-07-20', status: 'Office' });
    expect(res.status).toBe(401);
  });

  it('creates day status when authenticated', async () => {
    const res = await request(app)
      .post('/api/day-status')
      .set('Cookie', authCookie)
      .send({ date: '2026-07-20', status: 'Office' });
    expect(res.status).toBe(201);
    expect(res.body.data.status.status).toBe('Office');
    expect(res.body.data.status.date).toBe('2026-07-20');
  });

  it('rejects invalid date in body', async () => {
    const res = await request(app)
      .post('/api/day-status')
      .set('Cookie', authCookie)
      .send({ date: '2026-02-30', status: 'Office' });
    expect(res.status).toBe(400);
  });

  it('rejects empty status', async () => {
    const res = await request(app)
      .post('/api/day-status')
      .set('Cookie', authCookie)
      .send({ date: '2026-07-21', status: '' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/day-status/:date — Protected', () => {
  it('updates existing status', async () => {
    // First create
    await request(app)
      .post('/api/day-status')
      .set('Cookie', authCookie)
      .send({ date: '2026-08-10', status: 'Leave' });

    // Then update
    const res = await request(app)
      .put('/api/day-status/2026-08-10')
      .set('Cookie', authCookie)
      .send({ status: 'Office' });
    expect(res.status).toBe(200);
    expect(res.body.data.status.status).toBe('Office');
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .put('/api/day-status/2026-08-10')
      .send({ status: 'Leave' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/day-status — By Year', () => {
  it('returns statuses for a year', async () => {
    const res = await request(app).get('/api/day-status?year=2026');
    expect(res.status).toBe(200);
    expect(res.body.data.year).toBe(2026);
    expect(Array.isArray(res.body.data.statuses)).toBe(true);
  });

  it('rejects invalid year', async () => {
    const res = await request(app).get('/api/day-status?year=abc');
    expect(res.status).toBe(400);
  });
});
