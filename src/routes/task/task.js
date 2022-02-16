import { handleError } from '../../logger';

const Task = require('../../models/Task/Task');

export default (router) => {
  /**
   * Получение списка всех задач.
   */
  router.get('/tasks', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'getting a list of all tasks'
       #swagger.responses[200] = {
        description: 'array of tasks',
        schema: { $ref: '#/definitions/Tasks' }
    } */
    try {
      const tasks = await Task.find(ctx.request.query).lean();
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
       #swagger.description = 'getting a task by id'
       #swagger.responses[200] = {
        description: 'task',
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
       #swagger.description = 'create a new task'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'new task',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewTask' }
       }

       #swagger.responses[200] = {
        description: 'created task',
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
        elapsedTime: 0,
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
       #swagger.description = 'update an existing task'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'task fields to update',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewTask' }
       }

       #swagger.responses[200] = {
        description: 'updated task',
        schema: { $ref: '#/definitions/Task' }
    } */

    const requestBody = ctx.request.body;

    try {
      if (requestBody.description && requestBody.description.length > 1024) {
        const error = new Error(
          `Description length must not exceed 1024 characters`,
        );
        ctx.status = 401;
        throw error;
      }
      if (requestBody.name && requestBody.name.length > 128) {
        const error = new Error(`Name length must not exceed 128 characters`);
        ctx.status = 401;
        throw error;
      }
      ctx.body = await Task.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
          description: requestBody.description,
          assignedTo: requestBody.assignedTo,
          boardId: requestBody.boardId,
          statusId: requestBody.statusId,
          elapsedTime: requestBody.elapsedTime,
        },
        { new: true },
      );
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  router.delete('/tasks/delete', async (ctx) => {
    /* #swagger.tags = ['Tasks']
       #swagger.description = 'all task removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
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
       #swagger.description = 'task removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
    try {
      await Task.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
