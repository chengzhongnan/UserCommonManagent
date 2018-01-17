/**
 * 全局数据对象，主要用于进程间共享
 */
'use strict';

const setting = require('./setting');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ErrCode = require('./errcode');

mongoose.connect(setting.mongo.url, { useMongoClient: true });
mongoose.Promise = global.Promise;

const GlobalObjectSchema = new Schema({
    weixin_token : String,      // 微信登录token

});

const GlobalObjectModel = mongoose.model('global', GlobalObjectSchema, 'global');

module.exports = GlobalObjectModel;