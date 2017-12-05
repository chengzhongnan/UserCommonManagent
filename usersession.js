'use strict';

const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const mongoConnectAsync = util.promisify(MongoClient.connect);
const bluebird = require('bluebird');
const setting = require('./setting');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const userModel = require('./userModel');

/**
 * 用户数据处理程序
 */
class UserSession {

    createNewToken() {
        var newToken = '';
        for(var i = 0 ; i < 16; i++) {
            newToken += ((Math.random() * 1000 >> 0) % 16).toString(16);
        }
        return newToken;
    }

    async updateToken(objectId, token) {

    }

    async userLogin(username, password) {
        var result = await userModel.findByUserName(username, password);
        if (result == undefined) {
            return null;
        }
        else {
            // 重置Token
            result.Token = createNewToken();
            await updateToken(result.ObjectID, result.Token);
            return result;
        }
    }

    async userLoginWithToken(token) {
        if(/[0-9A-Fa-f]{16}/.test(token)) {
            return await userModel.findByToken(token);
        } else {
            return null;
        }
    }

    async createUser(username, password) {
        
    }
}

module.exports = UserSession;