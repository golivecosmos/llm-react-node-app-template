import 'dotenv/config'
import * as fs from 'fs';
import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';

// instantiate app
const app = new Koa();

console.log('process ', process.env.OPENAI_API_KEY);
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

import defaultRouter from '../server/routers/default.js';
import chatRouter from './routers/chat.js';

app.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
app.use(chatRouter.routes()).use(chatRouter.allowedMethods());

const PORT = 3100;

main().catch(err => console.log('Error starting app:', err));

async function main() {
  console.log('Äpp is starting on port:', PORT);

  app.listen(PORT);
}
