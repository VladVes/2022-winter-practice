import * as argon2 from 'argon2';
import { handleError } from '../../logger';

const User = require('../../models/User/User');

export default (router) => {
  /**
   * Получение списка пользователей.
   */
  router.get('/users', async (ctx) => {
    /* #swagger.tags = ['Users']
       #swagger.description = 'Получение списка всех пользователей'
       #swagger.responses[200] = {
        description: 'Массив пользователей',
        schema: { $ref: '#/definitions/Users' }
    } */
    try {
      ctx.body = await User.find();
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение пользователя по id.
   */
  router.get('/users/:id', async (ctx) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Получение одного пользователя'
       #swagger.responses[200] = {
        description: 'Массив пользователей',
        schema: { $ref: '#/definitions/User' }
    } */
    try {
      ctx.body = await User.findById(ctx.params.id);
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание пользователя.
   */
  router.post('/users/create', async (ctx) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Создание пользователя'

       #swagger.parameters['user'] = {
         in: 'body',
         description: 'Новый пользователь',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewUser' }
       }

       #swagger.responses[200] = {
        description: 'Созданный пользователь',
        schema: { $ref: '#/definitions/User' }
    } */
    const { name, email, password, projectIds = [] } = ctx.request.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const error = new Error(`User with ${email} already exists`);
        throw error;
      }
      await User.create({
        name,
        email,
        password: await argon2.hash(password),
        projectIds,
      });
      ctx.body = { success: true };
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
    /* #swagger.tags = ['User']
       #swagger.description = 'Обновление пользователя'

       #swagger.parameters['task'] = {
         in: 'body',
         description: 'Обновленные поля пользователя',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewUser' }
       }

       #swagger.responses[200] = {
        description: 'Обновленный пользователь',
        schema: { $ref: '#/definitions/User' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await User.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
          email: requestBody.email,
          $push: { projectIds: requestBody.projectIds },
        },
        { new: true },
      );
    } catch (error) {
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
    /* #swagger.tags = ['User']
       #swagger.description = 'Удаление пользователя'
       #swagger.responses[200] = [] */
    try {
      await User.deleteOne({ _id: ctx.params.id });
      ctx.body = [];
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
