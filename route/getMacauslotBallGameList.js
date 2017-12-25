'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const Util = require('../util');
const ballGame = require('../ballgame');

/**
 * 解析球赛数据
 * @param {*} odds 
 * @param {*} odds_config 
 */

 /**
  * 解析:	
  * 开赛时间[gt]
  * 主队[sh][]
  * 客队[sa][]
  * 主队让球[ho]
  * 客队让球[ao]
  * 标准盘 主[wh] 客[wa] 和[wd]
  * 上下盘 主[][oo] 客[][uo]
  */
// const 

router.get(routerPath.GetMacauslotBallGameList.path, async(ctx) => {
    // 比赛数据xml
    // https://www.macauslot.com/soccer/xml/odds/odds.xml?nocache=59242
    // 比赛配置xml
    // https://www.macauslot.com/soccer/xml/odds/odds_config.xml?nocache=41653
    const odds_config_XML = await Util.httpget('www.macauslot.com', 
        443, '/soccer/xml/odds/odds_config.xml', {nocache : 41653});
    
    const odds_config = await Util.parseXML(odds_config_XML);
        
    const odds_XML = await Util.httpget('www.macauslot.com', 
    443, '/soccer/xml/odds/odds.xml', {nocache : 41653});

    const odds = await Util.parseXML(odds_XML);

    const ballGameList = ballGame.parseMacauslotBallGameList(odds, odds_config);
    ctx.body = ballGameList;
});

router.get(routerPath.testBallGame.path, async(ctx) => {
    await ballGame.test();
    ctx.body = 'ok';
})