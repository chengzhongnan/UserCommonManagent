'use strict';
/**
 * 该模块检测所有路由，如果登陆信息不对，则无法调用服务，客户端应该弹出登陆界面让用户登陆
 */

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const staticStrings = require('../static');

let pathMap = null;
const path2Routerobject = (path) => {
    if (pathMap === null) {
        pathMap = new Map();
        for(var key in routerPath) {
            var obj = routerPath[key];
            if (obj.hasOwnProperty(staticStrings.path)) {
                pathMap[obj[staticStrings.path]] = key;
            }
        }
    } 
    return pathMap[path];
}

/**
 * 协议参数检测
 * @param {*} path 协议路径
 * @param {*} queryObject 客户端传递过来的参数 
 */
const checkProtocalParameters = (path, queryObject) => {
    const pathKey = path2Routerobject(path);
    if (pathKey == null) {
        return false;
    }
    if (!routerPath.hasOwnProperty(pathKey)) {
        // 没有定义的协议
        return false;
    }
    const parameters = routerPath[pathKey].parameters;
    for(var key in parameters) {
        if(parameters[key].hasOwnProperty(staticStrings.CanNull)
            && parameters[key][staticStrings.CanNull]) {
            // 可空
            continue;
        }
        if(!queryObject[key]) {
            return false;
        }
    }
    return true;
}

router.get(routerPath.Root.path, async(ctx, next) =>{
    const username = ctx.query.username;
    const passwd = ctx.query.password;
    const token = ctx.query.token;

    // 检查协议参数
    if(!checkProtocalParameters(ctx.path, ctx.query)) {
        const res = { status : false , errcode : ErrCode.ParametersError };
        ctx.body = res;
        return;
    }

    const user = new UserSession();
    let userInfo;
    if(passwd == null) {
        userInfo = await user.userLoginWithToken(token);
    } else {
        userInfo = await user.userLogin(username, passwd);
    }

    if (userInfo == null) {           
        const res = { status : false , errcode : ErrCode.UserNotLogin };
        ctx.body = res;
        return;
    }

    ctx.userInfo = userInfo;
    await next();
});