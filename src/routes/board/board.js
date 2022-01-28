import { handleError } from '../../logger';

const Board = require('../../models/Board/Board');

export default (router) => {
  /**
   * Получение списка всех досок.
   */
  router.get('/boards', async (ctx) => {
    /* #swagger.tags = ['Boards']
       #swagger.description = 'Получение списка всех досок'
       #swagger.responses[200] = {
        description: 'Массив досок',
        schema: { $ref: '#/definitions/Boards' }
    } */
    try {
      ctx.body = await Board.find(ctx.request.query);
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение доски проекта по id.
   */
  router.get('/boards/:id', async (ctx) => {
    /* #swagger.tags = ['Boards']
       #swagger.description = 'Получение одной доски'
       #swagger.responses[200] = {
        description: 'Доска',
        schema: { $ref: '#/definitions/Board' }
    } */
    try {
      ctx.body = await Board.findById(ctx.params.id);
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание новой доски.
   */
  router.post('/boards/create', async (ctx) => {
    /* #swagger.tags = ['Boards']
       #swagger.description = 'Создание доски'

       #swagger.parameters['boards'] = {
         in: 'body',
         description: 'Новая доска',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewBoard' }
       }

       #swagger.responses[200] = {
        description: 'Созданная доска',
        schema: { $ref: '#/definitions/Boards' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Board.create({
        name: requestBody.name,
        projectId: requestBody.projectId,
      });
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Обновление доски по id.
   *
   * @param id - идентификатор доски
   */
  router.put('/boards/update/:id', async (ctx) => {
    /* #swagger.tags = ['Boards']
       #swagger.description = 'Обновление существующей доски'

       #swagger.parameters['tasks'] = {
         in: 'body',
         description: 'Обновленные поля доски',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewBoard' }
       }

       #swagger.responses[200] = {
        description: 'Обновлённая доска',
        schema: { $ref: '#/definitions/Boards' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Board.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
        },
        { new: true },
      );
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = { error: error.message };
    }
  });

  /**
   * Удаление доски по id.
   *
   * @param id - идентификатор задачи
   */
  router.delete('/boards/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Board']
       #swagger.description = 'Удаление доски'
       #swagger.responses[200] = [] */
    console.log('DELETE', ctx.params);
    try {
      await Board.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = { error: error.message };
    }
  });
};
