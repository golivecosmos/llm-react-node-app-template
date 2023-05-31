import Router from '@koa/router';

import { ChatService } from '../handlers/chat_handler.js';

const router = new Router({
  prefix: '/chat',
});

const chatService = new ChatService();

router.post('/', async (ctx) => {
  const handlerData = {};
  handlerData.body = ctx.request.body;
  handlerData.user = ctx.state.user;

  const res = await chatService.startChat(handlerData);
  ctx.body = res;
});

router.post('/ingest', async (ctx) => {
  const handlerData = {};
  handlerData.files = ctx.request.files;
  handlerData.user = ctx.state.user;
  const res = await chatService.ingestFile(handlerData);
  ctx.body = res;
});

export default router;
