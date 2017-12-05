'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser( { explicitArray : false, ignoreAttrs : true });

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const Util = require('../util');

router.get(routerPath.GetMacauslotBallGameList.path, async(ctx) => {
    // 比赛数据xml
    // https://www.macauslot.com/soccer/xml/odds/odds.xml?nocache=59242
    // 比赛配置xml
    // https://www.macauslot.com/soccer/xml/odds/odds_config.xml?nocache=41653
    const odds_config = await Util.httpget('www.macauslot.com', 
        443, '/soccer/xml/odds/odds_config.xml', {nocache : 41653});
    ctx.body = odds_config;
});