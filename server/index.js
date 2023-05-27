import * as fs from 'fs';
import * as Koa from 'koa';
import * as cors from '@koa/cors';
import { koaBody } from 'koa-body';
import * as dotenv from 'dotenv';
import * as logger from 'koa-logger';

dotenv.config();

// instantiate app
const app = new Koa();

app.use(koaBody({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
  multipart: true,
}));

app.use(logger());

// CORS
const corsOptions = {
  allowMethods: 'OPTIONS,GET,HEAD,POST,PUT,PATCH',
  allowHeaders: ['Authorization', 'Content-Type'],
  maxAge: 300000,
};
app.use(cors(corsOptions));

import defaultRouter from './routers/default';
import chatRouter from './routers/chat';

app.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
app.use(chatRouter.routes()).use(chatRouter.allowedMethods());

const PORT = process.env.PORT;

main().catch(err => console.log('Error starting app:', err));

async function main() {
  app.listen(PORT);
  console.log('Äpp is Started on port:', PORT);
}
