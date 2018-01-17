'use strict';

const router = require('../router');
const routePath = require('../routepath');

router.get(routePath.anysdkCallback.path, async(ctx) => {
    console.log(ctx.query);
    ctx.body = {};
})