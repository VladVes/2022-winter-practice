import Koa from 'koa';
import fs from 'fs';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import Router from 'koa-router';
import { koaSwagger } from 'koa2-swagger-ui';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import withProtectedRoutes from './routes';
import authRouter from './routes/auth';
import { handleError } from './logger';

Sentry.init({
  dsn: 'https://37b69e9b579d4552ae82eaab328036d0@o1120469.ingest.sentry.io/6156333',
  tracesSampleRate: 1.0,
});

export function createApp(dbConnect) {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser()).use(cors());

  dbConnect();

  const spec = JSON.parse(fs.readFileSync('./src/swagger/output.json'));

  router.use('/auth', authRouter.routes());
  withProtectedRoutes(router);

  app
    .use(json())
    .use(router.allowedMethods())
    .use(router.routes())
    .use(async (ctx, next) => {
      try {
        await next();
        if (ctx.status === 404) {
          handleError(
            new Error('Bad end point'),
            `request: ${JSON.stringify(ctx.request)}`,
          );
        }
      } catch (err) {
        handleError(err);
      }
    })
    .use(
      koaSwagger({
        routePrefix: '/swagger',
        swaggerOptions: {
          spec,
        },
      }),
    );

  app.on('error', (error, ctx) => {
    handleError(
      error,
      `request: ${JSON.stringify(ctx.request)}`,
      `body: ${JSON.stringify(ctx.request.body)}`,
    );
  });

  return app;
}
