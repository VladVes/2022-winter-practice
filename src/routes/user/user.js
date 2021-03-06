import * as argon2 from 'argon2';
import { handleError } from '../../logger';

const User = require('../../models/User/User');

export default (router) => {
  /**
   * Получение списка пользователей.
   */
  router.get('/users', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'getting a list of all users'
       #swagger.responses[200] = {
        description: 'array of users',
        schema: { $ref: '#/definitions/Users' }
    } */
    try {
      ctx.body = await User.find();
    } catch (error) {
      ctx.body = { error: error.message };
      ctx.status = 400;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение пользователя по id.
   */
  router.get('/users/:id', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'getting a user by id'
       #swagger.responses[200] = {
        description: 'user data',
        schema: { $ref: '#/definitions/User' }
    } */
    try {
      ctx.body = await User.findById(ctx.params.id);
    } catch (error) {
      ctx.body = { error: error.message };
      ctx.status = 400;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание пользователя.
   */
  router.post('/users/create', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'create a new user'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'new user',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewUser' }
       }

       #swagger.responses[200] = {
        description: 'created user',
        schema: { $ref: '#/definitions/User' }
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
          `Password must be at least 8 and not exceed 128 character`,
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
      const user = await User.findOne({ email });
      if (user) {
        const error = new Error(`User with ${email} already exists`);
        ctx.status = 409;
        throw error;
      }
      const newUser = await User.create({
        name,
        email,
        password: await argon2.hash(password),
        projectIds,
        boardIds,
        avatarLink,
      });
      ctx.body = newUser;
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Обновление пользователя по id.
   *
   * @param id - идентификатор пользователя
   */
  router.put('/users/update/:id', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'update an existing user'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'user fields to update',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewUser' }
       }

       #swagger.responses[200] = {
        description: 'updated user',
        schema: { $ref: '#/definitions/User' }
    } */
    const {
      name,
      email,
      projectIds,
      boardIds,
      avatarLink = '',
    } = ctx.request.body;

    try {
      if ((email && email.length > 128) || (name && name.length > 128)) {
        const error = new Error(
          `Email and name length must not exceed 128 characters`,
        );
        ctx.status = 401;
        throw error;
      }
      const user = await User.findOne({ email });
      if (user) {
        const error = new Error(`User with ${email} already exists`);
        ctx.status = 409;
        throw error;
      }
      ctx.body = await User.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name,
          email,
          avatarLink,
          // $push: { projectIds, boardIds },
          projectIds,
          boardIds,
        },
        { new: true },
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Удаление пользователя по id.
   *
   * @param id - идентификатор пользователя
   */
  router.delete('/users/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'user removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
    try {
      await User.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  });
};
