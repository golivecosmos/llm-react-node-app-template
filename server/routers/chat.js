import Router from '@koa/router';

import { ChatService } from '../handlers/chat_handler.js';

const router = new Router({
  prefix: '/chat',
});

router.post('/', async (ctx) => {
  const handlerData = {};
  handlerData.body = ctx.request.body;
  handlerData.user = ctx.state.user;

  const res = await ChatService.startChat(handlerData);
  ctx.body = res;
});

export default router;
