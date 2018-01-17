/**
 * 全局数据对象，主要用于进程间共享
 */
'use strict';

const globalObjectModel = require('./globalObjectModel');

class GlobalObjectSession {

    getObject() {
        return new Promise((resolve, reject) => {
            globalObjectModel.find((err, res) => {
                if(err) {
                    reject(null);
                } else {
                    if(res == null || res.length == 0) {
                        resolve(null);
                    } else {
                        resolve(res[0]);
                    }
                }
            })
        });
    }

    updateObject(doc) {
        return new Promise((resolve, reject) => {
            globalObjectModel.update({}, {
                $set : doc
            }, (err, raw) => {
                if(err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    async getWeixinToken() {
        var objModel = await this.getObject();
        return objModel.weixin_token;
    }

    async updateWeixinToken(token) {
        await this.updateObject({
            weixin_token : token
        });
    }
}

let ins = new GlobalObjectSession();
module.exports = ins;