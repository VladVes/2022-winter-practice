import { handleError } from '../../logger';

const Board = require('../../models/Board/Board');

export default (router) => {
  /**
   * Получение списка всех досок.
   */
  router.get('/boards', async (ctx) => {
    /* #swagger.tags = ['Boards']
       #swagger.description = 'getting a list of all boards'
       #swagger.responses[200] = {
        description: 'array of boards',
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
       #swagger.description = 'getting a board by id'
       #swagger.responses[200] = {
        description: 'board',
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
       #swagger.description = 'create a new board'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'new board data',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewBoard' }
       }

       #swagger.responses[200] = {
        description: 'created board',
        schema: { $ref: '#/definitions/Boards' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Board.create({
        name: requestBody.name,
        color: requestBody.color,
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
       #swagger.description = 'update an existing board'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'board fields to update',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewBoard' }
       }

       #swagger.responses[200] = {
        description: 'updated board',
        schema: { $ref: '#/definitions/Boards' }
    } */
    const { name, color, projectId } = ctx.request.body;

    try {
      ctx.body = await Board.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name,
          color,
          projectId,
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
    /* #swagger.tags = ['Boards']
       #swagger.description = 'board removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
    try {
      await Board.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = { error: error.message };
    }
  });
};
