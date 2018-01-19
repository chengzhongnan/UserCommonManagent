'use strict';

module.exports = {
    mongo : {
        url: 'mongodb://127.0.0.1:27017/UCMService',
        host: '127.0.0.1',
        port: 27017,
        user: '',
        password: '',
        db: 'gmadmin'
    },
    gamesetting : {
        maxroomscore : 10000,   // 房间竞猜最大积分值
    },
    weixin : {
        appid : 'wxbd88616915567b8a',
        secretKey :  '1f949417a558cb28799ad57455be9110',
    },
    mysql : {
        host : '192.168.2.215',
        port : 3307,
        user : 'ucm',
        password : '123456',
        database : 'bocaizuqiu',
    }
};