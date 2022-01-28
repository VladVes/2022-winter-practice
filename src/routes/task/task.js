import { handleError } from '../../logger';

const Task = require('../../models/Task/Task');

export default (router) => {
  /**
   * Получение списка всех задач.
   */
  router.get('/tasks', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'Получение списка всех задач'
       #swagger.responses[200] = {
        description: 'Массив задач',
        schema: { $ref: '#/definitions/Tasks' }
    } */
    try {
      const tasks = await Task.find(ctx.request.query).lean();
      // ctx.body = await Task.find(ctx.request.query);
      ctx.body = tasks;
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение задачи по id.
   */
  router.get('/tasks/:id', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'Получение одной задачи'
       #swagger.responses[200] = {
        description: 'Задача',
        schema: { $ref: '#/definitions/Task' }
    } */
    try {
      ctx.body = await Task.findById(ctx.params.id).lean();
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание новой задачи.
   */
  router.post('/tasks/create', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'Создание задачи'

       #swagger.parameters['tasks'] = {
         in: 'body',
         description: 'Новая задача',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewTask' }
       }

       #swagger.responses[200] = {
        description: 'Созданная задача',
        schema: { $ref: '#/definitions/Task' }
    } */

    const requestBody = ctx.request.body;

    try {
      const newTask = await Task.create({
        name: requestBody.name,
        description: requestBody.description,
        creator: ctx.state.user.id,
        assignedTo: requestBody.assignedTo,
        boardId: requestBody.boardId,
        statusId: requestBody.statusId,
      });
      ctx.body = newTask;
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Обновление задачи по id.
   *
   * @param id - идентификатор задачи
   */
  router.put('/tasks/update/:id', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'Обновление задачи'

       #swagger.parameters['tasks'] = {
         in: 'body',
         description: 'Обновленные поля задачи',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewTask' }
       }

       #swagger.responses[200] = {
        description: 'Обновленная задача',
        schema: { $ref: '#/definitions/Task' }
    } */

    const requestBody = ctx.request.body;

    try {
      ctx.body = await Task.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
          description: requestBody.description,
          assignedTo: requestBody.assignedTo,
          boardId: requestBody.boardId,
          statusId: requestBody.statusId,
        },
        { new: true },
      );
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  router.delete('/tasks/delete', async (ctx) => {
    try {
      await Task.deleteMany();
      ctx.body = { success: true };
    } catch (error) {
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
      ctx.body = error;
    }
  });
  /**
   * Удаление задачи по id.
   *
   * @param id - идентификатор задачи
   */
  router.delete('/tasks/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'Удаление задачи'
       #swagger.responses[200] = [] */
    try {
      await Task.deleteOne({ _id: ctx.params.id });
      ctx.body = [];
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
