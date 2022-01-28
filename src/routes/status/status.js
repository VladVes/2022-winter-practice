import { handleError } from '../../logger';

const Status = require('../../models/Status/Status');

export default (router) => {
  /**
   * Получение списка всех статусов.
   */
  router.get('/statuses', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'Получение списка всех статусов'
       #swagger.responses[200] = {
        description: 'Массив статусов',
        schema: { $ref: '#/definitions/Status' }
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
       #swagger.description = 'Получение одной статуса'
       #swagger.responses[200] = {
        description: 'Статус',
        schema: { $ref: '#/definitions/Statuses' }
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
       #swagger.description = 'Создание статуса'

       #swagger.parameters['statuses'] = {
         in: 'body',
         description: 'Новый статус',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewStatus' }
       }

       #swagger.responses[200] = {
        description: 'Созданный статус',
        schema: { $ref: '#/definitions/Statuses' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Status.create({
        name: requestBody.name,
      });
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Обновление статуса по id.
   *
   * @param id - идентификатор статуса
   */
  router.put('/statuses/update/:id', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'Обновление существующего статуса'

       #swagger.parameters['statuses'] = {
         in: 'body',
         description: 'Обновленные поля статуса',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewStatus' }
       }

       #swagger.responses[200] = {
        description: 'Обновленный статус',
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
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Удаление статуса по id.
   *
   * @param id - идентификатор статуса
   */
  router.delete('/statuses/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Statuses']
       #swagger.description = 'Удаление статуса'
       #swagger.responses[200] = [] */
    try {
      await Status.deleteOne({ _id: ctx.params.id });
      ctx.body = [];
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
