import { handleError } from '../../logger';

const Status = require('../../models/Status/Status');

export default (router) => {
  /**
   * Получение списка всех статусов.
   */
  router.get('/statuses', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'getting a list of all statuses'
       #swagger.responses[200] = {
        description: 'array of statuses',
        schema: { $ref: '#/definitions/Statuses' }
    } */
    try {
      ctx.body = await Status.find(ctx.request.query).lean();
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение статуса по id.
   */
  router.get('/statuses/:id', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'getting a status by id'
       #swagger.responses[200] = {
        description: 'status',
        schema: { $ref: '#/definitions/Status' }
    } */
    try {
      ctx.body = await Status.findById(ctx.params.id);
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание нового статуса.
   */
  router.post('/statuses/create', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'create a new status'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'new status',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewStatus' }
       }

       #swagger.responses[200] = {
        description: 'created status',
        schema: { $ref: '#/definitions/Status' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Status.create({
        name: requestBody.name,
      });
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = error;
    }
  });

  /**
   * Обновление статуса по id.
   *
   * @param id - идентификатор статуса
   */
  router.put('/statuses/update/:id', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'update an existing status'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'status fields to update',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewStatus' }
       }

       #swagger.responses[200] = {
        description: 'updated status',
        schema: { $ref: '#/definitions/Statuses' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Status.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
          $push: { boardIds: requestBody.boardId },
        },
        { new: true },
      );
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = error;
    }
  });

  /**
   * Удаление статуса по id.
   *
   * @param id - идентификатор статуса
   */
  router.delete('/statuses/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'status removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
    try {
      await Status.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = error;
    }
  });
};
