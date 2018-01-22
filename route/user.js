'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const userSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');


router.get(routerPath.CreateUser.path, async(ctx) => {
    
    if(ctx.query.username == null || ctx.query.password == null || ctx.query.nickname == null) {
        const res = { state : false , errcode : ErrCode.UserNameInvalid };
        ctx.body = res; 
        return;
    }

    const createResult = await userSession.createUser(ctx.query.username, 
        ctx.query.password, ctx.query.nickname);
    ctx.body = createResult;
});

router.get(routerPath.Login.path, async(ctx) => {
    if(ctx.userInfo == null) {
        const res = { state : ErrCode.UserNotLogin };
        ctx.body = res; 
        return;
    }

    const res = { 
        state : ErrCode.Success , 
        token : ctx.userInfo.token  
    };
    ctx.body = res;
});

router.get(routerPath.GetUserInfo.path, async(ctx) => {
    if(ctx.userInfo == null) {
        const res = { state : ErrCode.UserNotLogin };
        ctx.body = res; 
        return;
    }

    const res = {
        state : ErrCode.Success,      // 登陆状态
        nickname : ctx.userInfo.nickname,   // 昵称
        money : ctx.userInfo.money,      // 拥有货币
        headimage : ctx.userInfo.headimage,   // 图像
        joinRecord : ctx.userInfo.joinRecord,
        joinRoom : ctx.userInfo.joinRoom,
        createRoom : ctx.userInfo.createRoom,
    };
    ctx.body = res;
});