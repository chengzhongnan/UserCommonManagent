'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');

router.get(routerPath.CreateRoom.path , async (ctx) => {
    // 检查比赛id
    
});

router.get(routerPath.AddRoom.path, async (ctx) => {

});

router.get(routerPath.GetParticipateRoom.path, async (ctx) => {

});