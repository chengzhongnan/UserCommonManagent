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

    async findOnePromise(cb) {
        return new Promise((resolve, reject) => {
            userModel.find(cb, (err, res) => {
                if(err) {
                  reject(null);
                } else {
                    if (res[0] != null) {
                        resolve(res[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async findOneAndUpdatePromise(cb, doc) {
        return new Promise ((resolve, reject) => {
            UserModel.findOneAndUpdate(cb, doc, {new: true}, (err, res) => {
                if (err) {
                    reject (null);
                } else {
                    if(res == null) {
                        resolve(null);
                    } else {
                        resolve(res);
                    }
                }
            })
        });
    }

    createNewToken() {
        var newToken = '';
        for (var i = 0; i < 16; i++) {
            newToken += ((Math.random() * 1000 >> 0) % 16).toString(16);
        }
        return newToken;
    }

    async userLogin(username, password) {
        const newToken = this.createNewToken();
        const result = await this.findOneAndUpdatePromise({
            username : username,
            passwd : password,
        }, {
            $set : { token : newToken }
        });
        return result;
    }

    async createUser(username, password, nickname) {
        let result = { state: ErrCode.Success, newUser: null };
        const findUser = await this.findOnePromise({ username: username });
        if (findUser != null) {
            result.state = ErrCode.UserNameRepeated;
            return result;
        }
        const newUser = new UserModel({
            username: username,
            passwd: passwd,
            nickname: nickname,
            money: 0,
        });
        const createResult = await userModel.insertMany(newUser);
        if (createResult == null) {
            result.state = ErrCode.DatabaseError;
            return result;
        }

        result.newUser = createResult[0];
        return result;
    }

    async userLoginWithToken(token) {
        if (/[0-9A-Fa-f]{16}/.test(token)) {
            return await this.findOnePromise({ 
                token: token
            });
        } else {
            return null;
        }
    }

    async addJoinRoomRecord(userid, roomid, team, score, gametime) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndUpdate(userid, {
                $push: {
                    joinRecord: {
                        date: new Date(),      // 参与时间
                        roomid: roomid,        // 房间id
                        team: team,            // 竞猜队伍
                        score: score,          // 竞猜分数
                        gametime: gametime,    // 球赛时间
                    }
                }
            }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            })
        });
    }

    async findUserByWeixinOpenid(openid, access_token, refresh_token, headimgurl) {
        var doc = await userModel.findOneAndUpdatePromise({
            username : openid
        }, {
            $set: {
                'weixin.access_token' : access_token,
                'weixin.refresh_token' : refresh_token,
                'weixin.headimgurl' : headimgurl,
                'token' : this.createNewToken(),
            }
        });
        if (doc != null) {
            return doc.token;
        }
    }

    async createUserByWeixin(weixinData) {
        const newUser = new userModel({
            username : weixinData.common.uid,
            nickname : weixinData.data.nickname,
            money : 0,
            token: this.createNewToken(),
            weixin : {
                access_token : weixinData.data.access_token,
                expires_in : weixinData.data.expires_in,
                refresh_token : weixinData.data.refresh_token,
                openid : weixinData.data.openid,
                scope : weixinData.data.scope,
                unionid : weixinData.data.unionid,
                nickname : weixinData.data.user_info.nickname,
                sex : weixinData.data.user_info.sex,
                language : weixinData.data.user_info.language,
                city : weixinData.data.user_info.city,
                province : weixinData.data.user_info.province,
                country : weixinData.data.user_info.country,
                headimgurl : weixinData.data.user_info.headimgurl,
            }
        });

        const createResult = await userModel.insertMany(newUser);
        if (createResult == null) {
            return null;
        }

        return newUser.token;
    }
}

let ins = new UserSession();

module.exports = ins;