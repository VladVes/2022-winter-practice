import Router from 'koa-router';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import jwtMiddleware from 'koa-jwt';

import UserModel from '../models/User/User';
import config from '../config';
import { handleError } from '../logger';
import RefreshTokenModel from '../models/RefreshToken';

const router = new Router();

async function issueToken(userId) {
  const refreshToken = uuid();

  await RefreshTokenModel.create({
    userId,
    token: refreshToken,
  });
  return {
    token: jwt.sign({ id: userId }, config.secret, { expiresIn: '1800000ms' }),
    refreshToken,
  };
}

router.post('/auth/signup', async (ctx) => {
  /* #swagger.tags = ['Auth']
       #swagger.description = 'sing up a new user'
       #swagger.parameters['credentials'] = {
         in: 'body',
         description: 'new user credentials',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/SignUpCred' }
       }
       #swagger.responses[200] = {
        description: 'sign up success',
        schema: { $ref: '#/definitions/Success' }
    } */
  const {
    name,
    email,
    password,
    projectIds = [],
    boardIds = [],
    avatarLink = '',
  } = ctx.request.body;
  try {
    if (password.length < 8 || password.length > 128) {
      const error = new Error(
        `Password must be at least 8 and not exceed 128 characters`,
      );
      ctx.status = 401;
      throw error;
    }
    if (email.length > 128 || name.length > 128) {
      const error = new Error(
        `Email and name length must not exceed 128 characters`,
      );
      ctx.status = 401;
      throw error;
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      const error = new Error(`User with ${email} already exists`);
      ctx.status = 409;
      throw error;
    }
    await UserModel.create({
      name: !name || name === '' ? 'user' : name,
      email,
      password: await argon2.hash(password),
      projectIds,
      boardIds,
      avatarLink,
    });
    ctx.body = { success: true };
  } catch (error) {
    handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    ctx.body = { error: error.message };
  }
});

router.post('/auth/login', async (ctx) => {
  /* #swagger.tags = ['Auth']
       #swagger.description = 'login user'
       #swagger.parameters['credentials'] = {
         in: 'body',
         description: 'user credentials',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/UserLoginCred' }
       }
       #swagger.responses[200] = {
        description: 'access and refresh tokens',
        schema: { $ref: '#/definitions/UserLogin' }
    } */
  const { email, password } = ctx.request.body;
  const userRecord = await UserModel.findOne({ email });
  if (!userRecord || !(await argon2.verify(userRecord.password, password))) {
    const error = new Error();
    error.status = 403;
    handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    throw error;
  }
  const tokens = await issueToken(userRecord._id);

  ctx.body = {
    userId: userRecord._id,
    ...tokens,
  };
});

router.post('/auth/refresh', async (ctx) => {
  /* #swagger.tags = ['Auth']
       #swagger.description = 'refresh access token'
       #swagger.parameters['token'] = {
         in: 'body',
         description: 'user refresh token',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/RefreshToken' }
       }
       #swagger.responses[200] = {
        description: 'access and refresh tokens',
        schema: { $ref: '#/definitions/Tokens' }
    } */
  const { refreshToken } = ctx.request.body;
  const refreshTokenRecord = await RefreshTokenModel.findOneAndDelete({
    token: refreshToken,
  });
  if (!refreshTokenRecord) {
    const error = new Error();
    error.status = 404;
    handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    return;
  }

  ctx.body = await issueToken(refreshTokenRecord.userId);
});

router.post(
  '/auth/logout',
  jwtMiddleware({ secret: config.secret }),
  async (ctx) => {
    /* #swagger.tags = ['Auth']
       #swagger.description = 'user logout'
       #swagger.responses[200] = {
        description: 'logout success',
        schema: { $ref: '#/definitions/Success' }
    } */
    const { id: userId } = ctx.state.user;
    if (!userId) {
      const error = new Error();
      error.status = 404;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      return;
    }

    await RefreshTokenModel.deleteMany({ userId });
    ctx.body = { success: true };
  },
);

export default router;
