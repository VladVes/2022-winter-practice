import { handleError } from '../../logger';

const Project = require('../../models/Project/Project');

export default (router) => {
  /**
   * Получение списка всех проектов.
   */
  router.get('/projects', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'getting a list of all projects'
       #swagger.responses[200] = {
        description: 'array of projects',
        schema: { $ref: '#/definitions/Projects' }
    } */
    try {
      ctx.body = await Project.find(ctx.request.query);
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение проекта по id.
   */
  router.get('/projects/:id', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'getting a project by id'
       #swagger.responses[200] = {
        description: 'project',
        schema: { $ref: '#/definitions/Project' }
    } */
    try {
      ctx.body = await Project.findById(ctx.params.id);
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание нового проекта.
   */
  router.post('/projects/create', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'create a new project'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'new project',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewProject' }
       }

       #swagger.responses[200] = {
        description: 'created project',
        schema: { $ref: '#/definitions/Project' }
    } */
    const { name, description } = ctx.request.body;

    try {
      if (description.length > 1024) {
        const error = new Error(
          `Description length must not exceed 1024 characters`,
        );
        ctx.status = 401;
        throw error;
      }
      ctx.body = await Project.create({
        name,
        description,
      });
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Обновление проекта по id.
   *
   * @param id - идентификатор проекта
   */
  router.put('/projects/update/:id', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'update an existing project'

       #swagger.parameters['data'] = {
         in: 'body',
         description: 'project fields to update',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewProject' }
       }

       #swagger.responses[200] = {
        description: 'updated project',
        schema: { $ref: '#/definitions/Project' }
    } */
    const { name, description } = ctx.request.body;

    try {
      if (description && description.length > 1024) {
        const error = new Error(
          `Description length must not exceed 1024 characters`,
        );
        ctx.status = 401;
        throw error;
      }
      ctx.body = await Project.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name,
          description,
        },
        { new: true },
      );
    } catch (error) {
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Удаление проекта по id.
   *
   * @param id - идентификатор проекта
   */
  router.delete('/projects/delete/:id', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'project removal'
       #swagger.responses[200] = {
        description: 'removal success',
        schema: { $ref: '#/definitions/Success' }
    } */
    try {
      await Project.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
