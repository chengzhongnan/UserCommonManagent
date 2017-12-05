'use strict';

const Koa = require('koa');
const router = require('./router');
const path = require('path');
const staticPath = require('koa-static');
const bodyParser = require('koa-bodyparser');
const setting = require('./setting');

const app = new Koa();

// app.keys = ['nodejs session key for gameweb']; // needed for cookie-signing

// app.use(session({
//     store: mongoStore.create({
//         url: setting.mongo.url + '/session',
//         expiration: 1000 * 60 * 60 * 24 * 14
//     })
// }));

app.use(router.routes()).use(router.allowedMethods());

// app.use(staticPath('./public'));

app.listen(3000);