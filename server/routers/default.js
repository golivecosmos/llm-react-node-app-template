import * as Router from '@koa/router';

const router = new Router({});

router.get('/', async (ctx) => {
  ctx.body = {
    message: 'welcome to cosmos',
  };
  return;
});

export default router;
