import json from 'koa-json';
import Koa from 'koa';
import { registerMiddlewares } from '../middleware';

const app = new Koa();

app.use(json());

registerMiddlewares(app);

export { app };