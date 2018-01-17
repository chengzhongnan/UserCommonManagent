'use strict';

const Router = require('koa-router');

const router = new Router();

module.exports = router;

require('./route/checksession');
require('./route/user');
require('./route/getMacauslotBallGameList');
require('./route/room');
require('./route/weixin');
require('./route/anysdk');