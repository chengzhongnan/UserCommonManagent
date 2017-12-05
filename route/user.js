'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');


router.get(routerPath.CreateUser.path, async(ctx) => {
    
    if(ctx.query.username == null || ctx.query.password == null || ctx.query.nickname == null) {
        const res = { status : false , errcode : ErrCode.UserNameInvalid };
        ctx.body = res; 
        return;
    }

    const createResult = await UserSession.CreateUser(ctx.query.username, 
        ctx.query.password, ctx.query.nickname);
    ctx.body = { state :  createResult };
});

router.get(routerPath.Login.path, async(ctx) => {
    if(ctx.userInfo == null) {
        const res = { status : false , errcode : ErrCode.UserNotLogin };
        ctx.body = res; 
        return;
    }
    const token = UserSession.createNewToken();
    await UserSession.updateToken(ctx.userInfo.ObjectID, token);
    const res = { 
        status : false , 
        errcode : ErrCode.Success,
        token : token  
    };
    ctx.body = res;
});