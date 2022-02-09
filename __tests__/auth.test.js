import agent from 'supertest-koa-agent';
import * as argon2 from 'argon2';
import 'regenerator-runtime/runtime';
import jwt from 'jsonwebtoken';

import { createApp } from '../src/app';
import { dbConnect, dbClear, dbClose } from '../src/db';
import UserModel from '../src/models/User/User';
import config from '../src/config';

const app = agent(createApp(dbConnect));

describe('User authorization', () => {
  beforeEach(async () => {
    const USER_DATA = {
      name: 'John',
      email: 'john@example.com',
      password: await argon2.hash('john'),
      projectIds: [],
    };
    await UserModel.create(USER_DATA);
  });
  afterEach(async () => {
    await dbClear();
  });
  afterAll(async (done) => {
    await dbClose();
    done();
  });
  test('User can successfully sign up', async () => {
    const USER_DATA = {
      email: 'user@example.com',
      name: 'user',
      password: 'user',
    };
    const res = await app.post('/auth/signup').send(USER_DATA);

    expect(res.status).toBe(200);
  });
  test('User can successfully login', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const res = await app.post('/auth/login').send(USER_DATA);

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });
  test('User can successfully login', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const res = await app.post('/auth/login').send(USER_DATA);

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  test('User get 403 on invalid login', async () => {
    const USER_DATA = {
      email: 'INVALID_LOGIN',
      password: 'john',
    };
    const res = await app.post('/auth/login').send(USER_DATA);

    expect(res.status).toBe(403);
  });

  test('User get 401 on expired token', async () => {
    const expiredToken = jwt.sign({ id: 1 }, config.secret, {
      expiresIn: '1ms',
    });
    const res = await app
      .get('/users')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });
  test('User can get new access token using refresh token', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const loginRes = await app.post('/auth/login').send(USER_DATA);
    const { refreshToken } = loginRes.body;
    expect(loginRes.status).toBe(200);
    expect(typeof refreshToken).toBe('string');

    const refreshRes = await app.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(typeof refreshRes.body.token).toBe('string');
    expect(typeof refreshRes.body.refreshToken).toBe('string');
  });
  test('User get 404 on invalid refresh token', async () => {
    const refreshRes = await app
      .post('/auth/refresh')
      .send({ refreshToken: 'INVALID_TOKEN' });
    expect(refreshRes.status).toBe(404);
  });
  test('User use refresh token only once', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const loginRes = await app.post('/auth/login').send(USER_DATA);
    const { refreshToken } = loginRes.body;
    expect(loginRes.status).toBe(200);
    expect(typeof refreshToken).toBe('string');

    const refreshRes1 = await app.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes1.status).toBe(200);
    expect(typeof refreshRes1.body.refreshToken).toBe('string');

    const refreshRes2 = await app.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes2.status).toBe(404);
  });
  test('Refresh tokens become invalid on logout', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const loginRes = await app.post('/auth/login').send(USER_DATA);
    const { token, refreshToken } = loginRes.body;
    expect(loginRes.status).toBe(200);
    expect(typeof refreshToken).toBe('string');
    expect(typeof token).toBe('string');

    const logoutRes = await app
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);

    const refreshRes = await app.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(404);
  });
  test('Multiple refresh tokens are valid', async () => {
    const USER_DATA = {
      email: 'john@example.com',
      password: 'john',
    };
    const loginRes1 = await app.post('/auth/login').send(USER_DATA);
    const { refreshToken: rToken1 } = loginRes1.body;
    expect(loginRes1.status).toBe(200);

    const loginRes2 = await app.post('/auth/login').send(USER_DATA);
    const { refreshToken: rToken2 } = loginRes2.body;
    expect(loginRes2.status).toBe(200);

    const refreshRes1 = await app
      .post('/auth/refresh')
      .send({ refreshToken: rToken1 });
    expect(refreshRes1.status).toBe(200);
    const refreshRes2 = await app
      .post('/auth/refresh')
      .send({ refreshToken: rToken2 });
    expect(refreshRes2.status).toBe(200);
  });
});
