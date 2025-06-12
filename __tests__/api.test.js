const request = require('supertest');
const app = require('../api/app');
const { db } = require('../db');

describe('BusLog API', () => {
  afterAll((done) => {
    db.close();
    done();
  });

  let token;

  test('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password' });
    expect(res.statusCode).toBe(201);
  });

  test('logs in the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('updates ride count', async () => {
    const res = await request(app)
      .post('/api/buslog/ride')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('retrieves stats', async () => {
    const res = await request(app)
      .get('/api/buslog/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rideCount).toBe(1);
    expect(res.body.totalAmount).toBe(230);
  });

  test('resets data', async () => {
    const res = await request(app)
      .post('/api/buslog/reset')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const stats = await request(app)
      .get('/api/buslog/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(stats.body.rideCount).toBe(0);
  });
});
