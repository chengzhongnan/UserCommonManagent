'use strict';

const setting = require('./setting');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ErrCode = require('./errcode');

mongoose.connect(setting.mongo.url, { useMongoClient: true });
mongoose.Promise = global.Promise;

const UserModelSchema = new Schema({ 
    username: String,           // 注册用户名  
    passwd: String,             // 注册密码（MD5加密，客户端传递用户输入MD5码，
                                // 服务器端对客户端的MD5码加特定字符串后再次MD5码，再与数据库比较）
    token: String,              // 登陆成功后的Token信息，生成后在第二天失效
    thirdToken: String,         // 第三方登陆Token，服务器在拿到客户端的第三方Token后，会到第三方服务器验证，验证成功生成本地Token
    money: Number,              // 用户拥有的货币
    createRoom : [Number],      // 用户创建的房间id
    joinRoom : [Number],        // 用户参与的房间id
    nickname : String,          // 昵称
    joinRecord : [{             // 参与竞猜记录列表
        date : Date,            // 参与时间
        roomid : Number,        // 房间id
        team : String,          // 竞猜队伍
        score : Number,         // 竞猜分数
        gametime : String,      // 球赛开启时间
    }],
    weixin : {
        access_token : String,
        expires_in : Number,
        refresh_token : String,
        openid : String,
        scope : String,
        unionid : String,
        nickname : String,
        sex : Number,
        language : String,
        city : String,
        province : String,
        country : String,
        headimgurl : String,
        unionid : String,
    }
});

const UserModel = mongoose.model('user', UserModelSchema, 'user');

// UserModel.findByUserName = (userName, passWD) => {
//     return UserModel.findOnePromise({ 
//         username: userName,
//         passwd: passWD 
//     }); 
//     // new Promise((resolve, reject) => {
//     //     UserModel.find({ 
//     //         username: userName,
//     //         passwd: passWD 
//     //     }, (err, res) => {
//     //         if(err) {
//     //           reject(undefined);
//     //         } else {
//     //             resolve(res[0]);
//     //         }
//     //     });
//     // });
// };

// UserModel.findByToken = (token) => {
//     return UserModel.findOnePromise({ 
//         token: token
//     });
//     //  new Promise((resolve, reject) => {
//     //     UserModel.find({ 
//     //         token: token
//     //     }, (err, res) => {
//     //         if(err) {
//     //           reject(undefined);
//     //         } else {
//     //             resolve(res[0]);
//     //         }
//     //     });
//     // });
// };

// UserModel.updateToken = (id, newToken) => {
//     return new Promise((resolve, reject) => {
//         UserModel.findByIdAndUpdate(id, {
//             token : newToken   
//         }, (err, result) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         })
//     });
// }

// UserModel.updateThirdToken = (id, newToken) => {
//     return new Promise((resolve, reject) => {
//         UserModel.findByIdAndUpdate(id, {
//             token : newToken   
//         }, (err, result) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         })
//     });
// }

// UserModel.createNewUser = async (username, passwd, nickname) => {
//     let result = {state : ErrCode.Success, newUser : null };
//     const findUser = await UserModel.findOnePromise({username : username});
//     if (findUser != null) {
//         result.state = ErrCode.UserNameRepeated;
//         return result;
//     }
//     const newUser = new UserModel({
//         username : username, 
//         passwd : passwd, 
//         nickname : nickname,
//         money : 0,
//     });
//     const createResult = await UserModel.insertMany(newUser);
//     if (createResult == null) {
//         result.state = ErrCode.DatabaseError;
//         return result;
//     }

//     result.newUser = createResult[0];
//     return result;
// };

// UserModel.addJoinRoomRecord = async (userid, roomid, team, score, gamestarttime) => {
//     return new Promise((resolve, reject) => {
//         UserModel.findByIdAndUpdate(userid, {
//             $push : {joinRecord : {
//                 date : new Date(),      // 参与时间
//                 roomid : roomid,        // 房间id
//                 team : team,            // 竞猜队伍
//                 score : score,          // 竞猜分数
//                 gametime : gametime,    // 球赛时间
//             }}
//         }, function(err, result) {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(result[0]);
//             }
//         } )
//     });
// };

module.exports = UserModel;