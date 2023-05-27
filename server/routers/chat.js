import * as Router from '@koa/router';
import { Context } from 'koa';
import ChatService, { chatBodyInterface, handlerDataInterface } from '../handlers/chatHandler';

const router = new Router({
  prefix: '/v1/chat',
});

router.post('/', async (ctx) => {
  const handlerData = {};
  handlerData.body = ctx.request.body;
  handlerData.user = ctx.state.user;

  const res = await ChatService.startChat(handlerData);
  ctx.body = res;
});

export default router;
