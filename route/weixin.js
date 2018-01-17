'use strict';

const router = require('../router');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const setting = require('../setting');

const client = require('../weixinOAuth');

router.get(routerPath.getWeixinWebLoginUrl.path, async(ctx) => {
    const url = client.getAuthorizeURLForWebsite('http://www.163.com');
    ctx.body = url;
})