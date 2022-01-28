import { handleError } from '../../logger';

const Project = require('../../models/Project/Project');

export default (router) => {
  /**
   * Получение списка всех проектов.
   */
  router.get('/projects', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'Получение списка всех проектов'
       #swagger.responses[200] = {
        description: 'Массив проектов',
        schema: { $ref: '#/definitions/Projects' }
    } */
    try {
      ctx.body = await Project.find(ctx.request.query);
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Получение проекта по id.
   */
  router.get('/projects/:id', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'Получение конкретного проекта'
       #swagger.responses[200] = {
        description: 'Проект',
        schema: { $ref: '#/definitions/Projects' }
    } */
    try {
      ctx.body = await Project.findById(ctx.params.id);
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });

  /**
   * Создание нового проекта.
   */
  router.post('/projects/create', async (ctx) => {
    /* #swagger.tags = ['Projects']
       #swagger.description = 'Создание нового проекта'

       #swagger.parameters['projects'] = {
         in: 'body',
         description: 'Новый проект',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewProject' }
       }

       #swagger.responses[200] = {
        description: 'Созданный проект',
        schema: { $ref: '#/definitions/Projects' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Project.create({
        name: requestBody.name,
        description: requestBody.description,
      });
    } catch (error) {
      ctx.body = error;
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
       #swagger.description = 'Обновление существующего проекта'

       #swagger.parameters['projects'] = {
         in: 'body',
         description: 'Обновленные поля проекта',
         type: 'object',
         required: true,
         schema: { $ref: '#/definitions/NewProject' }
       }

       #swagger.responses[200] = {
        description: 'Обновленный проект',
        schema: { $ref: '#/definitions/Project' }
    } */
    const requestBody = ctx.request.body;

    try {
      ctx.body = await Project.findOneAndUpdate(
        { _id: ctx.params.id },
        {
          name: requestBody.name,
          description: requestBody.description,
        },
        { new: true },
      );
    } catch (error) {
      ctx.body = error;
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
       #swagger.description = 'Удаление проекта'
       #swagger.responses[200] = [] */
    try {
      await Project.deleteOne({ _id: ctx.params.id });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = error;
      handleError(error, `request body: ${JSON.stringify(ctx.request.body)}`);
    }
  });
};
