import Router from '@koa/router';

const router = new Router({});

router.get('/', async (ctx) => {
  ctx.body = {
    message: 'welcome to your LLM app server',
  };
  return;
});

export default router
