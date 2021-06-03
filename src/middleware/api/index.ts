import Router from '@koa/router';
import { RouterMiddleware } from '../../models/middleware';
import { registerKeyRoutes } from './key';

export const registerApiRoutes: RouterMiddleware = app => {
    const router = new Router();

    registerKeyRoutes(router);

    app.use('/api', router.routes(), router.allowedMethods());
};