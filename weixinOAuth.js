'use strict';

const setting = require('./setting');
const OAuth = require('co-wechat-oauth');
const globalObjectSession = require('./globalObjectSession');

const oauthApi = new OAuth(setting.weixin.appid, setting.weixin.secretKey, async function (openid) {
    // 传入一个根据 openid 获取对应的全局 token 的方法
    return await globalObjectSession.getWeixinToken()
}, async function (openid, token) {
    // 请将 token 存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis 等
    // 这样才能在 cluster 模式及多机情况下使用，以下为写入到文件的示例
    // 持久化时请注意，每个openid都对应一个唯一的token!
    await globalObjectSession.updateWeixinToken(token);
});

module.exports = oauthApi;