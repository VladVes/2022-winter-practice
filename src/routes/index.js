import jwtMiddleware from 'koa-jwt';
import board from './board/board';
import project from './project/project';
import status from './status/status';
import task from './task/task';
import user from './user/user';
import config from '../config';

const controllers = [board, project, status, task, user];

export default (router) => {
  router.use(jwtMiddleware({ secret: config.secret }));
  controllers.forEach((f) => f(router));
};
